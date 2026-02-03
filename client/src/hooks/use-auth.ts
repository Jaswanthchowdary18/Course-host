import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertUser } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const userQuery = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid email or password");
        throw new Error("Login failed");
      }
      
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data);
      toast({ title: "Welcome back!", description: `Signed in as ${data.name || data.email}` });
    },
    onError: (error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.auth.signup.path, {
        method: api.auth.signup.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.auth.signup.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Signup failed");
      }

      return api.auth.signup.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Auto-login or just set user data if the backend session is created on signup
      queryClient.setQueryData([api.auth.me.path], data);
      toast({ title: "Account created", description: "Welcome to Mini Course App!" });
    },
    onError: (error) => {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, { 
        method: api.auth.logout.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      toast({ title: "Signed out", description: "See you next time!" });
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation,
    signup: signupMutation,
    logout: logoutMutation,
  };
}
