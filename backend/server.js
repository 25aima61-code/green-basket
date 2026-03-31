const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "..")));

// PostgreSQL connection (Railway)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test DB connection
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

  const { name, email, className, item } = req.body;

  try {
    await pool.query(
      "INSERT INTO orders (name, email, class, item) VALUES ($1, $2, $3, $4)",
      [name, email, className, item]
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
  console.log(Server running on port ${PORT});
});