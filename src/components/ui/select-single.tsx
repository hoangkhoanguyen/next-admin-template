import React, { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./select";
import { SearchInput } from "./search-input";
import { Button } from "./button";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectSingleProps {
  options: SelectOption[];
  isCreatable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
  value?: SelectOption | null;
  onChange?: (value: SelectOption | null) => void;
}

export const SelectSingle: React.FC<SelectSingleProps> = ({
  options,
  isCreatable = false,
  isSearchable = false,
  placeholder = "Select...",
  value,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [customOptions, setCustomOptions] = useState<SelectOption[]>([]);

  // Nếu value không truyền vào thì dùng state nội bộ
  const [internalSelected, setInternalSelected] = useState<SelectOption | null>(
    null
  );
  const selected = value !== undefined ? value : internalSelected;

  const allOptions = isCreatable ? [...options, ...customOptions] : options;
  const filteredOptions = isSearchable
    ? allOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : allOptions;

  const handleSelect = (option: SelectOption) => {
    if (onChange) {
      onChange(option);
    } else {
      setInternalSelected(option);
    }
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
    <Select>
      <SelectTrigger className="w-full">
        {selected?.label || placeholder}
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
  );
};
