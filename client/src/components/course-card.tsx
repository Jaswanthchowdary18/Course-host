import { type Course } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface CourseCardProps {
  course: Course;
  index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
  const isFree = course.price === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/courses/${course.id}`} className="block h-full">
        <Card className="h-full flex flex-col overflow-hidden bg-card/50 border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group cursor-pointer">
          <div className="relative aspect-video overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            {course.imageUrl ? (
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                <Layers className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-3 right-3 z-20">
              <Badge variant={isFree ? "secondary" : "default"} className={isFree ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary/90 text-white shadow-lg shadow-primary/20"}>
                {isFree ? "Free" : `$${(course.price / 100).toFixed(2)}`}
              </Badge>
            </div>
          </div>
          
          <CardHeader className="space-y-2 pb-2">
            <h3 className="text-xl font-display font-bold leading-tight group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>4.9</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>2h 15m</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

// Helper icon for missing image state
import { Layers } from "lucide-react";
