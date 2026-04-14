"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { runScenario } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCENARIO_TYPES = [
  { value: "success", label: "Success" },
  { value: "validation_error", label: "Validation Error" },
  { value: "system_error", label: "System Error" },
  { value: "slow_request", label: "Slow Request" },
  { value: "teapot", label: "Teapot (Easter Egg)" },
] as const;

interface FormValues {
  type: string;
  name: string;
}

export function ScenarioForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: { type: "success", name: "" },
    });

  const selectedType = watch("type");

  const mutation = useMutation({
    mutationFn: (data: FormValues) => runScenario(data.type, data.name || undefined),
    onSuccess: (result) => {
      if (result.signal === 42) {
        toast.success(`🫖 ${result.message}`, {
          description: `Signal: ${result.signal}`,
        });
      } else {
        toast.success("Scenario completed", {
          description: `ID: ${result.id}, Duration: ${result.duration}ms`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["history"] });
      reset({ type: selectedType, name: "" });
    },
    onError: (error: Error) => {
      toast.error("Scenario failed", { description: error.message });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Scenario</CardTitle>
        <CardDescription>
          Select a scenario type and run it to generate observability signals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Scenario Type</label>
            <Select
              value={selectedType}
              onValueChange={(val) => val && setValue("type", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIO_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Name (optional)</label>
            <Input
              {...register("name")}
              placeholder="Enter scenario name..."
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Running..." : "Run Scenario"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
