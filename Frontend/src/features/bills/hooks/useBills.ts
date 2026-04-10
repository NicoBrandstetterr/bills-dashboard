import { useState, useEffect } from "react";
import { getBills, postBill, patchBill, deleteBill as apiDeleteBill, Bill, BillPayload } from "../services/api";
import toast from "react-hot-toast";

export function useBills(month: string) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    if (!month) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getBills(month);
        if (mounted) setBills(data);
      } catch (e) {
        toast.error("Failed to load bills");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [month]);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await getBills(month);
      setBills(data);
    } catch (e) {
      toast.error("Failed to reload bills");
    } finally {
      setLoading(false);
    }
  };

  const addBill = async (payload: BillPayload) => {
    await postBill(payload);
    await reload();
  };

  const updateBill = async (id: number, payload: Partial<BillPayload>) => {
    await patchBill(id, payload);
    await reload();
  };

  const deleteBill = async (id: number) => {
    await apiDeleteBill(id);
    await reload();
  };

  return { bills, loading, reload, addBill, updateBill, deleteBill } as const;
}
