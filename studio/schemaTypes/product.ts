import { defineType, defineField } from "sanity";

// Fields ordered so the everyday edits (name, photos, descriptions) sit on top.
export default defineType({
  name: "product",
  title: "สินค้า",
  type: "document",
  fields: [
    defineField({ name: "name", title: "ชื่อสินค้า", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photos", title: "รูปสินค้า", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "brand", title: "แบรนด์", type: "string" }),
    defineField({ name: "supplier", title: "ผู้จำหน่าย", type: "string" }),
    defineField({ name: "category", title: "กลุ่ม / หมวดหมู่", type: "string" }),
    defineField({ name: "shortDescription", title: "ข้อมูลแบบย่อ", type: "text", rows: 2 }),
    defineField({ name: "description", title: "ข้อมูลโดยละเอียด", type: "text", rows: 5 }),
    defineField({ name: "activeIngredient", title: "ชื่อสามัญ / สารสำคัญ", type: "string" }),
    defineField({ name: "formulation", title: "เนื้อสาร", type: "string" }),
    defineField({ name: "usageRate", title: "อัตราการใช้ (ต่อ 200 ลิตร)", type: "string" }),
    defineField({ name: "code", title: "รหัส SKU (อ้างอิง)", type: "string" }),
    defineField({ name: "bestSeller", title: "ป้าย ‘ขายดี’", type: "boolean", initialValue: false }),
    defineField({
      name: "campaignTags", title: "แท็กแคมเปญ", type: "array",
      of: [{ type: "string" }],
      options: { list: [{ title: "แฟมิลี", value: "family" }, { title: "โซตัส", value: "sotus" }, { title: "Flash Sale", value: "flash" }] },
    }),
    defineField({ name: "visible", title: "แสดงบนเว็บ", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "name", subtitle: "brand", media: "photos.0" } },
});
