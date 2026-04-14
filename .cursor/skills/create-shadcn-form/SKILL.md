---
name: create-shadcn-form
description: Create a validated form using React Hook Form with shadcn/ui components and TanStack Query mutation
---

# Create shadcn/ui Form with RHF

## When to Use

- You need a new form on the frontend.
- PRD specifies user input that goes to an API endpoint.
- You want a form with proper validation, loading states, and toast notifications.

## Steps

### 1. Define the API Function

In `lib/api.ts`:

```typescript
export interface CreateXxxRequest {
  field: string;
  optionalField?: string;
}

export interface CreateXxxResponse {
  id: string;
}

export function createXxx(data: CreateXxxRequest) {
  return apiFetch<CreateXxxResponse>('/api/xxx', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### 2. Create the Form Component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createXxx, type CreateXxxRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function XxxForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<CreateXxxRequest>({
    defaultValues: { field: "", optionalField: "" },
  });

  const mutation = useMutation({
    mutationFn: createXxx,
    onSuccess: (result) => {
      toast.success("Created successfully", { description: `ID: ${result.id}` });
      queryClient.invalidateQueries({ queryKey: ["xxx"] });
      reset();
    },
    onError: (error: Error) => {
      toast.error("Failed", { description: error.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Xxx</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
          <Input {...register("field", { required: true })} placeholder="Field" />
          <Input {...register("optionalField")} placeholder="Optional" />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Key Patterns

- Always use `"use client"` directive for form components.
- Wrap API calls with `useMutation` from TanStack Query.
- Invalidate related queries after successful mutation.
- Show toast notifications for success and error states.
- Disable submit button during pending state.
- Use `register()` for simple inputs, `setValue()` + `watch()` for selects.
