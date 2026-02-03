import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateSubscriptionRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCourses() {
  return useQuery({
    queryKey: [api.courses.list.path],
    queryFn: async () => {
      const res = await fetch(api.courses.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch courses");
      return api.courses.list.responses[200].parse(await res.json());
    },
  });
}

export function useCourse(id: number) {
  return useQuery({
    queryKey: [api.courses.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.courses.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch course");
      return api.courses.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useMyCourses() {
  return useQuery({
    queryKey: [api.subscriptions.listMine.path],
    queryFn: async () => {
      const res = await fetch(api.subscriptions.listMine.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch my courses");
      return api.subscriptions.listMine.responses[200].parse(await res.json());
    },
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSubscriptionRequest) => {
      const res = await fetch(api.subscriptions.subscribe.path, {
        method: api.subscriptions.subscribe.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Try to parse as specific error schema first, else fallback
        if (res.status === 400) throw new Error(errorData.message || "Failed to subscribe");
        if (res.status === 401) throw new Error("Please log in to subscribe");
        throw new Error("Subscription failed");
      }

      return api.subscriptions.subscribe.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.subscriptions.listMine.path] });
      toast({
        title: "Subscribed!",
        description: "You have successfully enrolled in the course.",
      });
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
