-- Erstellen der Tabelle für Familien
CREATE TABLE Family (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);