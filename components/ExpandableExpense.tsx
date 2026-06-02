import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';

export interface SubItem {
  id: string;
  label: string;
  value: number;
}

interface Props {
  icon: string;
  label: string;
  hint: string;
  total: number;
  onTotalChange: (v: number) => void;
  subItems: SubItem[];
  onSubItemChange: (id: string, v: number) => void;
}

export default function ExpandableExpense({
  icon, label, hint, total, onTotalChange, subItems, onSubItemChange,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const subTotal = subItems.reduce((s, i) => s + i.value, 0);
  const hasSubItems = subItems.some(i => i.value > 0);
  // When sub-items are in use, the total is their sum
  const displayTotal = hasSubItems ? subTotal : total;

  const handleSubChange = (id: string, v: number) => {
    onSubItemChange(id, v);
    // Update parent total with new sub-sum
    const newSum = subItems.reduce((s, i) => s + (i.id === id ? v : i.value), 0);
    onTotalChange(newSum);
  };

  return (
    <div className="border border-amber-100 rounded-xl overflow-hidden bg-white">
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-amber-900">
            {icon} {label}
          </label>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-amber-600 font-medium flex items-center gap-1 hover:text-orange-500 transition"
          >
            {expanded ? '▲ Masquer le détail' : '▼ Voir le détail'}
          </button>
        </div>
        <p className="text-xs text-amber-500 mb-2">{hint}</p>
        {!expanded && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={displayTotal === 0 ? '' : displayTotal.toString()}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                onTotalChange(raw === '' ? 0 : parseInt(raw, 10));
              }}
              placeholder="0"
              disabled={hasSubItems}
              className="w-full pl-7 pr-4 py-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-900 font-medium placeholder-amber-300 transition disabled:bg-amber-50 disabled:text-amber-600"
            />
          </div>
        )}
        {hasSubItems && !expanded && (
          <p className="text-xs text-amber-500 mt-1">
            Total calculé depuis le détail : {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(subTotal)}
          </p>
        )}
      </div>

      {/* Sub-items */}
      {expanded && (
        <div className="border-t border-amber-100 bg-amber-50 px-4 py-4 space-y-3">
          {subItems.map((item) => (
            <CurrencyInput
              key={item.id}
              id={item.id}
              label={item.label}
              value={item.value}
              onChange={(v) => handleSubChange(item.id, v)}
            />
          ))}
          {subTotal > 0 && (
            <div className="bg-white rounded-lg p-3 border border-amber-200 text-right">
              <span className="text-xs text-amber-600 font-medium">Sous-total : </span>
              <span className="font-black text-amber-900">
                {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(subTotal)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
