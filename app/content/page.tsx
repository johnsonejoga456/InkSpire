"use client";

import { useEffect, useState } from "react";

interface Content {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({ title: "", body: "" });

  // ✅ Fetch content on mount
  useEffect(() => {
    async function fetchContents() {
      try {
        const res = await fetch("/api/secure/content", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.ok) setContents(data.contents);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchContents();
  }, []);

  // ✅ Create new content
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/secure/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await res.json();
      if (data.ok) {
        setContents([data.content, ...contents]);
        setTitle("");
        setBody("");
      } else alert(data.error || "Something went wrong");
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete content
  async function handleDelete(id: string) {
    if (!confirm("Delete this content?")) return;
    try {
      const res = await fetch(`/api/secure/content/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.ok) setContents(contents.filter((c) => c.id !== id));
      else alert(data.error || "Delete failed");
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // ✅ Edit handlers
  function handleEditStart(content: Content) {
    setEditingId(content.id);
    setEditingData({ title: content.title, body: content.body });
  }

  async function handleEditSave(id: string) {
    try {
      const res = await fetch(`/api/secure/content/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingData),
      });

      const data = await res.json();
      if (data.ok) {
        setContents(
          contents.map((c) => (c.id === id ? { ...c, ...editingData } : c))
        );
        setEditingId(null);
      } else alert(data.error || "Update failed");
    } catch (err) {
      console.error("Update error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Create Form */}
      <aside className="w-1/3 bg-white border-r shadow-sm p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            📝 Create Content
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Write your content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          © {new Date().getFullYear()} ContentGen
        </p>
      </aside>

      {/* Right Column - Content List */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Contents</h1>

        {contents.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            You haven’t created any content yet.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((c) => (
              <div
                key={c.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                {editingId === c.id ? (
                  <>
                    <input
                      type="text"
                      value={editingData.title}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          title: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 mb-2 focus:ring-2 focus:ring-yellow-400"
                    />
                    <textarea
                      value={editingData.body}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          body: e.target.value,
                        })
                      }
                      className="w-full border rounded p-2 mb-2 focus:ring-2 focus:ring-yellow-400"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(c.id)}
                        className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-400 text-white py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {c.title}
                    </h2>
                    <p className="text-gray-700 mb-2 line-clamp-3">{c.body}</p>
                    <p className="text-xs text-gray-400 mb-3">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <div className="flex justify-between text-sm">
                      <button
                        onClick={() => handleEditStart(c)}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
