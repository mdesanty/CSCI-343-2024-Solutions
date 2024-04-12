DROP DATABASE IF EXISTS recipes_db;
CREATE DATABASE recipes_db;

\c recipes_db

DROP TABLE IF EXISTS authors CASCADE;
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS recipes CASCADE;
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS ingredients CASCADE;
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS recipe_ingredients CASCADE;
CREATE TABLE recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE
);

DO $$
  DECLARE
    -- Authors
    mike_id INT;
    myles_id INT;
    randy_id INT;
    kristen_id INT;

    -- Categories
    breakfast_id INT;
    lunch_id INT;
    dinner_id INT;
    dessert_id INT;

    -- Ingredients
    eggs_id INT;
    bacon_id INT;
    milk_id INT;
    bread_id INT;
    lettuce_id INT;
    tomato_id INT;
    turkey_id INT;
    cheese_id INT;
    chicken_id INT;
    rice_id INT;
    beans_id INT;
    steak_id INT;

  BEGIN
    INSERT INTO authors(name) VALUES('Mike') RETURNING id INTO mike_id;
    INSERT INTO authors(name) VALUES('Myles') RETURNING id INTO myles_id;
    INSERT INTO authors(name) VALUES('Randy') RETURNING id INTO randy_id;
    INSERT INTO authors(name) VALUES('Kristen') RETURNING id INTO kristen_id;

    INSERT INTO categories(name) VALUES('Breakfast') RETURNING id INTO breakfast_id;
    INSERT INTO categories(name) VALUES('Lunch') RETURNING id INTO lunch_id;
    INSERT INTO categories(name) VALUES('Dinner') RETURNING id INTO dinner_id;
    INSERT INTO categories(name) VALUES('Dessert') RETURNING id INTO dessert_id;

    INSERT INTO ingredients(name) VALUES('Eggs') RETURNING id INTO eggs_id;
    INSERT INTO ingredients(name) VALUES('Bacon') RETURNING id INTO bacon_id;
    INSERT INTO ingredients(name) VALUES('Milk') RETURNING id INTO milk_id;
    INSERT INTO ingredients(name) VALUES('Bread') RETURNING id INTO bread_id;
    INSERT INTO ingredients(name) VALUES('Lettuce') RETURNING id INTO lettuce_id;
    INSERT INTO ingredients(name) VALUES('Tomato') RETURNING id INTO tomato_id;
    INSERT INTO ingredients(name) VALUES('Turkey') RETURNING id INTO turkey_id;
    INSERT INTO ingredients(name) VALUES('Cheese') RETURNING id INTO cheese_id;
    INSERT INTO ingredients(name) VALUES('Chicken') RETURNING id INTO chicken_id;
    INSERT INTO ingredients(name) VALUES('Rice') RETURNING id INTO rice_id;
    INSERT INTO ingredients(name) VALUES('Beans') RETURNING id INTO beans_id;
    INSERT INTO ingredients(name) VALUES('Steak') RETURNING id INTO steak_id;
  END
$$