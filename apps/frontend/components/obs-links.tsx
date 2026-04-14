"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const links = [
  {
    title: "Grafana Dashboard",
    url: "http://localhost:3100",
    description: "Metrics and logs visualization",
  },
  {
    title: "Prometheus",
    url: "http://localhost:9090",
    description: "Metrics endpoint and queries",
  },
  {
    title: "Backend Metrics",
    url: "http://localhost:3001/metrics",
    description: "Raw Prometheus metrics from backend",
  },
  {
    title: "Loki Logs",
    url: "http://localhost:3100/explore",
    description: 'Query: {app="signal-lab"}',
  },
  {
    title: "API Docs (Swagger)",
    url: "http://localhost:3001/api/docs",
    description: "Interactive API documentation",
  },
  {
    title: "Sentry",
    url: "https://sentry.io",
    description: "Check project dashboard for captured exceptions",
  },
];

export function ObsLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observability Links</CardTitle>
        <CardDescription>Quick access to monitoring tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <span className="font-medium text-sm">{link.title}</span>
              <span className="text-xs text-muted-foreground">
                {link.description}
              </span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
