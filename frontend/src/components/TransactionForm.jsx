import React, { useState } from "react";
import API from "../api";

export default function TransactionForm() {
  const [debitId, setDebitId] = useState("");
  const [creditId, setCreditId] = useState("");
  const [amountCents, setAmountCents] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/transactions", {
        debitId: parseInt(debitId),
        creditId: parseInt(creditId),
        amountCents: parseFloat(amountCents)
      });
      alert("Transaction recorded: " + JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Record Transaction</h2>
      <input
        type="number"
        placeholder="Debit Account ID"
        value={debitId}
        onChange={(e) => setDebitId(e.target.value)}
        required
      /><br/>
      <input
        type="number"
        placeholder="Credit Account ID"
        value={creditId}
        onChange={(e) => setCreditId(e.target.value)}
        required
      /><br/>
      <input
        type="number"
        placeholder="Amount (in cents)"
        value={amountCents}
        onChange={(e) => setAmountCents(e.target.value)}
        required
      /><br/>
      <button type="submit">Submit</button>
    </form>
  );
}
