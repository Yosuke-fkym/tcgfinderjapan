import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface AdminShopFilterType{
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
    area: string,
    setArea: React.Dispatch<React.SetStateAction<string>>,
    areas: {
    value: string;
    label: string;
    group: string;
}[]
}

export default function AdminShopFilter({
  area,
  open,
  setOpen,
  setArea,
  areas,
}: AdminShopFilterType){

    const { locale } = useParams();
    const t = getT(locale as string);

    return(
        <div className="flex flex-wrap gap-4 justify-center">

        {/* AREA */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger aria-haspopup="listbox" asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-label={t.ranking.filters.selectArea}
              className="w-55 justify-between"
            >
              {area === "ALL"
  ? t.ranking.filters.selectArea
  : t.ranking.areas?.[area as keyof typeof t.ranking.areas] || area}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-55 p-0">
            <Command className="max-h-75">
              <CommandInput placeholder={t.ranking.filters.searchArea} />
              <CommandEmpty>{t.ranking.empty}</CommandEmpty>

              <CommandList className="max-h-75 overflow-y-auto">

                {/* ALL */}
                <CommandGroup heading={t.ranking.filters.all}>
                  <CommandItem
                    onSelect={() => {
                      setArea("ALL");
                      setOpen(false);
                    }}
                  >
                    {t.ranking.filters.all}
                  </CommandItem>
                </CommandGroup>

                {/* Tokyo */}
                <CommandGroup heading={t.ranking.filters.tokyoArea}>
                  {areas.slice(0,3).map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => {
                        setArea(item.value);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                      {area === item.value && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>

                {/* Prefectures */}
                <CommandGroup heading={t.ranking.filters.prefectures}>
                  {areas
                    .filter((a) => !["akihabara", "ikebukuro", "tokyo"].includes(a.value))
                    .map((item) => (
                      <CommandItem
                        key={item.value}
                        onSelect={() => {
                          setArea(item.value);
                          setOpen(false);
                        }}
                      >
                        {item.label}
                        {area === item.value && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                </CommandGroup>

              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

      </div>
    )
}