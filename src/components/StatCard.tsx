import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "primary" | "accent" | "success" | "warning";
}

const styles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/15 text-accent-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export default function StatCard({ label, value, icon: Icon, trend, variant = "primary" }: Props) {
  return (
    <Card className="bg-gradient-card hover:shadow-elegant transition-shadow">
      <CardContent className="p-5 flex items-start gap-4">
        <div className={cn("h-11 w-11 rounded-lg flex items-center justify-center shrink-0", styles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
          <div className="text-2xl font-bold mt-1 font-display">{value}</div>
          {trend && <div className="text-xs text-muted-foreground mt-0.5">{trend}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
