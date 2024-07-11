-- Erstellen der Tabelle für User
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    display_name VARCHAR(50),
    password VARCHAR(256)
);