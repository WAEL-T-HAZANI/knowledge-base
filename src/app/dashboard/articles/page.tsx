"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/src/store/dashboard";
import { useArticleStore } from "@/src/store/articles";
import { useTranslations } from "next-intl";
import {
  FileDown,
  FileSpreadsheet,
  Trash2,
  Plus,
  Pencil,
  X,
  Share2,
} from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ArticlesPage() {
  const router = useRouter();
  const { setActiveTab } = useDashboardStore();
  const { articles, deleteArticle, reorderArticles } = useArticleStore();
  const t = useTranslations("articles");

  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  useEffect(() => setActiveTab("articles"), [setActiveTab]);

  const handleAdd = () => router.push("/dashboard/articles/new");

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = articles.findIndex((a) => a.id === active.id);
    const newIndex = articles.findIndex((a) => a.id === over.id);
    reorderArticles(arrayMove(articles, oldIndex, newIndex));
  };

  // ✅ Export Single Article to PDF
  const exportPDF = (article: any) => {
    const doc = new jsPDF();
    doc.text(article.title, 10, 10);
    doc.text(`${t("category_label")}: ${t(article.category)}`, 10, 20);
    doc.text(`${t("tags_label")}: ${article.tags.join(", ")}`, 10, 30);
    doc.text(
      `${t("publish_label")}: ${
        article.published ? t("published") : t("draft")
      }`,
      10,
      40
    );
    doc.text(
      `${t("date_label")}: ${new Date(article.date).toLocaleString()}`,
      10,
      50
    );
    doc.text(`${t("content_label")}:`, 10, 60);
    doc.text(article.content.replace(/<[^>]+>/g, ""), 10, 70);
    doc.save(`${article.title}.pdf`);
  };

  // ✅ Export All Articles to Excel
  const exportExcel = () => {
    if (articles.length === 0) return;

    const data = articles.map((a) => ({
      Title: a.title,
      Category: a.category,
      Tags: a.tags.join(", "),
      Published: a.published ? t("published") : t("draft"),
      Date: new Date(a.date).toLocaleString(),
      Content: a.content.replace(/<[^>]+>/g, ""),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Articles");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "articles.xlsx");
  };

  // ✅ Share Article
  const shareArticle = async (article: any) => {
    const shareData = {
      title: article.title,
      text: article.content.replace(/<[^>]+>/g, "").slice(0, 100) + "...",
      url: `${window.location.origin}/dashboard/articles/view/${article.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share canceled or failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert(t("link_copied") || "Link copied to clipboard!");
      } catch {
        alert(
          t("share_not_supported") || "Sharing not supported in this browser."
        );
      }
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-[var(--background)] text-[var(--foreground)] border border-[var(--borderColor)] shadow-inner space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-semibold">{t("list_title")}</h2>

        <div className="flex items-center gap-3">
          {/* ✅ Excel Export */}
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition"
          >
            <FileSpreadsheet size={18} />
            {t("export_excel") || "Export Excel"}
          </button>

          {/* ➕ Add Article */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
          >
            <Plus size={18} />
            {t("add_article")}
          </button>
        </div>
      </div>

      {/* Article List */}
      {articles.length === 0 ? (
        <p className="text-gray-500">{t("no_articles")}</p>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={articles.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {articles.map((article) => (
                <SortableArticleItem
                  key={article.id}
                  article={article}
                  onDelete={() => deleteArticle(article.id)}
                  onExport={() => exportPDF(article)}
                  onEdit={() =>
                    router.push(`/dashboard/articles/edit/${article.id}`)
                  }
                  onView={() => setSelectedArticle(article)}
                  onShare={() => shareArticle(article)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Article Preview Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white dark:bg-[var(--background-secondary)] text-black dark:text-[var(--foreground)] rounded-2xl shadow-2xl max-w-3xl w-full mx-4 relative overflow-y-auto max-h-[90vh] border border-[var(--borderColor)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition"
            >
              <X size={22} />
            </button>

            {/* ✅ Show cover only if article has a valid image */}
            {selectedArticle.cover && selectedArticle.cover.trim() !== "" && (
              <img
                src={selectedArticle.cover}
                alt="cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="w-full h-64 object-cover rounded-t-2xl border-b border-[var(--borderColor)]"
              />
            )}

            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {selectedArticle.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-[var(--secondary)]">
                  {t(selectedArticle.category)} •{" "}
                  {selectedArticle.published ? t("published") : t("draft")} •{" "}
                  {new Date(selectedArticle.date).toLocaleString()}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-[var(--borderColor)] pt-4">
                <h3 className="text-lg font-semibold mb-2">
                  {t("tags_label")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags?.length ? (
                    selectedArticle.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-[var(--background)] text-gray-700 dark:text-[var(--foreground)] rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No tags available
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-[var(--borderColor)] pt-4">
                <h3 className="text-lg font-semibold mb-2">
                  {t("content_label")}
                </h3>
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Sortable Item Component */
function SortableArticleItem({
  article,
  onDelete,
  onExport,
  onEdit,
  onView,
  onShare,
}: any) {
  const { setNodeRef, transform, transition, listeners, attributes } =
    useSortable({ id: article.id });
  const t = useTranslations("articles");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center p-4 border border-[var(--borderColor)] rounded-md bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--background)] transition cursor-pointer"
      onClick={() => onView()}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab select-none text-[var(--secondary)]"
          onClick={(e) => e.stopPropagation()}
        >
          ☰
        </div>
        <div>
          <p className="font-semibold">{article.title}</p>
          <p className="text-sm text-[var(--secondary)]">
            {t(article.category)} •{" "}
            {article.published ? t("published") : t("draft")} •{" "}
            {new Date(article.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onEdit}
          className="p-2 rounded-md border border-yellow-400 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onExport}
          className="p-2 rounded-md border border-blue-400 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
        >
          <FileDown size={16} />
        </button>
        <button
          onClick={onShare}
          className="p-2 rounded-md border border-purple-400 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900 transition"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-md border border-red-400 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
