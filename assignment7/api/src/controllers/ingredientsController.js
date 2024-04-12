const pgClient = require('../config/pgClient');

const index = (req, res) => {
  pgClient.query("SELECT id, name FROM ingredients ORDER BY name ASC")
    .then(results => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

module.exports = {
  index
};
