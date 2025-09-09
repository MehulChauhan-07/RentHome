import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import routes
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/users.js";
import propertyRoutes from "../routes/properties.js";
import adminRoutes from "../routes/admin.js";

// Import middleware
import { errorHandler } from "../middleware/errorHandler.js";
// import { notFound } from '../middleware/notFound.js';

// Initialize Express app
const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_PROD,
      "http://localhost:3000",
      "http://localhost:5173",
    ].filter(Boolean);

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Serve static files (disabled in production/Vercel as they use external storage)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

// Initialize Passport
import passport from "../config/passport.js";
app.use(passport.initialize());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RentHome API Server",
    version: "1.0.0",
    docs: "/api/docs",
  });
});

// Error handling middleware
// app.use(notFound);
app.use(errorHandler);

// Database connection optimized for serverless
let cachedConnection = null;

const connectDB = async () => {
  // If we have a cached connection and it's ready, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_PROD || process.env.MONGODB_URI
        : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // Configure connection for serverless
    const connection = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
    });

    cachedConnection = connection;
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    cachedConnection = null;
    throw error;
  }
};

// Handle unhandled promise rejections (only in non-serverless environments)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
}

// Start server (for local development)
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
    console.log(`Client URL: ${process.env.CLIENT_URL}`);
  });

  return server;
};

// Vercel serverless handler
const handler = async (req, res) => {
  // Ensure database connection
  await connectDB();
  
  // Handle the request
  return app(req, res);
};

// Start the server if running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const isMainModule = process.argv[1] && (process.argv[1].endsWith('index.js') || process.argv[1].includes('api/index.js'));
  if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
    startServer().catch(console.error);
  }
}

// Export for different environments
export { app, startServer, handler };
export default process.env.VERCEL ? handler : app;
