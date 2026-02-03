import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents. 0 = free
  imageUrl: text("image_url"),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  pricePaid: integer("price_paid").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({ 
  id: true 
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  subscribedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type CreateSubscriptionRequest = {
  courseId: number;
  promoCode?: string;
};
