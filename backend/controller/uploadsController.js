const pool = require("../config/db");

const addUpload = async (req, res) => {
  const { userId, label, fileName } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO files (uid, label, filename) VALUES ($1, $2, $3) RETURNING *",
      [userId, label, fileName]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving upload:", error);
    return res.status(500).send("Server error");
  }
};

const getUploads = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM files");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).send("Server error");
  }
};

const updateUpload = async (req, res) => {
  const { id } = req.params;
  const { file_description } = req.body;

  // Fetch the current file_name if no new file is uploaded
  let file_name = req.file ? req.file.originalname : req.body.file_name || "";

  try {
    const result = await pool.query(
      "UPDATE files SET file_name = $1, label = $2 WHERE id = $3 RETURNING *",
      [file_name, file_description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating upload:", error);
    res.status(500).send("Server error");
  }
};

const deleteUpload = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM files WHERE id = $1", [id]);
    res.json({ message: "Upload deleted" });
  } catch (error) {
    console.error("Error deleting upload:", error);
    res.status(500).send("Server error");
  }
};

module.exports = { getUploads, addUpload, updateUpload, deleteUpload };
