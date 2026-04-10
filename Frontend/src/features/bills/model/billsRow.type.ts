export type typeBill = "income" | "expense";
export type billRow = {
  name: string;
  value: string;
  type: typeBill;
  tags_ids?: number[];
  day?: number;
};