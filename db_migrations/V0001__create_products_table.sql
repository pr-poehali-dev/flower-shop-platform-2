CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    price VARCHAR(50) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT 'flowers',
    image TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, description, price, category) VALUES
('Белые пионы', 'Нежный моно-букет', '8 900 ₽', 'flowers'),
('Английские розы', 'Сорт David Austin', '12 400 ₽', 'flowers'),
('Изумрудный сад', 'Стекло, мох, суккуленты', '14 800 ₽', 'terrariums');