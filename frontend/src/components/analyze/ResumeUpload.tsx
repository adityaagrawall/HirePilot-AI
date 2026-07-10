import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { extractTextFromPDF } from "@/lib/pdfExtract";

interface ResumeUploadProps {
  value: string;
  onChange: (text: string) => void;
  error?: string;
}

type InputMode = "upload" | "paste";

export default function ResumeUpload({ value, onChange, error }: ResumeUploadProps) {
  const [mode, setMode] = useState<InputMode>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setExtractError("Please upload a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setExtractError("File size must be under 5MB.");
      return;
    }

    setIsExtracting(true);
    setExtractError(null);
    setFileName(file.name);

    try {
      const text = await extractTextFromPDF(file);
      onChange(text);
    } catch (err) {
      setExtractError(
        err instanceof Error ? err.message : "Failed to extract text from PDF."
      );
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }
  }, [onChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    onChange("");
    setFileName(null);
    setExtractError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center rounded-lg border border-border bg-muted/30 p-1 gap-1 w-fit">
        {(["upload", "paste"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              clearFile();
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              mode === m
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "upload" ? (
              <><Upload className="h-3.5 w-3.5" /> Upload PDF</>
            ) : (
              <><FileText className="h-3.5 w-3.5" /> Paste Text</>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {fileName && value ? (
              <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-400">{fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {value.length.toLocaleString()} characters extracted
                    </p>
                  </div>
                </div>
                <button type="button" onClick={clearFile}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileInput}
                />
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Extracting text...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                      "rounded-xl p-4 transition-colors",
                      isDragging ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Upload className={cn("h-8 w-8", isDragging ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        {isDragging ? "Drop your PDF here" : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF files only, up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste your resume text here..."
              className="min-h-[280px] font-mono text-xs leading-relaxed"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error messages */}
      {(extractError || error) && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {extractError || error}
        </div>
      )}
    </div>
  );
}
