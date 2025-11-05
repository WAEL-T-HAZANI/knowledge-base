"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useArticleStore } from "@/src/store/articles";
import { useTranslations } from "next-intl";
import { useLocaleStore } from "@/src/store/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { IFileUploaderFile } from "@craft-code/file-uploader";
import DatePicker, { registerLocale } from "react-datepicker";
import { ar, enUS } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ar", ar);
registerLocale("en", enUS);

interface ArticleFormProps {
  articleId?: string;
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const t = useTranslations("articles");
  const { locale } = useLocaleStore();
  const router = useRouter();
  const { addArticle, updateArticle, getArticleById } = useArticleStore();

  const existingArticle = articleId ? getArticleById(articleId) : null;

  const [title, setTitle] = useState(existingArticle?.title || "");
  const [category, setCategory] = useState(
    existingArticle?.category || "general"
  );
  const [tags, setTags] = useState<string[]>(existingArticle?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [cover, setCover] = useState<IFileUploaderFile | null>(
    existingArticle?.cover
      ? {
          id: crypto.randomUUID(),
          name: "Existing Cover",
          size: 0,
          type: "image/*",
          uploadedAt: new Date().toISOString(),
          url: existingArticle.cover, // ✅ will persist now (base64)
        }
      : null
  );
  const [content, setContent] = useState(existingArticle?.content || "");
  const [published, setPublished] = useState(
    existingArticle?.published || false
  );
  const [date, setDate] = useState<Date | null>(
    existingArticle?.date ? new Date(existingArticle.date) : new Date()
  );

  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setCategory(existingArticle.category);
      setTags(existingArticle.tags);
      setContent(existingArticle.content);
      setPublished(existingArticle.published);
      setDate(new Date(existingArticle.date));
      if (existingArticle.cover) {
        setCover({
          id: crypto.randomUUID(),
          name: "Existing Cover",
          size: 0,
          type: "image/*",
          uploadedAt: new Date().toISOString(),
          url: existingArticle.cover,
        });
      }
    }
  }, [existingArticle]);

  // ✅ Persistent local cover upload (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData: IFileUploaderFile = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        url: reader.result as string, // ✅ base64 string persists in localStorage
      };
      setCover(fileData);
    };
    reader.readAsDataURL(file); // ✅ convert file to base64
  };

  // ✅ Add tag when pressing space, comma, or enter
  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim().replace(/[,]+$/, "");
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error(
        locale === "ar"
          ? "الرجاء ملء الحقول المطلوبة."
          : "Please fill in the required fields."
      );
      return;
    }

    const articleData = {
      title,
      category,
      tags,
      cover: cover?.url || "", // ✅ now persistent base64
      content,
      published,
      date: date?.toISOString() || new Date().toISOString(),
    };

    if (articleId) {
      updateArticle(articleId, articleData);
      toast.success(t("update_success"));
    } else {
      addArticle(articleData);
      toast.success(t("save_success"));
    }

    router.push("/dashboard/articles");
  };

  // 🎨 Generate consistent unique background color for each tag
  const getTagColor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 85%)`;
  };

  return (
    <div className="bg-[var(--background-secondary)] text-[var(--foreground)] p-6 rounded-2xl shadow-md border border-[var(--borderColor)] space-y-5">
      <div>
        <label className="block mb-1 font-medium">{t("title_label")}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[var(--borderColor)] rounded-md p-2 bg-[var(--background)] text-[var(--foreground)]"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">{t("category_label")}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-[var(--borderColor)] rounded-md p-2 bg-[var(--background)] text-[var(--foreground)]"
        >
          <option value="general">{t("general")}</option>
          <option value="news">{t("news")}</option>
          <option value="tutorial">{t("tutorial")}</option>
          <option value="update">{t("update")}</option>
        </select>
      </div>

      {/* ✅ Tags */}
      <div>
        <label className="block mb-1 font-medium">{t("tags_label")}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm border border-[var(--borderColor)]"
              style={{
                backgroundColor: getTagColor(tag),
                color: "#333",
              }}
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-black/60 hover:text-black"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKey}
          placeholder={t("tags_placeholder")}
          className="w-full border border-[var(--borderColor)] rounded-md p-2 bg-[var(--background)] text-[var(--foreground)]"
        />
      </div>

      {/* ✅ Cover upload with persistent base64 */}
      <div>
        <label className="block mb-1 font-medium">{t("cover_label")}</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full border border-[var(--borderColor)] rounded-md p-2 bg-[var(--background)] text-[var(--foreground)]"
        />
        {cover && (
          <div className="mt-2">
            <img
              src={cover.url}
              alt="Cover"
              className="rounded-md max-h-48 border border-[var(--borderColor)]"
            />
          </div>
        )}
      </div>

      {/* ✅ Content */}
      <div>
        <label className="block mb-1 font-medium">{t("content_label")}</label>
        <div className="border border-[var(--borderColor)] rounded-md p-2 bg-[var(--background)]">
          <CKEditor
            editor={ClassicEditor}
            config={{ language: locale === "ar" ? "ar" : "en" }}
            data={content}
            onChange={(_, editor) => setContent(editor.getData())}
          />
        </div>
      </div>

      {/* ✅ Publish + Date */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            {t("publish_label")}
          </label>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              published
                ? "bg-green-500/20 text-green-600 border border-green-500/30"
                : "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
            }`}
          >
            {published ? t("published") : t("draft")}
          </span>
        </div>

        <div className="w-full sm:w-auto">
          <label className="block mb-1 font-medium">{t("date_label")}</label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            locale={locale}
            dateFormat="Pp"
            className="w-full border border-[var(--borderColor)] rounded-md p-2 bg-[var(--background)] text-[var(--foreground)]"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:opacity-90 transition"
      >
        {articleId ? t("update_button") : t("save_button")}
      </button>
    </div>
  );
}
