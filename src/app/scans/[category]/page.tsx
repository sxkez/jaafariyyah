// src/app/scans/[category]/page.tsx (SERVER)
import { notFound } from "next/navigation";
import { scanCategories, scanTopics } from "@/data/scanTopics";
import CategoryClient from "./CategoryClient";

export async function generateStaticParams() {
  return scanCategories.map((category) => ({ category: category.id }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryParam = decodeURIComponent(params.category);
  const category = scanCategories.find(
    (entry) => entry.id.toLowerCase() === categoryParam.toLowerCase()
  );

  if (!category) return notFound();

  const topics = scanTopics.filter(
    (topic) => topic.categoryId.toLowerCase() === category.id.toLowerCase()
  );

  if (!topics.length) return notFound();

  return <CategoryClient category={category.name} topics={topics} />;
}
