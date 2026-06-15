import React from "react";

interface Props {
  name: string;
  value: number;
  subtitle?: string;
  variant?: "income" | "expense" | "net" | "default";
  className?: string;
}

function format(v: number) {
  return `$${v.toFixed(2)}`;
}

export default function TotalBill({ name, value, subtitle, variant = "default", className = "" }: Props) {
  const variantClass =
    variant === "income" ? "bg-green-100 text-green-800" : variant === "expense" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800";

  return (
    <div className={`w-80 p-3 border rounded shadow-sm flex items-center justify-between ${className}`}>
      <div>
        <div className="text-sm font-medium">{name}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      <div className={`font-semibold px-3 py-1 rounded ${variantClass}`}>{format(value)}</div>
    </div>
  );
}
