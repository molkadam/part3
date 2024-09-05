const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const result = await pool.query("SELECT * FROM users ORDER BY $1", [id]);
  res.json(result.rows);
};

const getUsersById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  res.json(result.rows);
};

const registerUser = async (req, res) => {
  console.log("req", req);
  try {
    const { id, name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Generate a salt value
    const salt = await bcrypt.genSalt(10);

    // Encrypt the password using the salt value
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const result = await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
      [id, name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal  Server Error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({ error: "Username and Email are required" });
  }

  try {
    // Check if user exists with same email
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, id]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Update user
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );

    // Return updated user
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.json({ message: "User deleted" });
};

const loginUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials 1" });
    }
    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials 2" });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userData = user.rows;
    res.json({ token, email, userData });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  getUsersById,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
};
