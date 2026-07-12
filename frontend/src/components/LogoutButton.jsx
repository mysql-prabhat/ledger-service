import React from "react";

export default function LogoutButton({ onLogout }) {
  function handleLogout() {
    localStorage.removeItem("token"); // remove JWT
    onLogout(); // update state in App
  }

  return <button onClick={handleLogout}>Logout</button>;
}
