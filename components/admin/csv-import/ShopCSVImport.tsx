"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CSVRow } from "@/types/types";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { CSVUploadArea } from "./CSVUploadArea";
import { CSVPreviewTable, CSVColumn } from "./CSVPreviewTable";

export default function ShopCSVImport() {
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  function handleFile(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsed = (results.data as CSVRow[]).map((row) => ({
          ...row,
          latitude: row.latitude?.trim(),
          longitude: row.longitude?.trim(),
        }));
        setRows(parsed);
      },
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  }

  async function uploadToServer() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/shops/csv-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.csvImport.uploadFailed);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const columns: CSVColumn<CSVRow>[] = [
    { key: "shop_name", header: t.csvImport.table.shopName },
    { key: "shop_address", header: t.csvImport.table.address },
    { key: "website", header: t.csvImport.table.website },
    {
      key: "monday",
      header: t.csvImport.table.mondayHours,
      render: (row) =>
        !row.monday_open || row.monday_open === "--:--"
          ? t.csvImport.table.closed
          : `${row.monday_open} - ${row.monday_close}`,
    },
    {
      key: "reels",
      header: t.csvImport.table.shopVideo,
      render: (row) => (row.reels ? `${row.reels.split("|").length} reels` : "-"),
    },
  ];

  return (
    <Card className="shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={20} />
          {t.csvImport.title}
        </CardTitle>
        <CardDescription>{t.csvImport.subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <CSVUploadArea
          title={t.csvImport.uploadTitle}
          hint={t.csvImport.uploadHint}
          onFileChange={handleFileChange}
        />

        {rows.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {rows.length} {t.csvImport.rowsDetected}
              </p>
              <Button type="button" onClick={uploadToServer} disabled={loading}>
                {loading ? t.csvImport.uploading : t.csvImport.importData}
              </Button>
            </div>

            <CSVPreviewTable rows={rows} columns={columns} />

            <p className="text-xs text-muted-foreground">{t.csvImport.previewNote}</p>
          </>
        )}

        {success && (
          <Alert className="border-green-500">
            <CheckCircle size={18} />
            <AlertDescription>{t.csvImport.success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle size={18} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}