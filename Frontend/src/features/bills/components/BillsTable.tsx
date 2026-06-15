import React, { useState, useRef, useEffect } from "react";
import type { Bill, BillPayload } from "../services/api";
import type { Tag } from "../../../shared/types";
import type { billRow } from "../model/billsRow.type";
import { Edit, Trash2, Check, X, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface updateNewRowParams {
  idx: number;
  field: string;
  value: any;
  setNewRows: React.Dispatch<React.SetStateAction<Array<billRow>>>;
  newRows: Array<billRow>;
}

function parseDecimal(value: string): number {
  return parseFloat(value.replace(',', '.'));
}

function updateNewRow({ idx, field, value, setNewRows, newRows }: updateNewRowParams) {
    const rows = [...newRows];
    (rows as any)[idx] = { ...(rows as any)[idx], [field]: value };
    setNewRows(rows);
}

interface Props {
    bills: Bill[];
    newRows: billRow[];
    setNewRows: React.Dispatch<React.SetStateAction<Array<billRow>>>;
    tags: Tag[];
  updateBill: (id: number, payload: Partial<BillPayload>) => Promise<void>;
  deleteBill: (id: number) => Promise<void>;
  addBill: (payload: BillPayload) => Promise<void>;
  reload: () => Promise<void>;
  month: string;
}

export default function BillsTable({ bills, newRows, setNewRows, tags, updateBill, deleteBill, addBill, reload, month }: Props) {
  const [filters, setFilters] = useState<Record<number, string>>({});
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<number, { name: string; value: string; type: string; tags_ids: number[]; day?: number }>>({});
  const [editPopupId, setEditPopupId] = useState<number | null>(null);
  const editPopupRef = useRef<HTMLDivElement | null>(null);
  const [focusField, setFocusField] = useState<{ id: number; field?: string } | null>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      // newRows popup
      if (openIndex !== null) {
        const popupEl = popupRef.current;
        const buttonEl = document.querySelector(`[data-popup-button="${openIndex}"]`) as HTMLElement | null;
        if (popupEl && !popupEl.contains(e.target as Node) && buttonEl && !buttonEl.contains(e.target as Node)) {
          setOpenIndex(null);
        }
      }

      // edit row popup
      if (editPopupId !== null) {
        const popupEl = editPopupRef.current;
        const buttonEl = document.querySelector(`[data-edit-button="${editPopupId}"]`) as HTMLElement | null;
        if (popupEl && !popupEl.contains(e.target as Node) && buttonEl && !buttonEl.contains(e.target as Node)) {
          setEditPopupId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openIndex, editPopupId]);

  useEffect(() => {
    if (focusField && editingId === focusField.id) {
      const selector = `[data-edit-input="${focusField.field}-${focusField.id}"]`;
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) el.focus();
      setFocusField(null);
    }
  }, [editingId, focusField]);

  function startEditing(b: Bill) {
    setEditingId(b.id);
    setEditValues((p) => ({
      ...p,
      [b.id]: { name: b.name ?? "", value: String(b.value ?? ""), type: b.type ?? "expense", tags_ids: b.tags?.map((t) => t.id) ?? [], day: b.day ?? new Date().getDate() },
    }));
  }

  function updateEditValue(id: number, field: string, value: any) {
    setEditValues((p) => ({ ...p, [id]: { ...(p[id] ?? {}), [field]: value } }));
  }

  async function handleSaveNewRow(row: billRow, idx: number) {
    try {
      const payload: BillPayload = {
        name: row.name,
        value: parseDecimal(row.value),
        type: row.type,
        tag_ids: row.tags_ids ?? [],
        day: row.day ?? new Date().getDate(),
        month: `${month}-01`,
      };
      await addBill(payload);
      setNewRows(newRows.filter((_, i) => i !== idx));
    } catch (err) {
      toast.error("Failed to save bill");
    }
  }
  const sortedBills = [...bills].sort((a, b) => (b.day ?? 0) - (a.day ?? 0));

  return (
    <div className="group">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Value</th>
            <th className="px-2 py-1">Type</th>
            <th className="px-2 py-1">Day</th>
            <th className="px-2 py-1">Tags</th>
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
        {sortedBills.map((b) => (
          <tr key={b.id} className="border-t">
            {editingId === b.id ? (
              <>
                <td className="px-2 py-1">
                  <input data-edit-input={`name-${b.id}`} value={editValues[b.id]?.name ?? ""} onChange={(e) => updateEditValue(b.id, "name", e.target.value)} className="w-full border rounded p-1" />
                </td>
                <td className="px-2 py-1">
                  <input data-edit-input={`value-${b.id}`} value={editValues[b.id]?.value ?? ""} onChange={(e) => updateEditValue(b.id, "value", e.target.value)} className="w-full border rounded p-1" />
                </td>
                <td className="px-2 py-1">
                  <select data-edit-input={`type-${b.id}`} value={editValues[b.id]?.type ?? "expense"} onChange={(e) => updateEditValue(b.id, "type", e.target.value)} className="border rounded p-1">
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                  </select>
                </td>
                <td className="px-2 py-1">
                  <input data-edit-input={`day-${b.id}`} type="number" min={1} max={31} value={editValues[b.id]?.day ?? new Date().getDate()} onChange={(e) => updateEditValue(b.id, "day", Number(e.target.value))} className="w-20 border rounded p-1" />
                </td>
                <td className="px-2 py-1">
                  <div className="relative inline-block">
                    <div className="mb-2 text-sm">
                      {tags.filter((t) => (editValues[b.id]?.tags_ids ?? []).includes(t.id)).map((t) => t.name).join(", ") || <span className="text-gray-400">-</span>}
                    </div>

                    <button data-edit-button={b.id} onClick={() => setEditPopupId(editPopupId === b.id ? null : b.id)} className="px-2 py-1 bg-blue-500 text-white rounded">
                      <Plus size={16} />
                    </button>

                    {editPopupId === b.id && (
                      <div data-edit-popup-row={b.id} ref={editPopupRef} className="absolute z-50 mt-2 right-0 w-72 bg-white border rounded shadow-lg p-2">
                        <input
                          data-edit-input={`tags-${b.id}`}
                          type="text"
                          placeholder="Buscar tags..."
                          value={filters[b.id] ?? ""}
                          onChange={(e) => setFilters((p) => ({ ...p, [b.id]: e.target.value }))}
                          className="w-full border rounded p-1 mb-2"
                        />

                        <div className="max-h-40 overflow-auto border rounded p-1">
                          {tags
                            .filter((t) => t.name.toLowerCase().includes((filters[b.id] ?? "").toLowerCase()))
                            .map((t) => (
                              <label key={t.id} className="flex items-center gap-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={(editValues[b.id]?.tags_ids ?? []).includes(t.id)}
                                  onChange={() => {
                                    const current = new Set(editValues[b.id]?.tags_ids ?? []);
                                    if (current.has(t.id)) current.delete(t.id);
                                    else current.add(t.id);
                                    updateEditValue(b.id, "tags_ids", Array.from(current));
                                  }}
                                />
                                <span>{t.name}</span>
                              </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setEditPopupId(null)} className="px-2 py-1 border rounded text-sm">
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1">
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const data = editValues[b.id];
                        try {
                          if (!data) return;
                          const payload: Partial<BillPayload> = { name: data.name, value: parseDecimal(data.value), type: data.type as "income" | "expense", tag_ids: data.tags_ids, day: data.day };
                          await updateBill(b.id, payload);
                        } catch (err) {
                          toast.error("Failed to update bill");
                        } finally {
                          setEditingId(null);
                          setEditPopupId(null);
                        }
                      }}
                      title="Save"
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditPopupId(null);
                      }}
                      title="Cancel"
                      className="px-2 py-1 border rounded text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </>
            ) : (
              <>
                <td className="px-2 py-1 cursor-pointer" onClick={() => { startEditing(b); setFocusField({ id: b.id, field: "name" }); }}>{b.name}</td>
                <td className="px-2 py-1 cursor-pointer" onClick={() => { startEditing(b); setFocusField({ id: b.id, field: "value" }); }}>{`$${b.value}`}</td>
                <td className="px-2 py-1 cursor-pointer" onClick={() => { startEditing(b); setFocusField({ id: b.id, field: "type" }); }}>{b.type}</td>
                <td className="px-2 py-1 cursor-pointer" onClick={() => { startEditing(b); setFocusField({ id: b.id, field: "day" }); }}>{b.day ?? "-"}</td>
                <td className="px-2 py-1 cursor-pointer" onClick={() => { startEditing(b); setFocusField({ id: b.id, field: "tags" }); setEditPopupId(b.id); }}>
                  {(b.tags && b.tags.length > 0) ? b.tags.map((t) => t.name).join(", ") : "-"}
                </td>
                <td className="px-2 py-1 flex items-center gap-2">
                  <button title="Edit" onClick={(e) => { e.stopPropagation(); startEditing(b); }} className="p-1">
                    <Edit size={18} className="text-blue-500" />
                  </button>
                  <button title="Delete" onClick={async (e) => {
                    e.stopPropagation();
                    if (!confirm(`Delete bill '${b.name}'?`)) return;
                    try {
                      await deleteBill(b.id);
                    } catch (err) {
                      toast.error("Failed to delete bill");
                    }
                  }} className="p-1">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}

        {newRows.map((row, idx) => (
          <tr key={`new-${idx}`} className="border-t">
            <td className="px-2 py-1">
              <input 
                value={row.name} 
                onChange={(e) => updateNewRow({ idx, field: "name", value: e.target.value, setNewRows, newRows })} 
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNewRow(row, idx); }}
                className="w-full border rounded p-1" 
              />
            </td>
            <td className="px-2 py-1">
              <input 
                value={row.value} 
                onChange={(e) => updateNewRow({ idx, field: "value", value: e.target.value, setNewRows, newRows })} 
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNewRow(row, idx); }}
                className="w-full border rounded p-1" 
              />
            </td>
            <td className="px-2 py-1">
              <select 
                value={row.type} 
                onChange={(e) => updateNewRow({ idx, field: "type", value: e.target.value, setNewRows, newRows })} 
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNewRow(row, idx); }}
                className="border rounded p-1"
              >
                <option value="income">income</option>
                <option value="expense">expense</option>
              </select>
            </td>
            <td className="px-2 py-1">
              <input 
                type="number" 
                min={1} 
                max={31} 
                value={row.day ?? new Date().getDate()} 
                onChange={(e) => updateNewRow({ idx, field: "day", value: Number(e.target.value), setNewRows, newRows })} 
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNewRow(row, idx); }}
                className="w-20 border rounded p-1" 
              />
            </td>
            <td className="px-2 py-1">
              <div className="relative inline-block">
                <button data-popup-button={idx} onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="px-2 py-1 bg-blue-500 text-white rounded">
                  <Plus size={10} />
                </button>

                {openIndex === idx && (
                  <div data-popup-row={idx} ref={popupRef} className="absolute z-50 mt-2 right-0 w-72 bg-white border rounded shadow-lg p-2">
                    <input
                      type="text"
                      placeholder="Buscar tags..."
                      value={filters[idx] ?? ""}
                      onChange={(e) => setFilters((p) => ({ ...p, [idx]: e.target.value }))}
                      className="w-full border rounded p-1 mb-2"
                    />

                    <div className="max-h-40 overflow-auto border rounded p-1">
                      {tags
                        .filter((t) => t.name.toLowerCase().includes((filters[idx] ?? "").toLowerCase()))
                        .map((t) => (
                          <label key={t.id} className="flex items-center gap-2 py-1">
                            <input
                              type="checkbox"
                              checked={(row.tags_ids ?? []).includes(t.id)}
                              onChange={() => {
                                const current = new Set(row.tags_ids ?? []);
                                if (current.has(t.id)) current.delete(t.id);
                                else current.add(t.id);
                                updateNewRow({ idx, field: "tags_ids", value: Array.from(current), setNewRows, newRows });
                              }}
                            />
                            <span>{t.name}</span>
                          </label>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setOpenIndex(null)} className="px-2 py-1 border rounded text-sm">
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </td>
            <td className="px-2 py-1">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSaveNewRow(row, idx)}
                  title="Save"
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  <Check size={10} />
                </button>
                <button 
                  onClick={() => setNewRows(newRows.filter((_, i) => i !== idx))}
                  title="Cancel"
                  className="px-2 py-1 border rounded text-gray-600"
                >
                  <X size={10} />
                </button>
              </div>
            </td>
          </tr>
        ))}
        <tr className="border-t cursor-pointer opacity-0 group-hover:opacity-60 hover:opacity-100 transition" onClick={() => setNewRows([...newRows, { name: "", value: "", type: "expense", tags_ids: [], day: new Date().getDate() }])}>
          <td colSpan={6} className="text-center py-3 text-gray-500">
            <div className="inline-flex items-center gap-2">
              <Plus size={20} />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  );
}
