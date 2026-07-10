import { useUser, useClerk } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  LogOut,
  BarChart3,
  TrendingUp,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiClient } from "@/lib/api";

interface ProfileData {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: string;
  };
  stats: {
    totalAnalyses: number;
    avgAtsScore: number;
    highestMatch: number;
  };
}

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const { data, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/profile");
      return data;
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const statItems = [
    {
      icon: BarChart3,
      label: "Total Analyses",
      value: data?.stats.totalAnalyses ?? 0,
      iconColor: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      label: "Avg. ATS Score",
      value: data?.stats.avgAtsScore ? `${data.stats.avgAtsScore}%` : "—",
      iconColor: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      icon: Sparkles,
      label: "Highest Match",
      value: data?.stats.highestMatch ? `${data.stats.highestMatch}%` : "—",
      iconColor: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                <User className="h-7 w-7 text-primary" />
                Profile
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your account information and settings.
              </p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-6 overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent" />
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 mb-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName || "User avatar"}
                          className="h-20 w-20 rounded-2xl border-4 border-background object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-2xl border-4 border-background bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                          {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div className="pb-1">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-6 w-40 mb-2" />
                          <Skeleton className="h-4 w-56" />
                        </>
                      ) : (
                        <>
                          <h2 className="text-xl font-bold text-foreground">
                            {data?.user.name || user?.fullName || "Anonymous User"}
                          </h2>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            {data?.user.email || user?.emailAddresses?.[0]?.emailAddress}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Info rows */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Full Name</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {user?.fullName || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Email</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {user?.emailAddresses?.[0]?.emailAddress || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Member since</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {data?.user.createdAt
                          ? new Date(data.user.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {statItems.map((stat) => (
                      <div key={stat.label} className="text-center space-y-2">
                        <div className={`inline-flex rounded-xl p-3 ${stat.bg}`}>
                          <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                        </div>
                        {isLoading ? (
                          <>
                            <Skeleton className="h-7 w-12 mx-auto" />
                            <Skeleton className="h-3 w-20 mx-auto" />
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sign out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-red-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Sign Out</p>
                      <p className="text-xs text-muted-foreground">
                        You will be signed out of all devices.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
