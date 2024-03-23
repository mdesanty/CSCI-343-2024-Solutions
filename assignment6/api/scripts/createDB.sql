DROP DATABASE IF EXISTS recipes_db;
CREATE DATABASE recipes_db;

\c recipes_db

DROP TABLE IF EXISTS recipes CASCADE;
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  author VARCHAR(60) NOT NULL,
  description VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  ingredient1 VARCHAR(50) NOT NULL,
  ingredient2 VARCHAR(50),
  ingredient3 VARCHAR(50),
  ingredient4 VARCHAR(50),
  ingredient5 VARCHAR(50)
);

INSERT INTO recipes (name, author, description, category, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5)
  VALUES
    ('Chicken Parm', 'Michael DeSanty', 'Delicious breaded chicken. Smothered in cheese and marinara sauce. Served with pasta.', 'Italian', 'Chicken', 'Mozzerella cheese', 'Pasta', 'Marinara sauce', NULL),
    ('Turkey Sandwitch', 'Michael DeSanty', 'Sliced turkey served on bread with fixings.', 'Lunch', 'Turkey', 'Bread', 'Lettuce', 'Tomatoe', 'Mayonnaise'),
    ('Ham Sandwitch', 'Tony Bologna', 'Sliced ham on bread with cheese and mustard.', 'Lunch', 'Ham', 'Bread', 'Cheese', 'Mustard', NULL),
    ('Chicken Soup', 'Michael DeSanty', 'Delicious home made chicken soup', 'Soups', 'Chicken', 'Carrots', 'Celery', 'Onions', 'Noodles'),
    ('Fish and Chips', 'Patrick Kelly', 'Fried cod and cripsy chips', 'Seafood', 'Cod', 'Batter', 'French fries', NULL, NULL);

