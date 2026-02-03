import { useMyCourses } from "@/hooks/use-courses";
import { Layout } from "@/components/layout";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, DollarSign, PlayCircle, Search } from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function MyCoursesPage() {
  const { data: myCourses, isLoading } = useMyCourses();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isAuthLoading, setLocation]);

  if (isLoading || isAuthLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">My Learning</h1>
            <p className="text-muted-foreground">Manage your enrolled courses and track progress</p>
          </div>
        </div>

        {myCourses && myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="relative aspect-video bg-secondary">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                        <PlayCircle className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" className="rounded-full">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{course.title}</h3>
                  </CardHeader>
                  
                  <CardContent className="flex-1 text-sm space-y-3">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Enrolled: {format(new Date(course.subscribedAt), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Paid: ${(course.pricePaid / 100).toFixed(2)}</span>
                    </div>
                    
                    {/* Fake progress bar */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%] rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Link href={`/courses/${course.id}`} className="w-full">
                      <Button variant="outline" className="w-full">View Course Info</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <div className="p-4 rounded-full bg-secondary mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No courses yet</h3>
            <p className="text-muted-foreground max-w-sm text-center mb-6">
              You haven't subscribed to any courses yet. Browse our catalog to find something new to learn.
            </p>
            <Link href="/">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
