import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import InvoiceDashboard from "./components/InvoiceDashboard";
import AccountForm from "./components/AccountForm";
import TransactionForm from "./components/TransactionForm";
import BalanceChecker from "./components/BalanceChecker";
import LogoutButton from "./components/LogoutButton";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [activeMenu, setActiveMenu] = useState("ledger"); // ledger | invoice | auth
  return (
    <div>
      <h1>Ledger & Invoice Service</h1>
      {loggedIn ? (
       <>
          {/* Menu */}
          <nav style={{ marginBottom: "1rem" }}>
            <LogoutButton onLogout={() => setLoggedIn(false)} />
            <button onClick={() => setActiveMenu("ledger")}>Core Ledger</button>
            <button onClick={() => setActiveMenu("invoice")}>Invoice Flow</button>
          </nav>
          {/* Content */}
          {activeMenu === "ledger" && (
            <>
              <AccountForm />
              <TransactionForm />
              <BalanceChecker />
            </>
          )}

          {activeMenu === "invoice" && <InvoiceDashboard />}
        </>
      ) : (
         <>
          {showRegister ? (
            <RegisterForm onRegister={() => {
              alert("You can now log in!");
              setShowRegister(false); // go back to login after registering
            }} />
          ) : (
            <LoginForm onLogin={() => setLoggedIn(true)} />
          )}

          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? "Already have an account? Log in" : "Need an account? Register"}
          </button>
        </>
      )}
    </div>
  );
}
