import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import invoicesRouter from "./routes/invoices.js";
import authRouter from "./routes/auth.js";
import ledgerRouter from "./routes/ledger.js";


const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

// --- Auth Middleware ---
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));

app.use("/invoices", invoicesRouter);
app.use("/auth", authRouter);
app.use("/", ledgerRouter); // accounts, transactions, balances

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});