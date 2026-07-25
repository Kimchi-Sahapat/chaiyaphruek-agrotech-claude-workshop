import { defineType, defineField } from "sanity";

export default defineType({
  name: "banner",
  title: "แบนเนอร์ / โปรโมชัน",
  type: "document",
  fields: [
    defineField({ name: "image", title: "อาร์ตเวิร์กแบนเนอร์", type: "image", options: { hotspot: true } }),
    defineField({ name: "title", title: "หัวข้อ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "คำโปรย", type: "string" }),
    defineField({ name: "link", title: "ปุ่มลิงก์ไปยัง (เช่น /catalogue, /catalogue?tag=flash, /profile)", type: "string", initialValue: "/catalogue" }),
    defineField({ name: "startDate", title: "เริ่มแสดง", type: "datetime" }),
    defineField({ name: "endDate", title: "หยุดแสดง", type: "datetime" }),
    defineField({ name: "order", title: "ลำดับ", type: "number", initialValue: 0 }),
    defineField({ name: "active", title: "เปิดใช้งาน", type: "boolean", initialValue: true }),
  ],
  orderings: [{ name: "order", title: "ลำดับ", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "subtitle", media: "image" } },
});
