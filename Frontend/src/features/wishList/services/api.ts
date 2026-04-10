export type WishListItem = {
  id: number;
  name: string;
  price: number | string;
  link: string;
};

export type WishListPayload = {
  name: string;
  price: number | string;
  link: string;
};

const API_BASE = "http://localhost:8000/api";

export async function getWishList(): Promise<WishListItem[]> {
  const res = await fetch(`${API_BASE}/wishlist/`);
  if (!res.ok) throw new Error("Error fetching wishlist");
  return res.json();
}

export async function postWishListItem(payload: WishListPayload): Promise<WishListItem> {
  const res = await fetch(`${API_BASE}/wishlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function patchWishListItem(id: number, payload: Partial<WishListPayload>): Promise<WishListItem> {
  const res = await fetch(`${API_BASE}/wishlist/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteWishListItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/wishlist/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
}
