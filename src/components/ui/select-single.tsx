"use client";
import React, { useMemo, useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectGroup } from "./select";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Check } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectSingleProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  onAddNewOption?: (label: string) => void;
  isInvalid?: boolean;
  disabled?: boolean;
}

export const SelectSingle: React.FC<SelectSingleProps> = ({
  options,
  placeholder = "Select...",
  value,
  onChange,
  onAddNewOption,
  isInvalid = false,
  disabled = false,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = React.useState(false);

  // Nếu value không truyền vào thì dùng state nội bộ
  const [internalSelected, setInternalSelected] = useState<SelectOption | null>(
    null
  );
  const selected = value !== undefined ? value : internalSelected;

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  const handleSelect = (option: SelectOption) => {
    if (onChange) {
      onChange(option.value);
    } else {
      setInternalSelected(option);
    }
  };

  const handleAddNewOption = (label: string) => {
    if (!onAddNewOption) return;
    const newOption = { label, value: label.toLowerCase() };
    onAddNewOption(label);
    onChange(newOption.value);
    setSearch("");
  };

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selected),
    [options, selected]
  );

  return (
    <Select open={open} onOpenChange={setOpen} disabled={disabled}>
      <SelectTrigger className="w-full" aria-invalid={isInvalid}>
        {selectedOption?.label || placeholder}
      </SelectTrigger>
      <SelectContent className="w-full">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAddNewOption(search);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              {search && onAddNewOption ? (
                <Button
                  onClick={() => {
                    handleAddNewOption(search);
                  }}
                  className="w-full"
                  variant={"ghost"}
                >{`Add "${search}"`}</Button>
              ) : (
                "No results found."
              )}
            </CommandEmpty>
            <CommandGroup>
              <SelectGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    className="justify-between"
                    onSelect={() => {
                      handleSelect(option);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    {value === option.value && <Check />}
                  </CommandItem>
                ))}
              </SelectGroup>
            </CommandGroup>
          </CommandList>
        </Command>
      </SelectContent>
    </Select>
  );
};
