require("dotenv").config();
const pgClient = require("./pgClient");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/recipes", getRecipes);
app.get("/recipes/:id", getRecipe);
app.post("/recipes", createRecipe);
app.put("/recipes/:id", updateRecipe);
app.delete("/recipes/:id", deleteRecipe);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getRecipes(req, res) {
  const sql = `
    SELECT
      id,
      name,
      author,
      description,
      ingredient1,
      ingredient2,
      ingredient3,
      ingredient4,
      ingredient5
    FROM
      recipes
    ORDER BY
      id DESC
  `;

  pgClient.query(sql)
    .then(results => {
      res.status(200).json(results.rows);
    })
    .catch(error => {
      res.status(500).json({ error: `Error getting recipes: [${error.message}].` });
    });
}

function getRecipe(req, res) {
  const sql = `
    SELECT
      id,
      name,
      author,
      description,
      ingredient1,
      ingredient2,
      ingredient3,
      ingredient4,
      ingredient5
    FROM
      recipes
    WHERE
      id = $1
  `;

  pgClient.query(sql, [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      } else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `Error getting recipe: [${error.message}].` });
    });
}

function createRecipe(req, res) {
  const recipe = req.body;
  const sql = `
    INSERT INTO
      recipes (name, author, description, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id
  `;

  pgClient.query(sql, [
    recipe.name,
    recipe.author,
    recipe.description,
    recipe.ingredient1,
    recipe.ingredient2,
    recipe.ingredient3,
    recipe.ingredient4,
    recipe.ingredient5
  ])
    .then(results => {
      res.location(`/recipes/${results.rows[0].id}`);
      res.status(201).json({ message: "Recipe created successfully." });
    })
    .catch(error => {
      res.status(500).json({ error: `Error creating recipe: [${error.message}].` });
    });
}

function updateRecipe(req, res) {
  const recipe = req.body;
  const sql = `
    UPDATE
      recipes
    SET
      name = $1,
      author = $2,
      description = $3,
      ingredient1 = $4,
      ingredient2 = $5,
      ingredient3 = $6,
      ingredient4 = $7,
      ingredient5 = $8
    WHERE
      id = $9
  `;

  const queryParameters = [
    recipe.name,
    recipe.author,
    recipe.description,
    recipe.ingredient1,
    recipe.ingredient2,
    recipe.ingredient3,
    recipe.ingredient4,
    recipe.ingredient5,
    req.params.id
  ];

  pgClient.query(sql, queryParameters)
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Recipe successfully updated." });
      } else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `Error updating recipe: [${error.message}].` });
    });
}

function deleteRecipe(req, res) {
  const sql = "DELETE FROM recipes WHERE id = $1";

  pgClient.query(sql, [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Recipe successfully deleted." });
      } else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `Error deleting recipe: [${error.message}].` });
    });
}