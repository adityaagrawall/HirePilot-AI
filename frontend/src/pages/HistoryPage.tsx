import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Trash2,
  Eye,
  BarChart3,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ScoreRing } from "@/components/ui/score-ring";
import AnalysisResult, { AnalysisData } from "@/components/analyze/AnalysisResult";
import { useApiClient } from "@/lib/api";

interface HistoryItem {
  id: string;
  title: string;
  atsScore: number | null;
  matchScore: number | null;
  createdAt: string;
  analyses: Array<{
    id: string;
    jobDescription: string;
    summary: string | null;
    missingKeywords: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    experienceRewrite: string[];
    projects: string[];
    skills: string[];
    certifications: string[];
    interviewQuestions: string[];
    coverLetter: string | null;
  }>;
}

export default function HistoryPage() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ history: HistoryItem[] }>({
    queryKey: ["history"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/history");
      return data;
    },
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      await apiClient.delete(`/api/history/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (selectedItem?.id === deletingId) setSelectedItem(null);
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  const history = data?.history ?? [];

  const toAnalysisData = (item: HistoryItem): AnalysisData | null => {
    const analysis = item.analyses[0];
    if (!analysis) return null;
    return {
      atsScore: item.atsScore ?? 0,
      matchScore: item.matchScore ?? 0,
      summary: analysis.summary ?? "",
      missingKeywords: analysis.missingKeywords,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      experienceRewrite: analysis.experienceRewrite,
      projects: analysis.projects,
      skills: analysis.skills,
      certifications: analysis.certifications,
      interviewQuestions: analysis.interviewQuestions,
      coverLetter: analysis.coverLetter ?? "",
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                <Clock className="h-7 w-7 text-primary" />
                Analysis History
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage your past resume analyses.
              </p>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No analyses yet"
                description="Your resume analysis history will appear here. Start by analyzing your first resume."
                action={{ label: "Analyze Resume", onClick: () => navigate("/analyze") }}
              />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* History list */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {history.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedItem(item)}
                        className={`rounded-xl border bg-card p-5 cursor-pointer transition-all duration-200 ${
                          selectedItem?.id === item.id
                            ? "border-primary/50 bg-primary/5"
                            : "border-border hover:border-border/80 hover:bg-muted/20"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-muted rounded-lg p-2.5 flex-shrink-0">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.createdAt).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {item.atsScore != null && (
                                <Badge
                                  variant={item.atsScore >= 80 ? "success" : item.atsScore >= 60 ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  ATS {item.atsScore}%
                                </Badge>
                              )}
                              {item.matchScore != null && (
                                <Badge variant="outline" className="text-xs">
                                  Match {item.matchScore}%
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-400"
                              onClick={() => deleteItem(item.id)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Detail panel */}
                <div className="xl:sticky xl:top-24 xl:self-start">
                  <AnimatePresence mode="wait">
                    {selectedItem ? (
                      <motion.div
                        key={selectedItem.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="rounded-xl border border-border bg-card overflow-hidden"
                      >
                        {/* Detail header */}
                        <div className="flex items-center justify-between p-5 border-b border-border">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{selectedItem.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(selectedItem.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-3 pr-3 border-r border-border">
                              {selectedItem.atsScore != null && (
                                <ScoreRing score={selectedItem.atsScore} label="ATS" size={60} strokeWidth={6} color="auto" />
                              )}
                              {selectedItem.matchScore != null && (
                                <ScoreRing score={selectedItem.matchScore} label="Match" size={60} strokeWidth={6} color="auto" />
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setSelectedItem(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-5 max-h-[calc(100vh-280px)] overflow-y-auto">
                          {toAnalysisData(selectedItem) ? (
                            <AnalysisResult data={toAnalysisData(selectedItem)!} />
                          ) : (
                            <p className="text-sm text-muted-foreground">No analysis data available.</p>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-dashed border-border bg-card/30 flex flex-col items-center justify-center p-12 text-center"
                      >
                        <Eye className="h-10 w-10 text-muted-foreground/50 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Select an analysis to view details
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Click any item from the list on the left
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
