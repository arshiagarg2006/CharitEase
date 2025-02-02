-- Drop database if it exists and create fresh
DROP DATABASE IF EXISTS charitease;
CREATE DATABASE charitease;

-- Connect to database
\c charitease

-- Create all tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL, -- 'donor' or 'organization'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organizations (
    org_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE organization_categories (
    org_id INTEGER REFERENCES organizations(org_id),
    category_id INTEGER REFERENCES categories(category_id),
    PRIMARY KEY (org_id, category_id)
);

CREATE TABLE donations (
    donation_id SERIAL PRIMARY KEY,
    donor_id INTEGER REFERENCES users(user_id),
    org_id INTEGER REFERENCES organizations(org_id),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deliveries (
    delivery_id SERIAL PRIMARY KEY,
    donation_id INTEGER REFERENCES donations(donation_id),
    pickup_address TEXT NOT NULL,
    pickup_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data
INSERT INTO categories (name) VALUES 
    ('clothes'),
    ('books'),
    ('toys'),
    ('food'),
    ('blood');

INSERT INTO organizations (name, description, address, phone, email) 
VALUES 
    ('Helping Hands', 'Providing support to homeless families', '123 Main St', '555-0123', 'help@helpinghands.org'),
    ('Feed the Future', 'Fighting hunger in communities', '456 Oak Ave', '555-0124', 'info@feedfuture.org'),
    ('NB Public Library', 'Supporting education programs', '789 Pine Rd', '555-0125', 'support@nbplf.org');

INSERT INTO organization_categories (org_id, category_id)
VALUES 
    (1, 1), -- Helping Hands: clothes
    (1, 4), -- Helping Hands: food
    (2, 4), -- Feed the Future: food
    (3, 2); -- NB Library: books 