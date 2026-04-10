import type { Tag } from "../../../shared/types";

export type Bill = {
  id: number;
  name: string;
  value: number | string;
  type: "income" | "expense";
  tags?: Tag[];
  day?: number;
  month: string;
};

export type BillPayload = {
  name: string;
  value: number | string;
  type: "income" | "expense";
  tag_ids?: number[];
  day?: number;
  month: string;
};

const API_BASE = "http://localhost:8000/api";

export async function getBills(month: string): Promise<Bill[]> {
  const res = await fetch(`${API_BASE}/bills/?month=${month}`);
  if (!res.ok) throw new Error("Error fetching bills");
  return res.json();
}

export async function postBill(payload: BillPayload): Promise<Bill> {
  const res = await fetch(`${API_BASE}/bills/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function patchBill(id: number, payload: Partial<BillPayload>): Promise<Bill> {
  const res = await fetch(`${API_BASE}/bills/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBill(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/bills/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
}
 
