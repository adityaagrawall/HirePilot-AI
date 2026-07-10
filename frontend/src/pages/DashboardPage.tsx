import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  FileText,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useApiClient } from "@/lib/api";

interface HistoryItem {
  id: string;
  title: string;
  atsScore: number | null;
  matchScore: number | null;
  createdAt: string;
}

interface ProfileData {
  user: { name: string | null; email: string };
  stats: { totalAnalyses: number; avgAtsScore: number; highestMatch: number };
}

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const { data: profileData, isLoading: profileLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/profile");
      return data;
    },
  });

  const { data: historyData, isLoading: historyLoading } = useQuery<{ history: HistoryItem[] }>({
    queryKey: ["history"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/history");
      return data;
    },
  });

  const recentHistory = historyData?.history?.slice(0, 5) ?? [];
  const stats = profileData?.stats;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "outline";
    if (score >= 80) return "success";
    if (score >= 60) return "default";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-6xl">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {greeting()}, {user?.firstName || "there"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your resume analysis activity.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {profileLoading ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatsCard
                  title="Total Analyses"
                  value={stats?.totalAnalyses ?? 0}
                  description="Resume analyses completed"
                  icon={BarChart3}
                  iconColor="text-primary"
                  iconBg="bg-primary/10"
                  index={0}
                />
                <StatsCard
                  title="Avg. ATS Score"
                  value={stats?.avgAtsScore ? `${stats.avgAtsScore}%` : "—"}
                  description="Average ATS compatibility"
                  icon={TrendingUp}
                  iconColor="text-green-400"
                  iconBg="bg-green-500/10"
                  index={1}
                />
                <StatsCard
                  title="Highest Match"
                  value={stats?.highestMatch ? `${stats.highestMatch}%` : "—"}
                  description="Best job match score"
                  icon={Sparkles}
                  iconColor="text-secondary"
                  iconBg="bg-secondary/10"
                  index={2}
                />
              </>
            )}
          </div>

          {/* Quick action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 border border-primary/30 rounded-xl p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Analyze a new resume</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload a PDF or paste your resume text to get started
                  </p>
                </div>
              </div>
              <Button variant="gradient" onClick={() => navigate("/analyze")} className="shrink-0">
                Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Recent history */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Recent Analyses
              </h2>
              {recentHistory.length > 0 && (
                <Link to="/history">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>

            {historyLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentHistory.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No analyses yet"
                description="Upload your first resume to see your analysis history here."
                action={{ label: "Analyze Resume", onClick: () => navigate("/analyze") }}
              />
            ) : (
              <div className="space-y-3">
                {recentHistory.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 card-hover"
                  >
                    <div className="bg-muted rounded-lg p-2.5 flex-shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.atsScore != null && (
                        <Badge variant={getScoreColor(item.atsScore) as Parameters<typeof Badge>[0]["variant"]}>
                          ATS {item.atsScore}%
                        </Badge>
                      )}
                      {item.matchScore != null && (
                        <Badge variant="outline">
                          Match {item.matchScore}%
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
