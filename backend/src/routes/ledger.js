import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Create account
router.post("/accounts", async (req, res) => {
  const account = await prisma.account.create({ data: { name: req.body.name } });
  res.json(account);
});

// Record transaction
router.post("/transactions", async (req, res) => {
  const { debitId, creditId, amountCents } = req.body;
  const tx = await prisma.transaction.create({
    data: { debitId, creditId, amountCents }
  });
  res.json(tx);
});

// Get balance
router.get("/accounts/:id/balance", async (req, res) => {
  const id = parseInt(req.params.id);
  const debitSum = await prisma.transaction.aggregate({
    where: { debitId: id },
    _sum: { amountCents: true }
  });
  const creditSum = await prisma.transaction.aggregate({
    where: { creditId: id },
    _sum: { amountCents: true }
  });
  const balance = (creditSum._sum.amountCents || 0) - (debitSum._sum.amountCents || 0);
  res.json({ balanceCents: balance });
});

export default router;
