import express from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "supersecret";
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed }
  });
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id },SECRET);
  res.json({ token });
});

// Logout (optional server-side)
router.post("/logout", (req, res) => {
  // If you want to blacklist tokens, store them in DB or cache here
  // For simple stateless JWT, just tell client to delete token
  res.json({ message: "Logged out successfully" });
});

export default router;
