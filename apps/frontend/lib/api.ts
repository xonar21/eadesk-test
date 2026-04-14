const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error: ${res.status}`);
  }

  return res.json();
}

export interface ScenarioRun {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface RunScenarioResult {
  id: string;
  status?: string;
  duration?: number;
  signal?: number;
  message?: string;
}

export function runScenario(type: string, name?: string) {
  return apiFetch<RunScenarioResult>('/api/scenarios/run', {
    method: 'POST',
    body: JSON.stringify({ type, name }),
  });
}

export function getHistory() {
  return apiFetch<ScenarioRun[]>('/api/scenarios/history');
}

export function getHealth() {
  return apiFetch<{ status: string; timestamp: string }>('/api/health');
}
