import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/content/articles";

export const metadata: Metadata = {
  title: "ความรู้ชาวสวน — บทความดูแลสวนทุเรียน",
  description:
    "รวมบทความความรู้การดูแลสวนทุเรียนจากชัยพฤกษ์ อโกรเทค — ฟื้นต้นทำใบ ปรับดินกรด จัดการน้ำหน้าฝน และอื่นๆ",
};

export default function ArticlesPage() {
  return (
    <section className="scr">
      <h1 className="t">📖 ความรู้ชาวสวน</h1>
      <div className="plist">
        {ARTICLES.map((a) => (
          <Link className="artcard" key={a.slug} href={`/articles/${a.slug}`}>
            <span className="arttopic">{a.topic}</span>
            <span className="artname">{a.title}</span>
            <span className="artsum">{a.summary}</span>
            <span className="artmore">อ่านต่อ →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
