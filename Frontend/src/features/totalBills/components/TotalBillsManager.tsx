import React from "react";
import TotalBill from "./TotalBill";
import { useTotalBills } from "../hooks/useTotalBills";
import type { Tag } from "../../../shared/types";

interface Props {
  month?: string;
  tags?: Tag[];
  refreshKey?: any;
}

export default function TotalBillsManager({ month, tags = [], refreshKey }: Props) {
  const { items, loading, reload } = useTotalBills(tags, month);

  React.useEffect(() => {
    // ensure we reload when external refreshKey changes
    (async () => {
      try {
        await reload(month);
      } catch {
        // ignore
      }
    })();
  }, [reload, month, tags, refreshKey]);

  return (
    <div className="w-80 p-4 border-l bg-white shadow rounded">
      <h2 className="text-lg font-semibold">Totals</h2>
      <div className="mt-3 space-y-3">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {items.map((it) => (
          <TotalBill key={it.id} name={it.name} value={it.value} variant={it.type as any} subtitle={it.subtitle} />
        ))}
      </div>
    </div>
  );
}
