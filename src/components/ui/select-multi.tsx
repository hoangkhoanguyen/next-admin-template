"use client";
import React, { useMemo } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  options: SelectOption[];
  onChange: (value: string[]) => void;
  value: string[];
  onAddNewOption?: (label: string) => void;
  isInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectMulti: React.FC<Props> = ({
  options,
  onChange,
  value,
  onAddNewOption,
  isInvalid = false,
  disabled = false,
  placeholder = "Select...",
}) => {
  const [search, setSearch] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      ),
    [search, options]
  );

  const handleAddNewOption = (label: string) => {
    if (!onAddNewOption) return;
    const newOption = { label, value: label.toLowerCase() };
    onAddNewOption(label);
    onChange([...value, newOption.value]);
    setSearch("");
  };

  // Helper function to get label from value
  const getLabel = (val: string) => {
    const option = options.find((opt) => opt.value === val);
    return option?.label || val;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" asChild disabled={disabled}>
        <Button
          variant={"outline"}
          className="h-max justify-between w-full"
          disabled={disabled}
          aria-invalid={isInvalid}
        >
          <div className="flex-1 flex gap-2 flex-wrap">
            {value.length > 0 ? (
              value.map((item) => (
                <Badge
                  variant={"secondary"}
                  key={item}
                  onDelete={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  {getLabel(item)}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
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
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  className="justify-between"
                  onSelect={() => {
                    if (value.includes(option.value)) {
                      onChange(value.filter((item) => item !== option.value));
                    } else {
                      onChange([...value, option.value]);
                    }
                  }}
                >
                  {option.label}
                  {value.includes(option.value) && <Check />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
