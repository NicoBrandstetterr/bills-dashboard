import React, { useState } from "react";
import type { WishListItem, WishListPayload } from "../services/api";
import type { wishListRow } from "../model/wishListRow.type";
import { updateRow } from "../../../shared/utils";
import { Edit, Trash2, Check, X, Plus, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  wishList: WishListItem[];
  newRows: wishListRow[];
  setNewRows: React.Dispatch<React.SetStateAction<Array<wishListRow>>>;
  updateItem: (id: number, payload: Partial<WishListPayload>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

function parseDecimal(value: string): number {
  return parseFloat(value.replace(',', '.'));
}

export default function WishListTable({ wishList, newRows, setNewRows, updateItem, deleteItem }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<number, { name: string; price: string; link: string }>>({});

  function startEditing(item: WishListItem) {
    setEditingId(item.id);
    setEditValues((p) => ({
      ...p,
      [item.id]: { name: item.name, price: String(item.price), link: item.link },
    }));
  }

  function updateEditValue(id: number, field: string, value: any) {
    setEditValues((p) => ({ ...p, [id]: { ...(p[id] ?? {}), [field]: value } }));
  }

  return (
    <div className="group">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Price</th>
            <th className="px-2 py-1">Link</th>
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishList.map((item) => (
            <tr key={item.id} className="border-t" onDoubleClick={() => startEditing(item)}>
              {editingId === item.id ? (
                <>
                  <td className="px-2 py-1">
                    <input value={editValues[item.id]?.name ?? ""} onChange={(e) => updateEditValue(item.id, "name", e.target.value)} className="w-full border rounded p-1" />
                  </td>
                  <td className="px-2 py-1">
                    <input value={editValues[item.id]?.price ?? ""} onChange={(e) => updateEditValue(item.id, "price", e.target.value)} className="w-full border rounded p-1" />
                  </td>
                  <td className="px-2 py-1">
                    <input value={editValues[item.id]?.link ?? ""} onChange={(e) => updateEditValue(item.id, "link", e.target.value)} className="w-full border rounded p-1" />
                  </td>
                  <td className="px-2 py-1">
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const data = editValues[item.id];
                          try {
                            if (!data) return;
                            const payload: Partial<WishListPayload> = { name: data.name, price: parseDecimal(data.price), link: data.link };
                            await updateItem(item.id, payload);
                          } catch (err) {
                            toast.error("Failed to update wishlist item");
                          } finally {
                            setEditingId(null);
                          }
                        }}
                        title="Save"
                        className="px-2 py-1 bg-green-600 text-white rounded"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
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
                  <td className="px-2 py-1">{item.name}</td>
                  <td className="px-2 py-1">${item.price}</td>
                  <td className="px-2 py-1">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                        <ExternalLink size={14} />
                        Link
                      </a>
                    ) : "-"}
                  </td>
                  <td className="px-2 py-1 flex items-center gap-2">
                    <button title="Edit" onClick={(e) => { e.stopPropagation(); startEditing(item); }} className="p-1">
                      <Edit size={18} className="text-blue-500" />
                    </button>
                    <button title="Delete" onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm(`Delete '${item.name}' from wishlist?`)) return;
                      try {
                        await deleteItem(item.id);
                      } catch (err) {
                        toast.error("Failed to delete wishlist item");
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
                <input value={row.name} onChange={(e) => updateRow({ idx, field: "name", value: e.target.value, setRows: setNewRows, rows: newRows })} className="w-full border rounded p-1" />
              </td>
              <td className="px-2 py-1">
                <input value={row.price} onChange={(e) => updateRow({ idx, field: "price", value: e.target.value, setRows: setNewRows, rows: newRows })} className="w-full border rounded p-1" />
              </td>
              <td className="px-2 py-1">
                <input value={row.link} onChange={(e) => updateRow({ idx, field: "link", value: e.target.value, setRows: setNewRows, rows: newRows })} className="w-full border rounded p-1" />
              </td>
              <td className="px-2 py-1">
                <button title="Remove row" onClick={() => setNewRows(newRows.filter((_, i) => i !== idx))} className="p-1">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </td>
            </tr>
          ))}

          <tr className="border-t cursor-pointer opacity-0 group-hover:opacity-60 hover:opacity-100 transition" onClick={() => setNewRows([...newRows, { name: "", price: "", link: "" }])}>
            <td colSpan={4} className="text-center py-3 text-gray-500">
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
