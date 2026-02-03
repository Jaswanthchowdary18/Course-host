import { useCourses } from "@/hooks/use-courses";
import { Layout } from "@/components/layout";
import { CourseCard } from "@/components/course-card";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-white/5 p-8 md:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/30 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Black Friday Sale Live</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-4">
                Unlock Your <br />
                <span className="text-primary">Potential</span> Today.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Explore our curated collection of expert-led courses designed to help you master new skills in record time.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Featured Courses</h2>
            <div className="text-sm text-muted-foreground">
              Showing {courses?.length} courses
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
          
          {courses?.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-muted-foreground">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
