-- Organisations
INSERT INTO organisations (name, description, website, email, phone, address) VALUES
('CharityHub Foundation', 'Umbrella org coordinating events', 'https://example.org', 'info@example.org', '+61 8 0000 0000', 'Perth WA'),
('GoodWorks WA', 'Local community support org', 'https://goodworks.wa', 'hello@goodworks.wa', '+61 8 1111 1111', 'Fremantle WA');

-- Categories
INSERT INTO categories (name, slug) VALUES
('Food & Shelter', 'food-shelter'),
('Sports', 'sports'),
('Gala', 'gala'),
('Environment', 'environment'),
('Market', 'market'),
('Education', 'education');

-- Events (at least 8, mixed dates - one suspended)
INSERT INTO events (org_id, category_id, name, description, location, event_date, start_time, end_time, price, goal_amount, raised_amount, suspended, image_url) VALUES
(1, 1, 'Community Food Drive', 'Help us collect non-perishable food for families in need.', 'Perth City Square', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '10:00', '14:00', 0.00, 5000, 1200, 0, '/img/img-1.png'),
(1, 2, 'Charity Run 10K', 'Run for a cause! Proceeds support children education.', 'Kings Park', DATE_ADD(CURDATE(), INTERVAL 21 DAY), '07:00', '11:00', 20.00, 12000, 4500, 0, '/img/img-3.jpg'),
(1, 3, 'Gala Night', 'Music and auctions to support local shelters.', 'Fremantle Town Hall', DATE_ADD(CURDATE(), INTERVAL 35 DAY), '18:00', '22:00', 75.00, 25000, 9000, 0, '/img/img-4.jpg'),
(2, 4, 'Beach Clean-Up', 'Keep our beaches clean and safe.', 'Cottesloe Beach', DATE_ADD(CURDATE(), INTERVAL -14 DAY), '08:00', '12:00', 0.00, 2000, 2000, 0, '/img/img-2.jpeg'),
(2, 5, 'Vendor Fair', 'Local artisans donate a percentage of sales.', 'Subiaco Market', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00', '16:00', 5.00, 3000, 750, 1, '/img/demo.png'),
(1, 6, 'Book Drive', 'Collect books for local schools and libraries.', 'Perth CBD', DATE_ADD(CURDATE(), INTERVAL 14 DAY), '09:00', '15:00', 0.00, 4000, 500, 0, '/img/demo-half.png'),
(2, 2, 'Family Fun Run 5K', 'Casual run/walk suitable for families.', 'South Perth Foreshore', DATE_ADD(CURDATE(), INTERVAL -7 DAY), '08:30', '10:30', 10.00, 6000, 4100, 0, '/img/img-3.jpg'),
(2, 1, 'Community Kitchen Fundraiser', 'Support hot meal services for the homeless.', 'Northbridge Piazza', DATE_ADD(CURDATE(), INTERVAL 60 DAY), '17:00', '20:00', 15.00, 8000, 1200, 0, '/img/img-1.png');
