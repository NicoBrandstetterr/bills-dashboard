import React, { useState } from "react";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  initialName?: string;
  onSave: (name: string) => Promise<void> | void;
  onCancel?: () => void;
  saveLabel?: string;
}

export default function TagEditor({ initialName = "", onSave, onCancel, saveLabel = "Save" }: Props) {
  const [name, setName] = useState<string>(initialName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave(name.trim());
      setName("");
      if (onCancel) onCancel();
    } catch (e) {
      toast.error("Failed to save tag");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-1 rounded flex-1"
        placeholder="Tag name"
      />
      <button onClick={handleSave} disabled={saving} title={saveLabel} className="px-2 py-1 bg-green-600 text-white rounded flex items-center">
        <Check size={16} />
      </button>
      {onCancel && (
        <button onClick={onCancel} title="Cancel" className="px-2 py-1 border rounded text-gray-600">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
