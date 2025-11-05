"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useArticleStore } from "@/src/store/articles";
import { useLocaleStore } from "@/src/store/locale";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "@/src/components/ui/Button";

export default function ViewArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { dir } = useLocaleStore();
  const { getArticleById } = useArticleStore();
  const t = useTranslations("articles");

  const article = getArticleById(id as string);

  useEffect(() => {
    if (!article) {
      console.warn("Article not found for ID:", id);
    }
  }, [article, id]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-[var(--foreground)]">
        <p className="text-lg mb-4">{t("no_articles")}</p>
        <Button
          onClick={() => router.push("/dashboard/articles")}
          className="border border-[var(--borderColor)] px-4 py-2 rounded-md hover:bg-[var(--primary)] hover:text-white transition"
        >
          {t("back_to_articles")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 text-[var(--foreground)] bg-[var(--background)] min-h-screen">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <Button
          onClick={() => router.push("/dashboard/articles")}
          variant="secondary"
          className="flex items-center gap-2 border border-[var(--borderColor)] text-[var(--foreground)] px-4 py-2 rounded-md hover:bg-[var(--primary)] hover:text-white transition"
        >
          {dir === "rtl" ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {t("back_to_articles")}
        </Button>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto bg-[var(--background-secondary)] p-8 rounded-2xl border border-[var(--borderColor)] shadow-md space-y-6">
        {article.cover && (
          <div className="w-full mb-6">
            <img
              src={article.cover}
              alt="cover"
              className="w-full h-64 object-cover rounded-lg border border-[var(--borderColor)] shadow-sm"
            />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          <p className="text-sm text-[var(--secondary)]">
            {t(article.category)} •{" "}
            {article.published ? t("published") : t("draft")} •{" "}
            {new Date(article.date).toLocaleString()}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">{t("tags_label")}</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags?.length ? (
              article.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm rounded-full bg-[var(--primary)]/20 border border-[var(--primary)] text-[var(--primary)]"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-[var(--secondary)]">{t("no_tags")}</span>
            )}
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none border-t border-[var(--borderColor)] pt-4">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
    </div>
  );
}
