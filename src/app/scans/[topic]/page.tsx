// src/app/scans/[topic]/page.tsx  (server)
import { notFound } from "next/navigation";
import { scanTopics } from "@/data/scanTopics";
import TopicClient from "./TopicClient";

export async function generateStaticParams() {
  return scanTopics.map((topic) => ({ topic: topic.term }));
}

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = scanTopics.find((t) => t.term === params.topic);
  if (!topic) return notFound();

  return <TopicClient topic={topic} />;
}
