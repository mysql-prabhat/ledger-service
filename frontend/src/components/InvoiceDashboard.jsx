import React, { useEffect, useState } from "react";
import API from "../api";
import CreateInvoiceForm from "./CreateInvoiceForm";

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [amount, setAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  async function fetchInvoices() {
    try {
      const res = await API.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load invoices");
    }
  }

  async function applyPayment(invoiceId) {
    try {
      const res = await API.post(`/invoices/${invoiceId}/payments`, {
        amount_cents: parseInt(amount),
        referenceId
      });
      alert("Payment applied: " + JSON.stringify(res.data));
      setAmount("");
      setReferenceId("");
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert("Payment failed: " + err.response?.data?.error || err.message);
    }
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>
      <CreateInvoiceForm onCreated={fetchInvoices} />
      <h2>Invoices</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Line Items</th>
            <th>Payments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{new Date(inv.due_date).toLocaleDateString()}</td>
              <td>{inv.status}</td>
              <td>
                <ul>
                  {inv.line_items.map((li) => (
                    <li key={li.id}>
                      {li.description} — {li.amount_cents}¢
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {inv.payments.map((p) => (
                    <li key={p.id}>
                      {p.amount_cents}¢ (ref: {p.referenceId})
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => setSelectedInvoice(inv.id)}>
                  Apply Payment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedInvoice && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Apply Payment to Invoice #{selectedInvoice}</h3>
          <input
            type="number"
            placeholder="Amount (cents)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reference ID"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
          />
          <button onClick={() => applyPayment(selectedInvoice)}>Submit</button>
          <button onClick={() => setSelectedInvoice(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
