import { defineType, defineField } from "sanity";

export default defineType({
  name: "article",
  title: "บทความ",
  type: "document",
  fields: [
    defineField({ name: "title", title: "หัวข้อ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "coverImage", title: "รูปปก", type: "image", options: { hotspot: true } }),
    defineField({ name: "topic", title: "หัวข้อหมวด", type: "string" }),
    defineField({ name: "summary", title: "สรุปคำตอบสั้น (GEO)", type: "text", rows: 3 }),
    defineField({ name: "body", title: "เนื้อหา", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "faq", title: "คำถามที่พบบ่อย", type: "array",
      of: [{ type: "object", fields: [{ name: "question", type: "string", title: "คำถาม" }, { name: "answer", type: "text", title: "คำตอบ" }] }],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "topic", media: "coverImage" } },
});
