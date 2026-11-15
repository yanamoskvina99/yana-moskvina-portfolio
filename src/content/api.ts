import { supabase, isSupabaseConfigured } from "../lib/supabase"
import { defaultContent } from "./defaults"
import type {
  ContactsContent,
  FaqItem,
  PriceItem,
  ProjectItem,
  SectionKey,
  ServiceItem,
  SiteContent,
  StepItem,
} from "./types"

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {}
}

/** CTA must stay 3 short lines — old CMS saves put the whole phrase in one field. */
export function normalizeContacts(raw: unknown): ContactsContent {
  const base = defaultContent.contacts
  const p = asRecord(raw)
  const merged = { ...base, ...p } as ContactsContent & { ctaTitle?: string }
  const line1 = String(merged.ctaLine1 || "")
  const line2 = String(merged.ctaLine2 || "")
  const line3 = String(merged.ctaLine3 || "")
  const legacy = String(merged.ctaTitle || "")
  const broken =
    Boolean(legacy) ||
    line1.split(/\s+/).filter(Boolean).length > 3 ||
    /проект|начинается|здесь/i.test(line1)

  if (broken) {
    return {
      ...merged,
      ctaLine1: base.ctaLine1,
      ctaLine2: base.ctaLine2,
      ctaLine3: base.ctaLine3,
    }
  }
  return {
    ...merged,
    ctaLine1: line1 || base.ctaLine1,
    ctaLine2: line2 || base.ctaLine2,
    ctaLine3: line3 || base.ctaLine3,
  }
}

function mergeSection<T extends object>(base: T, patch: unknown): T {
  const p = asRecord(patch)
  if (!Object.keys(p).length) return base
  return { ...base, ...p } as T
}

export async function fetchPublishedContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured || !supabase) return defaultContent

  try {
    const [
      sectionsRes,
      servicesRes,
      projectsRes,
      pricesRes,
      stepsRes,
      faqRes,
    ] = await Promise.all([
      supabase.from("site_sections").select("key, published"),
      supabase
        .from("services")
        .select("id, payload, sort_order, is_published")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("projects")
        .select("id, payload, sort_order, is_published")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("prices")
        .select("id, payload, sort_order, is_published")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("steps")
        .select("id, payload, sort_order, is_published")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("faq")
        .select("id, question, answer, sort_order, is_published")
        .eq("is_published", true)
        .order("sort_order"),
    ])

    const sectionMap = new Map<string, unknown>()
    for (const row of sectionsRes.data ?? []) {
      sectionMap.set(row.key, row.published)
    }

    const content: SiteContent = {
      ...defaultContent,
      hero: mergeSection(defaultContent.hero, sectionMap.get("hero")),
      about: mergeSection(defaultContent.about, sectionMap.get("about")),
      servicesIntro: mergeSection(
        defaultContent.servicesIntro,
        sectionMap.get("services_intro"),
      ),
      portfolioIntro: mergeSection(
        defaultContent.portfolioIntro,
        sectionMap.get("portfolio_intro"),
      ),
      contacts: normalizeContacts(sectionMap.get("contacts")),
      seo: mergeSection(defaultContent.seo, sectionMap.get("seo")),
      marquee: Array.isArray(sectionMap.get("marquee"))
        ? (sectionMap.get("marquee") as string[])
        : defaultContent.marquee,
      services:
        (servicesRes.data ?? []).length > 0
          ? (servicesRes.data ?? []).map((row) => ({
              ...(row.payload as Omit<ServiceItem, "id" | "sortOrder" | "isPublished">),
              id: row.id,
              sortOrder: row.sort_order,
              isPublished: row.is_published,
            }))
          : defaultContent.services,
      projects:
        (projectsRes.data ?? []).length > 0
          ? (projectsRes.data ?? []).map((row) => ({
              ...(row.payload as Omit<ProjectItem, "id" | "sortOrder" | "isPublished">),
              id: row.id,
              sortOrder: row.sort_order,
              isPublished: row.is_published,
            }))
          : defaultContent.projects,
      prices:
        (pricesRes.data ?? []).length > 0
          ? (pricesRes.data ?? []).map((row) => ({
              ...(row.payload as Omit<PriceItem, "id" | "sortOrder" | "isPublished">),
              id: row.id,
              sortOrder: row.sort_order,
              isPublished: row.is_published,
            }))
          : defaultContent.prices,
      steps:
        (stepsRes.data ?? []).length > 0
          ? (stepsRes.data ?? []).map((row) => ({
              ...(row.payload as Omit<StepItem, "id" | "sortOrder" | "isPublished">),
              id: row.id,
              sortOrder: row.sort_order,
              isPublished: row.is_published,
            }))
          : defaultContent.steps,
      faqs:
        (faqRes.data ?? []).length > 0
          ? (faqRes.data ?? []).map((row) => ({
              id: row.id,
              question: row.question,
              answer: row.answer,
              sortOrder: row.sort_order,
              isPublished: row.is_published,
            }))
          : defaultContent.faqs,
    }

    return content
  } catch (err) {
    console.warn("CMS fetch failed, using defaults", err)
    return defaultContent
  }
}

export async function fetchSectionDraft(key: SectionKey) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("site_sections")
    .select("key, draft, published, updated_at")
    .eq("key", key)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function saveSectionDraft(key: SectionKey, draft: unknown) {
  if (!supabase) throw new Error("Supabase не настроен")
  const { data: existing } = await supabase
    .from("site_sections")
    .select("published")
    .eq("key", key)
    .maybeSingle()

  const { error } = await supabase.from("site_sections").upsert({
    key,
    draft,
    published: existing?.published ?? draft,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
  await writeRevision("section", key, draft)
}

export async function publishSection(key: SectionKey, data: unknown) {
  if (!supabase) throw new Error("Supabase не настроен")
  const { error } = await supabase.from("site_sections").upsert({
    key,
    draft: data,
    published: data,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
  await writeRevision("section", key, data)
}

async function writeRevision(
  entityType: string,
  entityId: string,
  snapshot: unknown,
) {
  if (!supabase) return
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await supabase.from("revisions").insert({
    entity_type: entityType,
    entity_id: entityId,
    snapshot,
    created_by: user?.id ?? null,
  })
}

export async function fetchCollection(table: string) {
  if (!supabase) throw new Error("Supabase не настроен")
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort_order")
  if (error) throw error
  return data ?? []
}

export async function upsertCollectionRow(
  table: string,
  row: Record<string, unknown>,
) {
  if (!supabase) throw new Error("Supabase не настроен")
  const { data, error } = await supabase
    .from(table)
    .upsert({ ...row, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  await writeRevision(table, String(data.id), data)
  return data
}

export async function deleteCollectionRow(table: string, id: string) {
  if (!supabase) throw new Error("Supabase не настроен")
  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) throw error
}

export async function fetchRevisions(entityType: string, entityId: string) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from("revisions")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(20)
  if (error) throw error
  return data ?? []
}

export async function uploadMedia(file: File, alt = "") {
  if (!supabase) throw new Error("Supabase не настроен")
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin"
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
  const { error: upErr } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "3600", upsert: false })
  if (upErr) throw upErr
  const { data: pub } = supabase.storage.from("media").getPublicUrl(path)
  const { data, error } = await supabase
    .from("media")
    .insert({
      path,
      url: pub.publicUrl,
      filename: file.name,
      mime: file.type,
      size_bytes: file.size,
      alt,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listMedia() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function updateMediaAlt(id: string, alt: string) {
  if (!supabase) throw new Error("Supabase не настроен")
  const { error } = await supabase.from("media").update({ alt }).eq("id", id)
  if (error) throw error
}

export async function deleteMedia(id: string, path: string) {
  if (!supabase) throw new Error("Supabase не настроен")
  const { error: delErr } = await supabase.storage.from("media").remove([path])
  if (delErr) throw delErr
  const { error } = await supabase.from("media").delete().eq("id", id)
  if (error) throw error
}

/** Seed DB from local defaults (admin only, run once from Settings) */
export async function seedFromDefaults() {
  if (!supabase) throw new Error("Supabase не настроен")
  const d = defaultContent

  const sections: Array<{ key: SectionKey; data: unknown }> = [
    { key: "hero", data: d.hero },
    { key: "about", data: d.about },
    { key: "services_intro", data: d.servicesIntro },
    { key: "portfolio_intro", data: d.portfolioIntro },
    { key: "contacts", data: d.contacts },
    { key: "seo", data: d.seo },
    { key: "marquee", data: d.marquee },
  ]

  for (const s of sections) {
    await supabase.from("site_sections").upsert({
      key: s.key,
      draft: s.data,
      published: s.data,
      updated_at: new Date().toISOString(),
    })
  }

  // Clear and reseed collections only if empty
  const { count: svcCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
  if (!svcCount) {
    for (const item of d.services) {
      const { id: _id, sortOrder, isPublished, ...payload } = item
      await supabase.from("services").insert({
        payload,
        sort_order: sortOrder,
        is_published: isPublished,
      })
    }
  }

  const { count: projCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
  if (!projCount) {
    for (const item of d.projects) {
      const { id: _id, sortOrder, isPublished, ...payload } = item
      await supabase.from("projects").insert({
        payload,
        sort_order: sortOrder,
        is_published: isPublished,
      })
    }
  }

  const { count: priceCount } = await supabase
    .from("prices")
    .select("*", { count: "exact", head: true })
  if (!priceCount) {
    for (const item of d.prices) {
      const { id: _id, sortOrder, isPublished, ...payload } = item
      await supabase.from("prices").insert({
        payload,
        sort_order: sortOrder,
        is_published: isPublished,
      })
    }
  }

  const { count: stepCount } = await supabase
    .from("steps")
    .select("*", { count: "exact", head: true })
  if (!stepCount) {
    for (const item of d.steps) {
      const { id: _id, sortOrder, isPublished, ...payload } = item
      await supabase.from("steps").insert({
        payload,
        sort_order: sortOrder,
        is_published: isPublished,
      })
    }
  }

  const { count: faqCount } = await supabase
    .from("faq")
    .select("*", { count: "exact", head: true })
  if (!faqCount) {
    for (const item of d.faqs) {
      await supabase.from("faq").insert({
        question: item.question,
        answer: item.answer,
        sort_order: item.sortOrder,
        is_published: item.isPublished,
      })
    }
  }
}
