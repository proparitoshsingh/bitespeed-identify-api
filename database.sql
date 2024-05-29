CREATE DATABASE bitespeed;

CREATE TABLE Contact(
   id SERIAL PRIMARY KEY,
   phoneNumber VARCHAR(10) NOT NULL,
   email VARCHAR(40) NOT NULL,
   linkedId INTEGER,
   linkPrecedence VARCHAR(9) CHECK (linkPrecedence IN ('secondary', 'primary')),
   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   deletedAt TIMESTAMP
);