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

  // Fetch content on mount
  useEffect(() => {
    async function fetchContents() {
      try {
        const res = await fetch("/api/secure/content", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (data.ok) setContents(data.contents);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchContents();
  }, []);

  // Create new content
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
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Delete content
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

  // Begin editing
  function handleEditStart(content: Content) {
    setEditingId(content.id);
    setEditingData({ title: content.title, body: content.body });
  }

  // Save edited content
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
          contents.map((c) =>
            c.id === id ? { ...c, ...editingData } : c
          )
        );
        setEditingId(null);
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
        Your Content
      </h1>

      {/* Create Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 mb-6 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-4">Create New Content</h2>
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Write something..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {loading ? "Saving..." : "Create Content"}
        </button>
      </form>

      {/* Content List */}
      <div className="space-y-5">
        {contents.length === 0 ? (
          <p className="text-gray-500 text-center">No content yet.</p>
        ) : (
          contents.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    value={editingData.title}
                    onChange={(e) =>
                      setEditingData({ ...editingData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:ring-2 focus:ring-yellow-400"
                  />
                  <textarea
                    value={editingData.body}
                    onChange={(e) =>
                      setEditingData({ ...editingData, body: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:ring-2 focus:ring-yellow-400"
                    rows={3}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEditSave(c.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {c.title}
                  </h2>
                  <p className="text-gray-700 mt-2">{c.body}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-4 flex gap-4">
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
          ))
        )}
      </div>
    </div>
  );
}