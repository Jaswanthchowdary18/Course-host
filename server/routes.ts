import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 },
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByEmail(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth Routes
  app.post("/api/auth/signup", async (req, res, next) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({ ...data, password: hashedPassword });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        next(err);
      }
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json(null);
    }
  });

  // API Routes
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(404).json({ message: "Invalid ID" });
    
    const course = await storage.getCourse(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  });

  app.post("/api/subscribe", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const schema = z.object({
      courseId: z.number(),
      promoCode: z.string().optional(),
    });
    
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: "Invalid input" });
    
    const { courseId, promoCode } = result.data;
    
    const course = await storage.getCourse(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await storage.getSubscription((req.user as any).id, courseId);
    if (existing) return res.status(400).json({ message: "Already subscribed" });

    let pricePaid = course.price;
    
    if (course.price > 0) {
      if (promoCode === "BFSALE25") {
        pricePaid = Math.floor(course.price / 2);
      } else if (promoCode) {
         return res.status(400).json({ message: "Invalid promo code" });
      }
      // Note: If no promo code provided, user pays full price.
    } else {
      pricePaid = 0;
    }

    const sub = await storage.createSubscription({
      userId: (req.user as any).id,
      courseId,
      pricePaid,
    });
    
    res.status(201).json(sub);
  });

  app.get("/api/my-courses", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const myCourses = await storage.getUserSubscriptions((req.user as any).id);
    res.json(myCourses);
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const courses = await storage.getCourses();
  if (courses.length === 0) {
    await storage.createCourse({
      title: "Full Stack Web Development",
      description: "Master the MERN stack and build modern web applications from scratch.",
      price: 5000, // $50.00
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
    });
    await storage.createCourse({
      title: "React for Beginners",
      description: "Learn React.js fundamentals, hooks, and component-based architecture.",
      price: 0, // Free
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    });
    await storage.createCourse({
      title: "Advanced Node.js",
      description: "Deep dive into Node.js internals, streams, performance optimization, and microservices.",
      price: 3000, // $30.00
      imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    });
    await storage.createCourse({
      title: "UI/UX Design Masterclass",
      description: "Learn to design beautiful interfaces and user experiences using Figma.",
      price: 4000, // $40.00
      imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    });
    await storage.createCourse({
      title: "Python for Data Science",
      description: "Analyze data, create visualizations, and build ML models with Python.",
      price: 0, // Free
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    });
    
    // Create a demo user
    const hashedPassword = await hashPassword("password");
    await storage.createUser({
      email: "demo@example.com",
      password: hashedPassword,
      name: "Demo User",
    });
  }
}
