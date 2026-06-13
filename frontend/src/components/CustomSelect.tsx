"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../app/register/register.module.css";

type Option = { value: string; label: string };

interface Props {
  id?: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  required?: boolean;
}

export default function CustomSelect({ id, name, options, defaultValue, required }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(defaultValue ?? options[0]?.value ?? "");
  const [highlighted, setHighlighted] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    setHighlighted(idx >= 0 ? idx : 0);
  }, [value, options]);

  function toggle() {
    setOpen((v) => !v);
  }

  function onSelect(idx: number) {
    setValue(options[idx].value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open) onSelect(highlighted);
      else setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div className={styles.customSelect} ref={ref} id={id}>
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        className={styles.customSelectTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className={styles.customSelectLabel}>{selectedLabel}</span>
        <span className={`${styles.chev} ${open ? styles.open : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className={styles.customSelectMenu}
          aria-activedescendant={"option-" + highlighted}
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              id={`option-${idx}`}
              role="option"
              aria-selected={value === opt.value}
              className={`${styles.customSelectOption} ${value === opt.value ? styles.selectedOption : ""}`}
              onClick={() => onSelect(idx)}
              onMouseEnter={() => setHighlighted(idx)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
