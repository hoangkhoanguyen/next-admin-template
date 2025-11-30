"use client";
import React, { useMemo } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Select, SelectContent, SelectTrigger } from "./select";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  options: SelectOption[];
  onChange: (value: string[]) => void;
  value: string[];
  onAddNewOption?: (label: string) => void;
}

export const SelectMulti: React.FC<Props> = ({
  options,
  onChange,
  value,
  onAddNewOption,
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

  return (
    <Select open={open} onOpenChange={setOpen}>
      <SelectTrigger className="w-full">
        <div className="flex-1 flex gap-2 flex-wrap">
          {value.length > 0 ? (
            value.map((item) => <Badge key={item}>{item}</Badge>)
          ) : (
            <span className="text-muted-foreground">Select fruits...</span>
          )}
        </div>
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
      </SelectContent>
    </Select>
  );
};
