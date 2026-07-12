import request from "supertest";
import app from "../src/index.js"; // export app from index.js

describe("Ledger Logic", () => {
  let token;
  let accountA, accountB;

  beforeAll(async () => {
    // Register & login
    await request(app).post("/register").send({ email: "test@test.com", password: "pass123" });
    const res = await request(app).post("/login").send({ email: "test@test.com", password: "pass123" });
    token = res.body.token;

    // Create accounts
    accountA = (await request(app).post("/accounts").set("Authorization", `Bearer ${token}`).send({ name: "Cash" })).body;
    accountB = (await request(app).post("/accounts").set("Authorization", `Bearer ${token}`).send({ name: "Revenue" })).body;
  });

  test("Double-entry transaction updates balances correctly", async () => {
    await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ debit_account_id: accountA.id, credit_account_id: accountB.id, amount_cents: 500 });

    const balanceA = (await request(app).get(`/accounts/${accountA.id}/balance`).set("Authorization", `Bearer ${token}`)).body.balance_cents;
    const balanceB = (await request(app).get(`/accounts/${accountB.id}/balance`).set("Authorization", `Bearer ${token}`)).body.balance_cents;

    expect(balanceA).toBe(-500); // debited
    expect(balanceB).toBe(500);  // credited
  });

  test("Prevent overpayment on invoice", async () => {
    const invoice = (await request(app)
      .post("/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({ due_date: new Date(), line_items: [{ description: "Service", amount_cents: 1000 }] })
    ).body;

    await request(app)
      .post(`/invoices/${invoice.id}/payments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount_cents: 1000 });

    const res = await request(app)
      .post(`/invoices/${invoice.id}/payments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount_cents: 500 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Overpayment not allowed");
  });
});
