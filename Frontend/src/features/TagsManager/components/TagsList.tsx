import { useState } from "react";
import type { Tag } from "../../../shared/types";
import TagEditor from "./TagEditor";
import type { UseTagsManagerResult } from "../hooks/useTagsManager";
import { Edit, Trash2 } from "lucide-react";
interface Props {
  tags: Tag[];
  loading?: boolean;
  onEdit: UseTagsManagerResult["edit"];
  onDelete: UseTagsManagerResult["remove"];
}

export default function TagsList({ tags, loading, onEdit, onDelete }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div>
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      <ul className="space-y-2 mt-2">
        {tags.map((t) => (
          <li key={t.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex-1">
              {editingId === t.id ? (
                <TagEditor
                  initialName={t.name}
                  onSave={async (name) => {
                    await onEdit(t.id, name);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                  saveLabel="Update"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{t.name}</span>
                </div>
              )}
            </div>
            {editingId !== t.id && (
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => setEditingId(t.id)} title="Edit" className="p-1">
                  <Edit size={18} className="text-blue-500" />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete tag '${t.name}'?`)) return;
                    await onDelete(t.id);
                  }}
                  title="Delete"
                  className="p-1"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
