const pgClient = require('../config/pgClient');

const index = (req, res) => {
  const sql = `
    SELECT
      r.id,
      r.name,
      r.description,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS category,
      json_build_object(
        'id', a.id,
        'name', a.name
      ) AS author,
	  json_agg(
		json_build_object(
		  'id', i.id,
	      'name', i.name
        )
	  ) AS ingredients
    FROM
      recipes r
      INNER JOIN categories c ON c.id = r.category_id
      INNER JOIN authors a ON a.id = r.author_id
      INNER JOIN recipe_ingredients ri ON ri.recipe_id = r.id
      INNER JOIN ingredients i ON i.id = ri.ingredient_id
    GROUP BY
      r.id,
      r.name,
      r.description,
      c.id,
      a.id
    ORDER BY
      r.name ASC
  `;

  pgClient.query(sql)
    .then(results => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

const show = (req, res) => {
  const sql = `
    SELECT
      r.id,
      r.name,
      r.description,
      json_build_object(
        'id', c.id,
        'name', c.name
      ) AS category,
      json_build_object(
        'id', a.id,
        'name', a.name
      ) AS author,
      json_agg(
        json_build_object(
          'id', i.id,
          'name', i.name
        )
      ) AS ingredients
    FROM
      recipes r
      INNER JOIN categories c ON c.id = r.category_id
      INNER JOIN authors a ON a.id = r.author_id
      INNER JOIN recipe_ingredients ri ON ri.recipe_id = r.id
      INNER JOIN ingredients i ON i.id = ri.ingredient_id
    WHERE
      r.id = $1
    GROUP BY
      r.id,
      r.name,
      r.description,
      c.id,
      a.id
  `;

  pgClient.query(sql, [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: `Recipe not found for id ${req.params.id}.` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

const create = async (req, res) => {
  const recipe = req.body;
  let recipeId;

  try {
    await pgClient.query("BEGIN");
    const recipeResult = await pgClient.query("INSERT INTO recipes (name, description, category_id, author_id) VALUES ($1, $2, $3, $4) RETURNING id", [recipe.name, recipe.description, recipe.category_id, recipe.author_id]);
    recipeId = recipeResult.rows[0].id;

    const ingredientSql = `
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
      VALUES
        ${recipe.ingredient_ids.map(ingredientId => `(${recipeId}, ${ingredientId})`).join(',')}
    `;
    await pgClient.query(ingredientSql);
    await pgClient.query("COMMIT");
  }
  catch (error) {
    await pgClient.query("ROLLBACK");
    res.status(500).json({ error: `Error: ${error}.` });

    return
  }

  res.location(`/recipes/${recipeId}`);
  res.status(201).json({ message: 'Recipe created successfully.' });
}

const update = async (req, res) => {
  const recipe = req.body;

  try {
    const currentIngredients = await pgClient.query("SELECT ingredient_id FROM recipe_ingredients WHERE recipe_id = $1", [req.params.id]);
    const currentIngredientIds = currentIngredients.rows.map(row => row.ingredient_id);

    const sql = `
      UPDATE recipes SET
        name = $1,
        description = $2,
        category_id = $3,
        author_id = $4
      WHERE
        id = $5
    `;

    const sqlParams = [
      recipe.name,
      recipe.description,
      recipe.category_id,
      recipe.author_id,
      req.params.id
    ];

    await pgClient.query("BEGIN");
    await pgClient.query(sql, sqlParams);

    const removedIngredients = currentIngredientIds.filter(ingredientId => !recipe.ingredient_ids.includes(ingredientId));
    const newIngredients = recipe.ingredient_ids.filter(ingredientId => !currentIngredientIds.includes(ingredientId));

    if (removedIngredients.length > 0) {
      const ingredientSql = `
        DELETE FROM recipe_ingredients
        WHERE
          recipe_id = $1
          AND ingredient_id IN (${removedIngredients.join(',')})
      `;
      await pgClient.query(ingredientSql, [req.params.id]);
    }

    if (newIngredients.length > 0) {
      const ingredientSql = `
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
        VALUES
          ${newIngredients.map(ingredientId => `(${req.params.id}, ${ingredientId})`).join(',')}
      `;
      await pgClient.query(ingredientSql);
    }

    await pgClient.query("COMMIT");
  }
  catch (error) {
    await pgClient.query("ROLLBACK");
    res.status(500).json({ error: `Error: ${error}.` });

    return
  }

  res.status(200).json({ message: 'Recipe updated successfully.' });
}

const destroy = (req, res) => {
  pgClient.query("DELETE FROM recipes WHERE id = $1", [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Recipe successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}` });
    });
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};