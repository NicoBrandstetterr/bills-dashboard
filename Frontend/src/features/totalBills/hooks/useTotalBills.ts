import { useState, useEffect, useCallback } from "react";
import { getBills } from "../../bills/services/api";
import toast from "react-hot-toast";
import type { Tag } from "../../../shared/types";

type TotalItem = { id: string; name: string; value: number; type?: string; subtitle?: string };

function defaultMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function useTotalBills(tags: Tag[], month?: string) {
  const [items, setItems] = useState<TotalItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTotals = useCallback(async (m?: string) => {
    const mth = m ?? defaultMonth();
    setLoading(true);
    try {
      const bills = await getBills(mth);

      // For each tag, compute only expenses associated with that tag
      const perTag = tags.map((t) => {
        const sum = bills
          .filter((b) => b.type === "expense" && b.tags && b.tags.some((x) => x.id === t.id))
          .reduce((s, b) => s + parseFloat(String(b.value)), 0);
        return { id: String(t.id), name: t.name, value: sum, type: "expense" } as TotalItem;
      });

      setItems(perTag);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load totals");
    } finally {
      setLoading(false);
    }
  }, [tags]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchTotals(month);
    })();
    return () => {
      mounted = false;
    };
  }, [month, fetchTotals]);

  return { items, loading, reload: fetchTotals } as const;
}
