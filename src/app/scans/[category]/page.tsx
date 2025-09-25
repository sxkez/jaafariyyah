import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { scanCategories } from "@/data/scanTopics";

// ✅ Needed for static export
export async function generateStaticParams() {
  return scanCategories.map((cat) => ({ category: cat.category.toLowerCase() }));
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;

  const catData = scanCategories.find(
    (c) => c.category.toLowerCase() === category
  );

  if (!catData) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-white px-6 py-12">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          asChild
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <Link href="/scans">← Back to Categories</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
          {catData.category}
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Topics inside {catData.category}
        </p>
      </div>

      {/* List of Topics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {catData.topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/scans/${topic.term}`}
            className="block bg-green-900/30 border border-green-700/30 rounded-lg p-6 hover:bg-green-900/50 transition shadow"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              {topic.term} • {topic.arabic}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-3">
              {topic.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
