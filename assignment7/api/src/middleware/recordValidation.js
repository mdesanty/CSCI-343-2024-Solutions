const pgClient = require("../config/pgClient");

const validateCategory = async (req, res, next) => {
  const category = req.body;
  category.id = req.params.id;
  const errors = {};

  if (!category.name || category.name.length === 0) {
    errors.name = "is required.";
  }

  if (category.name && category.name.length > 50) {
    errors.name = "cannot be more than 50 characters.";
  }

  let query;
  if (!!category.id) {
    query = pgClient.query("SELECT id FROM categories WHERE name = $1 AND id != $2", [category.name, category.id]);
  }
  else {
    query = pgClient.query("SELECT id FROM categories WHERE name = $1", [category.name]);
  }

  const categoryExists = (await query).rowCount > 0;
  if (categoryExists) {
    errors.name = "already taken.";
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
  }
  else {
    next();
  }
}

const validateRecipe = async (req, res, next) => {
  const recipe = req.body;
  recipe.id = req.params.id;
  const errors = {};

  if (!recipe.name || recipe.name.length === 0) {
    errors.name = "is required.";
  }

  if (recipe.name && recipe.name.length > 50) {
    errors.name = "cannot be more than 50 characters.";
  }

  let query;
  if (!!recipe.id) {
    query = pgClient.query("SELECT id FROM recipes WHERE name = $1 AND id != $2", [recipe.name, recipe.id]);
  }
  else {
    query = pgClient.query("SELECT id FROM recipes WHERE name = $1", [recipe.name]);
  }

  const recipeExists = (await query).rowCount > 0;
  if (recipeExists) {
    errors.name = "already taken.";
  }

  if (!recipe.description || recipe.description.length === 0) {
    errors.description = "is required.";
  }

  if (recipe.description && recipe.description.length > 255) {
    errors.description = "cannot be more than 255 characters.";
  }

  if (!recipe.category_id || recipe.category_id.length === 0) {
    errors.category_id = "is required.";
  }

  if (!recipe.author_id || recipe.author_id.length === 0) {
    errors.author_id = "is required.";
  }

  recipe.ingredient_ids = recipe.ingredient_ids.filter(id => !isNaN(id));
  if (!recipe.ingredient_ids || recipe.ingredient_ids.length === 0) {
    errors.ingredient_ids = "at least one ingredient is required.";
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
  }
  else {
    next();
  }
}

module.exports = {
  validateCategory,
  validateRecipe
};
