"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Configure PDF.js worker (only on client side)
if (typeof window !== "undefined") {
  import("react-pdf").then((pdfjs) => {
    pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.js`;
  });
}

interface PDFViewerProps {
  bookTitle: string;
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
  bookId?: string;
}

interface BookmarkData {
  page: number;
  title: string;
  timestamp: Date;
}

export function PDFViewer({
  bookTitle,
  pdfUrl,
  isOpen,
  onClose,
  bookId,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // Load bookmarks
  useEffect(() => {
    if (bookId) {
      const saved = localStorage.getItem(`bookmarks-${bookId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookmarks(
            parsed.map(
              (b: { page: number; title: string; timestamp: string }) => ({
                ...b,
                timestamp: new Date(b.timestamp),
              })
            )
          );
        } catch (e) {
          console.error("Failed to load bookmarks:", e);
        }
      }
    }
  }, [bookId]);

  const saveBookmarks = (newBookmarks: BookmarkData[]) => {
    if (bookId) {
      localStorage.setItem(`bookmarks-${bookId}`, JSON.stringify(newBookmarks));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError("Failed to load PDF. Please try again.");
    setLoading(false);
    console.error("PDF loading error:", error);
  };

  const goToPrevious = () => setPageNumber((prev) => Math.max(1, prev - 1));
  const goToNext = () => setPageNumber((prev) => Math.min(numPages, prev + 1));
  const zoomIn = () => setScale((prev) => Math.min(3, prev + 0.2));
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.2));

  const addBookmark = () => {
    const newBookmark: BookmarkData = {
      page: pageNumber,
      title: `Page ${pageNumber}`,
      timestamp: new Date(),
    };
    const newBookmarks = [...bookmarks, newBookmark];
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const goToBookmark = (bookmark: BookmarkData) => {
    setPageNumber(bookmark.page);
    setShowBookmarks(false);
  };

  const removeBookmark = (index: number) => {
    const newBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-900/90 backdrop-blur-sm border-b border-green-600/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-800"
            >
              ← Back
            </Button>
            <h2 className="text-xl font-bold text-white">{bookTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowBookmarks(!showBookmarks)}
              variant="outline"
              size="sm"
              className="border-green-400 text-green-300 hover:bg-green-500/20"
            >
              📚 Bookmarks ({bookmarks.length})
            </Button>
            <Button
              onClick={addBookmark}
              variant="outline"
              size="sm"
              className="border-green-400 text-green-300 hover:bg-green-500/20"
            >
              🔖 Bookmark Page
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Bookmarks Sidebar */}
        {showBookmarks && (
          <div className="w-80 bg-green-900/80 backdrop-blur-sm border-r border-green-600/40 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Bookmarks</h3>
            {bookmarks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No bookmarks yet. Click "Bookmark Page" to save your progress!
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bookmark, index) => (
                  <Card
                    key={index}
                    className="bg-green-800/30 border-green-600/40"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => goToBookmark(bookmark)}
                        >
                          <p className="text-white text-sm font-medium">
                            Page {bookmark.page}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {bookmark.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => removeBookmark(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Controls */}
          <div className="bg-green-900/80 backdrop-blur-sm border-b border-green-600/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={goToPrevious}
                  disabled={pageNumber <= 1}
                  variant="outline"
                  size="sm"
                  className="border-green-400 text-green-300 hover:bg-green-500/20 disabled:opacity-50"
                >
                  ← Previous
                </Button>
                <span className="text-white mx-4">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  onClick={goToNext}
                  disabled={pageNumber >= numPages}
                  variant="outline"
                  size="sm"
                  className="border-green-400 text-green-300 hover:bg-green-500/20 disabled:opacity-50"
                >
                  Next →
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={zoomOut}
                  variant="outline"
                  size="sm"
                  className="border-green-400 text-green-300 hover:bg-green-500/20"
                >
                  🔍-
                </Button>
                <span className="text-white text-sm">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  onClick={zoomIn}
                  variant="outline"
                  size="sm"
                  className="border-green-400 text-green-300 hover:bg-green-500/20"
                >
                  🔍+
                </Button>
              </div>
            </div>

            {/* Page Navigation Input */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-400 text-sm">Go to page:</span>
              <input
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= numPages) {
                    setPageNumber(page);
                  }
                }}
                className="w-20 px-2 py-1 bg-green-900/30 border border-green-600/40 rounded text-white text-sm"
              />
            </div>
          </div>

          {/* PDF Display */}
          <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center">
            {loading && (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            )}

            {error && (
              <div className="text-center text-red-600">
                <p className="mb-4">{error}</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && isClient && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full"></div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  loading={
                    <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
                  }
                />
              </Document>
            )}

            {!isClient && (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
                <p className="text-gray-600">Initializing PDF viewer...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
