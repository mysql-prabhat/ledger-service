import React, { useState } from "react";
import API from "../api";

export default function CreateInvoiceForm({ onCreated }) {
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState([{ description: "", amount_cents: "" }]);

  function handleLineItemChange(index, field, value) {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  }

  function addLineItem() {
    setLineItems([...lineItems, { description: "", amount_cents: "" }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/invoices", {
        due_date: dueDate,
        line_items: lineItems.map(li => ({
          description: li.description,
          amount_cents: parseInt(li.amount_cents)
        }))
      });
      alert("Invoice created: " + JSON.stringify(res.data));
      setDueDate("");
      setLineItems([{ description: "", amount_cents: "" }]);
      if (onCreated) onCreated(); // refresh dashboard
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Invoice</h2>
      <label>
        Due Date:
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </label>
      <h3>Line Items</h3>
      {lineItems.map((li, idx) => (
        <div key={idx}>
          <input
            type="text"
            placeholder="Description"
            value={li.description}
            onChange={(e) => handleLineItemChange(idx, "description", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount (cents)"
            value={li.amount_cents}
            onChange={(e) => handleLineItemChange(idx, "amount_cents", e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addLineItem}>+ Add Line Item</button>
      <br />
      <button type="submit">Create Invoice</button>
    </form>
  );
}
