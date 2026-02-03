import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useCourse, useSubscribe } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, AlertCircle, Clock, Globe, Shield, Star, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function CourseDetailsPage() {
  const [, params] = useRoute("/courses/:id");
  const [, setLocation] = useLocation();
  const id = Number(params?.id);
  
  const { data: course, isLoading, error } = useCourse(id);
  const { user } = useAuth();
  const subscribe = useSubscribe();
  const { toast } = useToast();
  
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPromoError, setIsPromoError] = useState(false);

  // Black Friday Promo Logic
  const VALID_PROMO = "BFSALE25";
  const DISCOUNT_PERCENT = 0.5;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === VALID_PROMO) {
      setIsPromoApplied(true);
      setIsPromoError(false);
      toast({
        title: "Promo Code Applied!",
        description: "50% discount has been applied to the price.",
        variant: "default",
      });
    } else {
      setIsPromoError(true);
      setIsPromoApplied(false);
      toast({
        title: "Invalid Promo Code",
        description: "The code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe to this course.",
      });
      setLocation(`/auth?redirect=/courses/${id}`);
      return;
    }

    try {
      await subscribe.mutateAsync({
        courseId: id,
        promoCode: isPromoApplied ? VALID_PROMO : undefined,
      });
      setLocation("/my-courses");
    } catch (e) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <Button onClick={() => setLocation("/")}>Back to Courses</Button>
        </div>
      </Layout>
    );
  }

  const isFree = course.price === 0;
  const originalPrice = course.price / 100;
  const finalPrice = isPromoApplied ? originalPrice * DISCOUNT_PERCENT : originalPrice;
  const canSubscribe = isFree || isPromoApplied;

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Section with Image Background */}
        <div className="relative rounded-3xl overflow-hidden mb-8 aspect-[21/9]">
          <div className="absolute inset-0 bg-black/60 z-10" />
          {course.imageUrl ? (
            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
          
          <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end">
            <Badge className="w-fit mb-4 bg-primary text-white border-none">
              {isFree ? "Free Course" : "Premium Course"}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium text-white">4.9</span>
                <span>(120 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last updated Nov 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <Card className="p-8 border-white/5 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-display font-bold mb-4">About this course</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-bold block text-foreground mb-1">Beginner Friendly</span>
                    <span className="text-muted-foreground">No prior experience required</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <span className="font-bold block text-foreground mb-1">Certificate</span>
                    <span className="text-muted-foreground">Earn a badge upon completion</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar / Checkout */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 border-white/5 shadow-2xl bg-card">
                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-display font-bold">
                      {isFree ? "Free" : `$${finalPrice.toFixed(2)}`}
                    </span>
                    {!isFree && isPromoApplied && (
                      <span className="text-lg text-muted-foreground line-through mb-1.5">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {!isFree && (
                    <p className="text-sm text-muted-foreground">One-time payment. Lifetime access.</p>
                  )}
                </div>

                {!isFree && (
                  <div className="space-y-4 mb-6 pt-6 border-t border-white/10">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Promo Code
                      </label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ex: BFSALE25" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={isPromoApplied}
                          className={isPromoError ? "border-destructive" : ""}
                        />
                        <Button 
                          onClick={handleApplyPromo}
                          disabled={isPromoApplied || !promoCode}
                          variant="secondary"
                        >
                          Apply
                        </Button>
                      </div>
                      <AnimatePresence>
                        {isPromoApplied && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="text-xs text-emerald-400 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Discount applied!
                          </motion.div>
                        )}
                        {!isFree && !isPromoApplied && (
                          <div className="text-xs text-amber-500 flex items-start gap-1.5 mt-2 bg-amber-500/10 p-2 rounded">
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>A valid promo code is required to subscribe to this premium course.</span>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full text-base font-semibold shadow-lg shadow-primary/25" 
                  onClick={handleSubscribe}
                  disabled={subscribe.isPending || !canSubscribe}
                >
                  {subscribe.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : !canSubscribe ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Enter Promo to Unlock
                    </>
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  30-day money-back guarantee
                </p>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
