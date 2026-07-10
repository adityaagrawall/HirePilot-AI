import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
  iconColor?: string;
  iconBg?: string;
  index?: number;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-border bg-card p-6 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        <div className={cn("rounded-lg p-2", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <p className="text-xs font-medium text-green-400 mt-2">{trend}</p>
        )}
      </div>
    </motion.div>
  );
}
