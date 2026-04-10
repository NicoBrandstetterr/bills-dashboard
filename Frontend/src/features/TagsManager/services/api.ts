import type { Tag } from "../../../shared/types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/tags/`);
  if (!res.ok) throw new Error("Error fetching tags");
  return res.json();
}

export async function createTag(name: string): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTag(id: number, name: string): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTag(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tags/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
}
