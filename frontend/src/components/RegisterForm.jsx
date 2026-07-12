import React, { useState } from "react";
import API from "../api"; // axios instance pointing to http://localhost:4000

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/register", { email, password });
      alert("Registration successful!");
      if (onRegister) onRegister(res.data); // optional callback
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br/>
      <button type="submit">Register</button>
    </form>
  );
}
