import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// List invoices
router.get("/", async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    include: { line_items: true, payments: true }
  });
  res.json(invoices);
});

// Create invoice
router.post("/", async (req, res) => {
  const { due_date, line_items } = req.body;
  const invoice = await prisma.invoice.create({
    data: {
      due_date: new Date(due_date),
      status: "draft",
      line_items: { create: line_items }
    },
    include: { line_items: true }
  });
  res.json(invoice);
});

// Apply payment
router.post("/:id/payments", async (req, res) => {
  const id = parseInt(req.params.id);
  const { amount_cents, referenceId } = req.body;
  // … same payment logic as before
});

export default router;
