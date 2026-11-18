import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./LegalPage.module.css";

export interface LegalSection {
  title: string;
  body: string[];
}

// قالب مشترك لصفحتي الخصوصية والشروط (مكوّن خادم: لا JavaScript على العميل).
export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <article className={`container ${styles.article}`}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>{updated}</p>
          <p className={styles.intro}>{intro}</p>
          {sections.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
