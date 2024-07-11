-- Erstellen der Tabelle für Personen
CREATE TABLE Person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birth_year INT,
    death_year INT,
    family_id INT,
    parent_id_1 INT,
    parent_id_2 INT,
    spouse_id INT,
    root_person INT,
    image MEDIUMTEXT,
    FOREIGN KEY (family_id) REFERENCES Family(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id_1) REFERENCES Person(id),
    FOREIGN KEY (parent_id_2) REFERENCES Person(id)
);
