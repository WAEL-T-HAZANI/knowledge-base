"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDashboardStore } from "@/src/store/dashboard";
import { useLocaleStore } from "@/src/store/locale";
import Button from "@/src/components/ui/Button";

// ✅ Lazy load ArticleForm safely (no loader crash)
const ArticleForm = dynamic(
  () => import("@/src/components/articles/ArticleForm"),
  {
    ssr: false,
  }
);

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { setActiveTab } = useDashboardStore();
  const { dir } = useLocaleStore();
  const t = useTranslations("articles");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setActiveTab("articles", "edit");
  }, [setActiveTab]);

  if (!mounted) return null; // prevents hydration mismatch on refresh

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => router.push("/dashboard/articles")}
          variant="secondary"
          className="flex items-center gap-2 border border-[var(--borderColor)] text-[var(--foreground)] px-4 py-2 rounded-md hover:bg-[var(--primary)] hover:text-white transition"
        >
          {dir === "rtl" ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {t("back_to_articles")}
        </Button>
      </div>

      <ArticleForm articleId={id as string} />
    </div>
  );
}
