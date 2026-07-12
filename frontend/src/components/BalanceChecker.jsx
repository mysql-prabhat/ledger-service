import React, { useState } from "react";
import API from "../api";

export default function BalanceChecker() {
  const [accountId, setAccountId] = useState("");
  const [balance, setBalance] = useState(null);

  async function handleCheck() {
    try {
      const res = await API.get(`/accounts/${accountId}/balance`);
      setBalance(res.data.balanceCents);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch balance");
    }
  }

  return (
    <div>
      <h2>Check Balance</h2>
      <input
        type="number"
        placeholder="Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      />
      <button onClick={handleCheck}>Check</button>
      {balance !== null && <p>Balance: {balance} cents</p>}
    </div>
  );
}
