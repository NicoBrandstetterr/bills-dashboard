import React, { useState } from "react";
import { useBills } from "../hooks/useBills";
import BillsTable from "./BillsTable";
import { Check, X } from "lucide-react";
import type { BillPayload } from "../services/api";
import type {billRow} from "../model/billsRow.type";
import type { Tag } from "../../../shared/types";
import toast from "react-hot-toast";


interface addRowParams {
  setNewRows: React.Dispatch<React.SetStateAction<Array<billRow>>>;
  newRows: Array<billRow>;
  tags: Tag[];
}
// removed unused addRow helper (add row is now the '+' hover row in the table)



interface saveRowsParams {
  newRows: Array<billRow>;
  month: string;
  addBill: (payload: BillPayload) => Promise<void>;
  reload: () => Promise<void>;
  setNewRows: React.Dispatch<React.SetStateAction<Array<billRow>>>;
}

function useMonthlyBills() {
    const [month, setMonth] = useState<string>(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const { bills, loading, reload, addBill, updateBill, deleteBill } = useBills(month);
    return { month, setMonth, bills, loading, reload, addBill, updateBill, deleteBill } as const;
  }
interface Props {
  tags: Tag[];
}

export default function BillsFeature({ tags }: Props): React.ReactElement {
  const { month, setMonth, bills, loading, reload, addBill, updateBill, deleteBill } = useMonthlyBills();
  const [newRows, setNewRows] = useState<Array<billRow>>([]);

  return (
    <div className="bg-white shadow p-4 rounded h-full">
      <h1 className="text-2xl font-bold mb-4">Bills Dashboard</h1>

      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Month:</label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded" />
      </div>

      <BillsTable bills={bills} newRows={newRows} setNewRows={setNewRows} tags={tags} updateBill={updateBill} deleteBill={deleteBill} addBill={addBill} reload={reload} month={month} />
    </div>
  );
}
