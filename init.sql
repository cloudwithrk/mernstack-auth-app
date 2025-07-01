
CREATE DATABASE IF NOT EXISTS auth_task_db;

USE auth_task_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    description VARCHAR(255),
    date DATE DEFAULT CURRENT_DATE
);
