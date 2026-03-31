const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "..")));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test DB
pool.connect()
  .then(() => console.log("Connected to PostgreSQL ✅"))
  .catch(err => console.log("DB ERROR:", err));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Insert order
app.post("/add-order", async (req, res) => {
  console.log("DATA RECEIVED:", req.body);

  const { name, email, item, quantity } = req.body;

  try {
    await pool.query(
      "INSERT INTO orders (name, email, item, quantity) VALUES ($1, $2, $3, $4)",
      [name, email, item, quantity]
    );

    res.send("Order Placed Successfully ✅");
  } catch (err) {
    console.log("INSERT ERROR:", err);
    res.send("Error inserting data");
  }
});

// View orders
app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    res.send("Error fetching data");
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log('Server running on port${PORT}');
});