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
import { PackCSVRow } from "@/types/types";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { CSVUploadArea } from "./CSVUploadArea";
import { CSVPreviewTable, CSVColumn } from "./CSVPreviewTable";

export default function PackCSVImport() {
  const [rows, setRows] = useState<PackCSVRow[]>([]);
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
        setRows(results.data as PackCSVRow[]);
      },
      error: function () {
        setError(t.csvImport.uploadFailed);
      },
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    handleFile(file);
  }

  async function uploadToServer() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/packs/csv-upload", {
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

  const columns: CSVColumn<PackCSVRow>[] = [
    { key: "name_en", header: t.csvImport.packTable.nameEn },
    { key: "name_jp", header: t.csvImport.packTable.nameJp },
    { key: "release_date", header: t.csvImport.packTable.releaseDate },
    { key: "ebay_url", header: t.csvImport.packTable.ebayUrl},
    { key: "mercari_url", header: t.csvImport.packTable.mercariUrl}
  ];

  return (
    <Card className="shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={20} />
          {t.csvImport.packTitle}
        </CardTitle>
        <CardDescription>{t.csvImport.packSubtitle}</CardDescription>
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