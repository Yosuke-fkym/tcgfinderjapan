"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { CSVRow } from "@/types/types";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export default function CSVImportPageComponent() {
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
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div className=" space-y-6">
      <Card className="shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            {t.csvImport.title}
          </CardTitle>

          <CardDescription>
            {t.csvImport.subtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition group">
              <FileText
                className="mb-3 text-gray-500 group-hover:scale-110 transition"
                size={36}
              />

              <p className="font-medium text-base">{t.csvImport.uploadTitle}</p>

              <p className="text-sm text-muted-foreground mt-1">
                {t.csvImport.uploadHint}
              </p>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {rows.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {rows.length} {t.csvImport.rowsDetected}
                </p>

                <Button
                  type="button"
                  onClick={uploadToServer}
                  disabled={loading}
                >
                  {loading ? t.csvImport.uploading : t.csvImport.importData}
                </Button>
              </div>

              <div className="border rounded-lg overflow-auto max-h-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.csvImport.table.shopName}</TableHead>
                      <TableHead>{t.csvImport.table.address}</TableHead>
                      <TableHead>{t.csvImport.table.website}</TableHead>
                      <TableHead>{t.csvImport.table.mondayHours}</TableHead>
                      <TableHead>{t.csvImport.table.shopVideo}</TableHead>
                    </TableRow>
                  </TableHeader>

                <TableBody>
  {rows.slice(0, 10).map((row, index) => (
    <TableRow key={index}>
      <TableCell>{row.shop_name}</TableCell>

      <TableCell>{row.shop_address}</TableCell>

      <TableCell>{row.website}</TableCell>

      {/* ✅ FIXED monday preview */}
      <TableCell className="text-xs">
        {!row.monday_open || row.monday_open === "--:--"
          ? t.csvImport.table.closed
          : `${row.monday_open} - ${row.monday_close}`}
      </TableCell>

      {/* 🔥 OPTIONAL: reels preview (good UX) */}
      <TableCell className="text-xs max-w-[200px] truncate">
        {row.reels
          ? row.reels.split("|").length + " reels"
          : "-"}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
                </Table>
              </div>

              <p className="text-xs text-muted-foreground">
                {t.csvImport.previewNote}
              </p>
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
    </div>
  );
}