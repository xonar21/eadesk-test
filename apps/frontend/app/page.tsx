import { ScenarioForm } from "@/components/scenario-form";
import { RunHistory } from "@/components/run-history";
import { ObsLinks } from "@/components/obs-links";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Signal Lab</h1>
            <p className="text-sm text-muted-foreground">
              Observability Playground
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ScenarioForm />
            <ObsLinks />
          </div>
          <div className="lg:col-span-2">
            <RunHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
