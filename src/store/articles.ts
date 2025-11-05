"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export interface Article {
  id: string;
  title: string;
  category: string;
  tags: string[];
  cover?: string;
  content: string;
  published: boolean;
  date: string;
}

interface ArticleStore {
  articles: Article[];
  addArticle: (article: Omit<Article, "id">) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  reorderArticles: (articles: Article[]) => void;
  getArticleById: (id: string) => Article | null;
}

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set, get) => ({
      articles: [],

      addArticle: (article) =>
        set((state) => ({
          articles: [...state.articles, { ...article, id: nanoid() }],
        })),

      updateArticle: (id, article) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, ...article } : a
          ),
        })),

      deleteArticle: (id) =>
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        })),

      reorderArticles: (articles) => set({ articles }),

      getArticleById: (id) => get().articles.find((a) => a.id === id) || null,
    }),
    { name: "articles-storage" }
  )
);
