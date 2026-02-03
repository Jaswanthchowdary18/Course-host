import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Layers, User as UserIcon } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              MiniCourse
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/my-courses">
                  <Button variant={location === "/my-courses" ? "secondary" : "ghost"} size="sm" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">My Courses</span>
                  </Button>
                </Link>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden sm:inline-block">
                    {user.name || user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/auth?tab=signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 MiniCourse Subscription App. Built for excellence.</p>
        </div>
      </footer>
    </div>
  );
}
