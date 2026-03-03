const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "exam_system"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (result.length > 0) {
        res.json({ message: "Login Successful" });
      } else {
        res.json({ message: "Invalid Credentials" });
      }
    }
  );
});

app.get("/questions", (req, res) => {
  db.query("SELECT * FROM questions", (err, result) => {
    res.json(result);
  });
});

app.post("/submit", (req, res) => {
  const { user_id, score } = req.body;
  db.query(
    "INSERT INTO results (user_id, score) VALUES (?, ?)",
    [user_id, score],
    () => {
      res.json({ message: "Result Saved" });
    }
  );
});

app.listen(5000, () => console.log("Server running on port 5000"));
