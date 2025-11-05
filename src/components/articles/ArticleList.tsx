"use client";

import { useArticleStore } from "@/src/store/articles";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { jsPDF } from "jspdf";
import { GripVertical, Trash2, FileDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ArticleList() {
  const { articles, deleteArticle, reorderArticles } = useArticleStore();
  const router = useRouter();
  const t = useTranslations("articles");

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = articles.findIndex((a) => a.id === active.id);
    const newIndex = articles.findIndex((a) => a.id === over.id);
    reorderArticles(arrayMove(articles, oldIndex, newIndex));
  };

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
    doc.text(`${t("content_label")}:`, 10, 50);
    doc.text(article.content.replace(/<[^>]+>/g, ""), 10, 60);
    doc.save(`${article.title}.pdf`);
  };

  return (
    <div className="bg-[var(--background-secondary)] text-[var(--foreground)] p-6 rounded-2xl shadow-md border border-[var(--borderColor)]">
      <h2 className="text-2xl font-semibold mb-4">{t("list_title")}</h2>

      {articles.length === 0 ? (
        <p className="text-[var(--secondary)]">{t("no_articles")}</p>
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableArticleItem({
  article,
  onDelete,
  onExport,
  onEdit,
}: {
  article: any;
  onDelete: () => void;
  onExport: () => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
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
      {...attributes}
      {...listeners}
      className="flex justify-between items-center p-4 border border-[var(--borderColor)] rounded-md bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="flex items-center gap-3">
        <GripVertical className="cursor-grab" />
        <div>
          <p className="font-semibold">{article.title}</p>
          <p className="text-sm text-[var(--secondary)]">
            {t(article.category)} •{" "}
            {article.published ? t("published") : t("draft")} •{" "}
            {new Date(article.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="text-yellow-500 hover:text-yellow-700 transition"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={onExport}
          className="text-blue-600 hover:text-blue-800 transition"
        >
          <FileDown size={18} />
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
