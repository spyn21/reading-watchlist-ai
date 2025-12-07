import { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "../utils/auth";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { summarize } from "../llm/summary"; // ✅ WebLLM local summarizer

export default function Dashboard() {
  const user = getCurrentUser();
  const [contentList, setContentList] = useState([]);
  const [newContent, setNewContent] = useState({
    title: "",
    type: "article",
    url: "",
    summary: "",
  });

  const [llmReady, setLlmReady] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const autoSummarized = useRef(false); // ✅ avoid reruns

  // ✅ Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ Load WebLLM once
  useEffect(() => {
    const initLLM = async () => {
      if (!window.llmEngine && typeof window.loadLLM === "function") {
        await window.loadLLM();
      }
      setLlmReady(true);
    };
    initLLM();
  }, []);

  // ✅ Fetch content for current user
  useEffect(() => {
    const fetchContent = async () => {
      if (!user?.email) return;
      const q = query(collection(db, "watchlist"), where("user", "==", user.email));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => doc.data());
      setContentList(items);
    };
    fetchContent();
  }, [user]);

  // ✅ One-time redirect-based summarization (from extension)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("data");

    // Only run if all dependencies are ready and not already summarized
    if (!dataParam || !user?.email || !llmReady || autoSummarized.current || !Array.isArray(contentList)) return;

    autoSummarized.current = true; // Set immediately to prevent double runs

    const summarizeRedirectContent = async () => {
      try {
        setIsSummarizing(true);
        setError("");
        
        const data = JSON.parse(decodeURIComponent(dataParam));
        const { title, type, url, extract } = data;

        const alreadyExists = contentList.some((item) => item.url === url);
        if (alreadyExists) {
          showToast("Content already exists in your list!", "info");
          return;
        }

        const summary = await summarize(extract || `${title} ${url}`);
        const contentItem = { 
          title, 
          type, 
          url, 
          summary, 
          user: user.email,
          username: user.username || user.email.split('@')[0], // Fallback to email prefix if no username
          timestamp: new Date() // Add timestamp for public profile display
        };

        await addDoc(collection(db, "watchlist"), contentItem);
        setContentList((prev) => [...prev, contentItem]);

        showToast("Content added successfully! 🎉");
        window.history.replaceState({}, document.title, "/dashboard");
      } catch (err) {
        console.error("❌ Failed to parse or summarize:", err);
        setError("Failed to summarize content. Please try again.");
        showToast("Failed to add content. Please try again.", "error");
      } finally {
        setIsSummarizing(false);
      }
    };

    summarizeRedirectContent();
  }, [user, llmReady, contentList]);

  // ✅ Manual form submit
  const handleAddContent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const item = { 
        ...newContent, 
        user: user.email,
        username: user.username || user.email.split('@')[0], // Fallback to email prefix if no username
        timestamp: new Date() // Add timestamp for public profile display
      };

      if (!item.summary) {
        try {
          setIsSummarizing(true);
          item.summary = await summarize(item.title + " " + item.url);
        } catch (err) {
          console.error("❌ LLM summarization failed:", err);
          setError("Failed to generate summary. Please try again or add a manual summary.");
          showToast("Summary generation failed. Please try again.", "error");
          return;
        } finally {
          setIsSummarizing(false);
        }
      }

      await addDoc(collection(db, "watchlist"), item);
      setContentList((prev) => [...prev, item]);
      setNewContent({ title: "", type: "article", url: "", summary: "" });
      showToast("Content added successfully! 🎉");
    } catch (err) {
      console.error("❌ Failed to add content:", err);
      setError("Failed to add content. Please try again.");
      showToast("Failed to add content. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete item
  const handleDelete = async (urlToDelete) => {
    if (!user?.email) return;

    try {
      const q = query(
        collection(db, "watchlist"),
        where("user", "==", user.email),
        where("url", "==", urlToDelete)
      );
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docItem) => {
        await deleteDoc(doc(db, "watchlist", docItem.id));
      });

      setContentList((prev) => prev.filter((item) => item.url !== urlToDelete));
      showToast("Content deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      showToast("Failed to delete content. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          toast.type === "success" ? "bg-green-500 text-white" :
          toast.type === "error" ? "bg-red-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user?.username || user?.email || "Guest"} 👋
        </h1>

        <Link
          to={`/profile/${user?.username}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          View my public profile
        </Link>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Indicator for Redirect Summarization */}
        {isSummarizing && !isSubmitting && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            ⏳ Generating summary from extension...
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Add Watched/Read Content</h2>
          <form onSubmit={handleAddContent} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
            <select
              value={newContent.type}
              onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
            </select>
            <input
              type="url"
              placeholder="URL"
              value={newContent.url}
              onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
            <textarea
              placeholder="Optional Summary"
              value={newContent.summary}
              onChange={(e) => setNewContent({ ...newContent, summary: e.target.value })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-white flex items-center justify-center ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isSummarizing ? "Generating Summary..." : "Adding Content..."}
                </>
              ) : (
                "Add Content"
              )}
            </button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Your Tracked Content</h2>
          {contentList.length === 0 ? (
            <p>No content added yet.</p>
          ) : (
            contentList.map((item, idx) => (
              <div key={idx} className="border p-4 rounded mb-2 bg-gray-50">
                <h3 className="text-lg font-bold">
                  {item.title}{" "}
                  <span className="ml-2">{item.type === "article" ? "📄" : "🎬"}</span>
                </h3>
                <p className="text-sm text-gray-500">{item.type}</p>
                <div className="flex justify-between items-start mt-2">
                  <div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Visit Link
                    </a>
                    {item.summary && <p className="mt-2">{item.summary}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(item.url)}
                    className="ml-4 text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}