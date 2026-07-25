import { defineType, defineField } from "sanity";

export default defineType({
  name: "article",
  title: "บทความ",
  type: "document",
  fields: [
    defineField({ name: "title", title: "หัวข้อ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "coverImage", title: "รูปปก", type: "image", options: { hotspot: true } }),
    defineField({ name: "topic", title: "หมวด (เช่น ฟื้นต้น-ทำใบ, ปรับปรุงดิน)", type: "string" }),
    defineField({ name: "description", title: "คำโปรย / SEO (1–2 ประโยค)", type: "text", rows: 2 }),
    defineField({ name: "summary", title: "สรุปคำตอบสั้น (โชว์ด้านบน + สำหรับ AI/Google)", type: "text", rows: 3 }),
    defineField({
      name: "bodyMd",
      title: "เนื้อหา",
      description: "ขึ้นหัวข้อย่อยด้วย ## แล้วเว้นวรรค · ทำรายการด้วย - แล้วเว้นวรรค · เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่",
      type: "text",
      rows: 20,
    }),
    defineField({
      name: "faq", title: "คำถามที่พบบ่อย (FAQ)", type: "array",
      of: [{ type: "object", fields: [{ name: "question", type: "string", title: "คำถาม" }, { name: "answer", type: "text", title: "คำตอบ" }] }],
    }),
  ],
  preview: { select: { title: "title", subtitle: "topic", media: "coverImage" } },
});
