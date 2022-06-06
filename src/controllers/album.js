const getDb = require('../services/db');

exports.create = async (req, res) => {
  const db = await getDb();
  const { name, year } = req.body;

  try {
    await db.query(`
    INSERT INTO Album (name, year) 
    VALUES (?, ?)`, [
      name,
      year,
    ]);
    res.sendSgtatus(201);
  } catch (err) {
    res.sendStatus(500).json(err);
  }

  db.close();
}