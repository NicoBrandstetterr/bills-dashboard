export interface UpdateRowParams<T> {
  idx: number;
  field: string;
  value: any;
  setRows: React.Dispatch<React.SetStateAction<Array<T>>>;
  rows: Array<T>;
}

export function updateRow<T>({ idx, field, value, setRows, rows }: UpdateRowParams<T>) {
  const updated = [...rows];
  (updated as any)[idx] = { ...(updated as any)[idx], [field]: value };
  setRows(updated);
}
