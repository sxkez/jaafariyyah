import { notFound } from "next/navigation";
import { scanTopics } from "@/data/scanTopics";
import TopicClient from "./TopicClient"; // new client file

// Needed for static export
export async function generateStaticParams() {
  return scanTopics.map((topic) => ({ topic: topic.term }));
}

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = params.topic;
  const data = scanTopics.find((t) => t.term === topic);

  if (!data) return notFound();

  return <TopicClient data={data} />;
}