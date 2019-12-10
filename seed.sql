DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id VARCHAR(30) NOT NULL,
  product_name VARCHAR(250) NOT NULL,
  department_name VARCHAR(100) NULL,  
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(10) NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES("SKU 6323713", "75-Inch 4320p Sansung Smart LED TV", "Electronics", 4999.99, 10),
("MEER 1600", "Projector, MEER 1600 Lumens 20inch Wide Screen LED", "Electronics", 109.99, 5),
("GTX 1660", "Acer Predator Helios 300 Gaming Laptop 15.6-Inch", "Electronics", 1078.99, 8),
("Dell i3265-A643WHT-PUS", "Inspiron 3265 AIO Desktop", "Electronics", 429.99, 6),
("MOUSE 3509", "TopMate Ultra Slim Portable Mute Wireless Keyboard and Mouse Combo, Office Wireless USB Mouse", "Electronics", 29.99, 15),
("HS720", "Foldable GPS Drone with 2K FHD Camera for Adults, Quadcopter with Brushless Motor", "Electronics", 299.99, 2),
("26 Shoes", "ASICS Men's Gel-Kayano. Running Shoes", "Fashion", 159.95, 10),
("AMZ-955BK", "Circuit Fitness 40 lbs. Flywheel Deluxe Club Revolution Cardio Cycle", "Sports & Fitness", 289.99, 0),
("BOO HWN", "History of Wolves: A Novel", "Books", 18.56, 0),
("BOO HP12", "Harry Potter and the Cursed Child, Parts 1 & 2", "Books", 14.99, 10);
