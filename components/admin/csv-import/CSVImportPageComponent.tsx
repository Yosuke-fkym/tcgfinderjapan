"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import ShopCSVImport from "./ShopCSVImport";
import CardCSVImport from "./CardCSVImport";

export default function CSVImportPageComponent() {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="shops" className="w-full">
        <TabsList>
          <TabsTrigger value="shops">{t.csvImport.tabs.shops}</TabsTrigger>
          <TabsTrigger value="cards">{t.csvImport.tabs.cards}</TabsTrigger>
        </TabsList>

        <TabsContent value="shops" className="mt-6">
          <ShopCSVImport />
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <CardCSVImport />
        </TabsContent>
      </Tabs>
    </div>
  );
}