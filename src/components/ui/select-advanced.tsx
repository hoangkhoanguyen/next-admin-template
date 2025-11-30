import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
  SelectValue,
} from "./select";
import { SearchInput } from "./search-input";
import { Button } from "./button";
import { Badge } from "./badge";
import React, { useState } from "react";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectAdvancedProps {
  options: SelectOption[];
  isMulti?: boolean;
  isCreatable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
}

export const SelectAdvanced: React.FC<SelectAdvancedProps> = ({
  options,
  isMulti = false,
  isCreatable = false,
  isSearchable = false,
  placeholder = "Select...",
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectOption[]>([]);
  const [customOptions, setCustomOptions] = useState<SelectOption[]>([]);

  // Combine options with custom options if creatable
  const allOptions = isCreatable ? [...options, ...customOptions] : options;
  const filteredOptions = isSearchable
    ? allOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : allOptions;

  const handleSelect = (option: SelectOption) => {
    if (isMulti) {
      if (!selected.find((o) => o.value === option.value)) {
        setSelected([...selected, option]);
      }
    } else {
      setSelected([option]);
    }
  };

  const handleRemove = (option: SelectOption) => {
    setSelected(selected.filter((o) => o.value !== option.value));
  };

  const handleCreate = () => {
    if (search && !allOptions.find((o) => o.label === search)) {
      const newOption = { label: search, value: search };
      setCustomOptions([...customOptions, newOption]);
      handleSelect(newOption);
      setSearch("");
    }
  };

  return (
    <div className="w-full max-w-sm border rounded p-2 bg-white">
      <Select>
        <SelectTrigger className="w-full">
          {selected[0]?.label || placeholder}
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto min-w-[200px]">
          {isSearchable && (
            <div className="p-2 border-b bg-white sticky top-0 z-10">
              <SearchInput
                wrapperClassName="mb-2"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          {isCreatable &&
            search &&
            !allOptions.find((o) => o.label === search) && (
              <div className="px-2 pb-2">
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleCreate}
                >
                  Thêm &quot;{search}&quot;
                </Button>
              </div>
            )}
          {filteredOptions.length === 0 && (
            <div className="px-2 py-4 text-sm text-muted-foreground">
              Không có lựa chọn phù hợp
            </div>
          )}
          {filteredOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isMulti && selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((option) => (
            <Badge key={option.value} variant="secondary">
              {option.label}
              <Button
                size="icon-sm"
                variant="ghost"
                className="ml-1 text-xs text-red-500"
                onClick={() => handleRemove(option)}
              >
                x
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
