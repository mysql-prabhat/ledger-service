import React, { useState } from "react";
import API from "../api";

export default function AccountForm() {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/accounts", { name });
      alert("Account created: " + JSON.stringify(res.data));
      setName("");
    } catch (err) {
      console.error(err);
      alert("Account creation failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      <input
        type="text"
        placeholder="Account Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      /><br/>
      <button type="submit">Create</button>
    </form>
  );
}
