DROP DATABASE IF EXISTS recipes_db;
CREATE DATABASE recipes_db;

\c recipes_db

DROP TABLE IF EXISTS recipes CASCADE;
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  ingredient1 VARCHAR(255),
  ingredient2 VARCHAR(255),
  ingredient3 VARCHAR(255),
  ingredient4 VARCHAR(255),
  ingredient5 VARCHAR(255)
);

INSERT INTO recipes (name, author, description, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5)
VALUES ('', '', '', '', '', '', '', '');

