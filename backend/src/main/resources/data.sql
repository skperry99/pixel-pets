-- Create sample user
INSERT INTO users (user_name, email, password) VALUES
    ('testuser', 'test@example.com', '$2a$10$Dow1.xf8gMERKQjHTh0DxON9sfMPGFnB0PvcMoVIKDVSDHWoJ3vPG');

-- Sample pets for sample user
INSERT INTO pets (name, type, level, hunger, happiness, energy, user_id) VALUES
    ('Pixel', 'Dog', 1, 100, 100, 100, 1),
    ('Whiskers', 'Cat', 1, 100, 100, 100, 1),
    ('Ember', 'Dragon', 1, 100, 100, 100, 1);