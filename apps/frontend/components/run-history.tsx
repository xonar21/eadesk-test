"use client";

import { useQuery } from "@tanstack/react-query";
import { getHistory, type ScenarioRun } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function statusVariant(status: string) {
  switch (status) {
    case "completed":
      return "default" as const;
    case "error":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function typeColor(type: string) {
  switch (type) {
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "validation_error":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "system_error":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "slow_request":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "teapot":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "";
  }
}

function RunItem({ run }: { run: ScenarioRun }) {
  return (
    <div className="flex items-center justify-between py-3 px-2 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <Badge className={typeColor(run.type)} variant="outline">
          {run.type}
        </Badge>
        <Badge variant={statusVariant(run.status)}>{run.status}</Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {run.duration !== null && <span>{run.duration}ms</span>}
        <span>{new Date(run.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export function RunHistory() {
  const { data: runs = [], isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
    refetchInterval: 5000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
        <CardDescription>Last 20 scenario runs with auto-refresh</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No runs yet. Run a scenario to see results here.
          </p>
        ) : (
          <div className="divide-y">{runs.map((r) => <RunItem key={r.id} run={r} />)}</div>
        )}
      </CardContent>
    </Card>
  );
}
