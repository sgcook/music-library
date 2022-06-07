const db = require('../services/db');
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
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500).json(err);
  }

  db.close();
}

exports.read = async (_, res) => {
  const db = await getDb();

  try {
    const [albums] = await db.query('SELECT * FROM Album');
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
}

exports.readById = async (req, res) => {
  const db = await getDb();
  const { albumId } = req.params;

  const [[album]] = await db.query('SELECT * FROM Album WHERE id = ?', [
    albumId,
  ]);

  if(!album) {
    res.sendStatus(404);
  } else {
    res.status(200).json(album);
  }

  db.close();
}

exports.update = async (req, res) => {
  const db = await getDb();
  const { albumId } = req.params;
  const data = req.body;

  try {
    const [ { affectedRows }, ] = await db.query('UPDATE Album SET ? WHERE id = ?', [
      data, albumId]);

    if(!affectedRows) {
      res.sendStatus(404);
    } else {
      res.status(200).send();
    }
  } catch (err) {
    res.sendStatus(404);
  }

  db.close();
}

exports.destroy = async(req, res) => {
  const db = await getDb();
  const { albumId } = req.params;

  try {
    const [ { affectedRows }, ] = await db.query('DELETE FROM Album WHERE id = ?', [albumId]);

    if(!affectedRows) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  } catch(err) {
    res.sendStatus(404);
  }

  db.close();
}