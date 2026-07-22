import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/content/articles";
import { STARTER, byCodeMap } from "@/lib/products";
import { SHOP } from "@/lib/shop";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    openGraph: { title: a.title, description: a.description, type: "article" },
  };
}

// Very small markdown renderer for our trusted article bodies.
function renderBody(md: string) {
  const blocks = md.split("\n").filter((l) => l.trim() !== "");
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (key: number) => {
    if (bullets.length) {
      out.push(
        <ul key={`ul-${key}`}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };
  blocks.forEach((line, i) => {
    if (line.startsWith("## ")) {
      flush(i);
      out.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
    } else {
      flush(i);
      out.push(<p key={i}>{line}</p>);
    }
  });
  flush(blocks.length);
  return out;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const byCode = byCodeMap(STARTER);
  const related = article.related
    .map((c) => byCode[c])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // GEO: FAQPage structured data so AI/Google can quote the answers.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="scr prose">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <span className="arttopic">{article.topic}</span>
      <h1 className="t" style={{ fontSize: 22 }}>
        {article.title}
      </h1>

      {/* Answer-Ready lead */}
      <div className="answer-ready">{article.summary}</div>

      {renderBody(article.bodyMd)}

      {related.length > 0 && (
        <div className="related">
          <h2>สินค้าที่เกี่ยวข้อง</h2>
          <div className="chips">
            {related.map((p) => (
              <Link key={p.code} className="chip" href="/catalogue">
                {p.name}
              </Link>
            ))}
          </div>
          <Link className="bigbtn b-green" href="/catalogue">
            🛒 ดูสินค้า / สั่งของ
          </Link>
        </div>
      )}

      <h2>คำถามที่พบบ่อย (FAQ)</h2>
      <div className="faq">
        {article.faq.map((f, i) => (
          <details key={i} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <p style={{ margin: 0 }}>
          ปรึกษาการดูแลสวนทุเรียนเพิ่มเติมกับทีมชัยพฤกษ์ อโกรเทค — บอกพืช ระยะ และอาการได้เลย
        </p>
      </div>
      <a className="bigbtn b-line" href={SHOP.lineAddUrl}>
        💬 ปรึกษาทางไลน์ {SHOP.lineId}
      </a>
    </article>
  );
}
