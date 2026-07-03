import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
      <Input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
