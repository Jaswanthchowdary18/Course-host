import { users, courses, subscriptions, type User, type InsertUser, type Course, type InsertCourse, type Subscription, type InsertSubscription } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>; // For seeding

  createSubscription(sub: InsertSubscription): Promise<Subscription>;
  getUserSubscriptions(userId: number): Promise<(Course & { pricePaid: number; subscribedAt: Date | null })[]>;
  getSubscription(userId: number, courseId: number): Promise<Subscription | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async createSubscription(insertSub: InsertSubscription): Promise<Subscription> {
    const [sub] = await db.insert(subscriptions).values(insertSub).returning();
    return sub;
  }

  async getUserSubscriptions(userId: number): Promise<(Course & { pricePaid: number; subscribedAt: Date | null })[]> {
    const result = await db
      .select({
        // Select all course fields manually or spread? Drizzle select join helper is easier.
        // Let's explicitly map.
        id: courses.id,
        title: courses.title,
        description: courses.description,
        price: courses.price,
        imageUrl: courses.imageUrl,
        pricePaid: subscriptions.pricePaid,
        subscribedAt: subscriptions.subscribedAt,
      })
      .from(subscriptions)
      .innerJoin(courses, eq(subscriptions.courseId, courses.id))
      .where(eq(subscriptions.userId, userId));
    
    return result;
  }

  async getSubscription(userId: number, courseId: number): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions).where(
      and(eq(subscriptions.userId, userId), eq(subscriptions.courseId, courseId))
    );
    return sub;
  }
}

export const storage = new DatabaseStorage();
