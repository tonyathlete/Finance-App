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
  presets?: number[];
}

export default function ExpandableExpense({
  icon, label, hint, total, onTotalChange, subItems, onSubItemChange, presets,
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
    <div className="border border-[#D8DCD3] rounded-md overflow-hidden bg-[#FBFBF9]">
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-[#142420]">
            {icon} {label}
          </label>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs bg-[#EEF1EC] hover:bg-[#D8DCD3] border border-[#D8DCD3] text-[#1B4332] font-semibold rounded-sm px-3 py-1.5 flex items-center gap-1 transition"
          >
            {expanded ? '▲ Masquer' : '▼ Voir le détail'}
          </button>
        </div>
        <p className="text-xs text-[#142420]/60 mb-2">{hint}</p>
        {!expanded && presets && presets.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onTotalChange(p)}
                disabled={hasSubItems}
                className={`text-xs px-2.5 py-1 rounded-sm border font-semibold transition-all disabled:opacity-40 ${
                  displayTotal === p
                    ? 'bg-[#1B4332] text-[#FBFBF9] border-[#1B4332]'
                    : 'bg-[#FBFBF9] text-[#1B4332] border-[#D8DCD3] hover:border-[#1B4332]'
                }`}
              >
                {p >= 1000 ? `${p / 1000}k` : p}$
              </button>
            ))}
          </div>
        )}
        {!expanded && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#142420]/50 font-bold font-mono-data">$</span>
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
              className="w-full pl-7 pr-4 py-3 rounded-sm border border-[#D8DCD3] bg-[#FBFBF9] focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] text-[#142420] font-mono-data font-medium placeholder-[#142420]/30 transition disabled:bg-[#EEF1EC] disabled:text-[#142420]/60"
            />
          </div>
        )}
        {hasSubItems && !expanded && (
          <p className="text-xs text-[#142420]/60 mt-1">
            Total calculé depuis le détail : {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(subTotal)}
          </p>
        )}
      </div>

      {/* Sub-items */}
      {expanded && (
        <div className="border-t border-[#D8DCD3] bg-[#EEF1EC] px-4 py-4 space-y-3">
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
            <div className="bg-[#FBFBF9] rounded-sm p-3 border border-[#D8DCD3] text-right">
              <span className="text-xs text-[#142420]/60 font-medium">Sous-total : </span>
              <span className="font-mono-data font-bold text-[#142420]">
                {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(subTotal)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
