// src/app/scans/[category]/page.tsx (SERVER)
import { notFound } from "next/navigation";
import { scanTopics } from "@/data/scanTopics";
import CategoryClient from "./CategoryClient";

export async function generateStaticParams() {
  // Collect unique categories
  const categories = Array.from(new Set(scanTopics.map((t) => t.category)));
  return categories.map((cat) => ({ category: cat.toLowerCase() }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = decodeURIComponent(params.category);

  // Find all topics in this category
  const topics = scanTopics.filter(
    (t) => t.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (!topics.length) return notFound();

  return <CategoryClient category={categoryName} topics={topics} />;
}
