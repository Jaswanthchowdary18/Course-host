import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Login schema is slightly different (just username/password)
const loginSchema = z.object({
  username: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, login, signup } = useAuth();
  
  // Get 'tab' query param manually since wouter doesn't have a built-in hook for it
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const signupForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  async function onLogin(data: LoginData) {
    try {
      await login.mutateAsync(data);
    } catch (e) {
      // Error handled by mutation onError
    }
  }

  async function onSignup(data: InsertUser) {
    try {
      await signup.mutateAsync(data);
    } catch (e) {
      // Error handled by mutation onError
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-secondary/20 relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Master Your Skills
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join thousands of learners unlocking their potential with our premium mini-courses. Start your journey today.
            </p>
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mt-8"
          >
            <div className="bg-card/50 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <div className="text-3xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Premium Courses</div>
            </div>
            <div className="bg-card/50 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <div className="text-3xl font-bold text-emerald-400 mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="flex items-center gap-2 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground pl-0">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl font-display">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="hello@example.com" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-12 text-base mt-2" disabled={login.isPending}>
                        {login.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl font-display">Create an account</CardTitle>
                  <CardDescription>Enter your details to get started</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="hello@example.com" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-12 text-base mt-2" disabled={signup.isPending}>
                        {signup.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
