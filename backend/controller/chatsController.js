const pool = require("../config/db");

const getChats = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM chatmessages ORDER BY timestamp ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).send("Server error");
  }
};

const addChat = async (req, res) => {
  const { id, uid, message, timestamp } = req.body;

  try {
    await pool.query(
      "INSERT INTO chatmessages (id, uid, message, timestamp) VALUES ($1, $2, $3, $4)",
      [id, uid, message, timestamp]
    );
    res.status(201).send(true);
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).send("Server error");
  }
};

module.exports = { getChats, addChat };
