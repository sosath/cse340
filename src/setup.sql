-- ============================
-- Organization Table
-- ============================
CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

-- =====================================
-- Insert sample data: Organizations
-- =====================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ==========================================
-- Create Service Projects Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id) 
        REFERENCES public.organization(organization_id)
        ON DELETE CASCADE
);

-- ==========================================
-- Insert Sample Projects (5 per Organization)
-- ==========================================

-- Projects for Organization 1 (BrightFuture Builders)
INSERT INTO public.project (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Painting and repairing the main hall of the local community center.', 'Downtown Community Center', '2026-06-15'),
(1, 'Park Bench Installation', 'Building and installing 10 new eco-friendly benches in Central Park.', 'Central Park Sector 4', '2026-07-22'),
(1, 'School Roof Repair', 'Fixing leaks and replacing tiles on the elementary school roof.', 'Westside Elementary', '2026-08-05'),
(1, 'Library Shelving Update', 'Assembling and organizing new bookshelves for the kids section.', 'Public Library Branch B', '2026-09-12'),
(1, 'Wheelchair Ramp Construction', 'Building accessible concrete ramps at the local clinic entrance.', 'Community Health Clinic', '2026-10-18');

-- Projects for Organization 2 (GreenHarvest Growers)
INSERT INTO public.project (organization_id, title, description, location, date) VALUES
(2, 'Urban Greenhouse Assembly', 'Setting up a new hydroponic greenhouse for winter vegetable growth.', 'Community Garden Lot A', '2026-06-20'),
(2, 'Composting Workshop Setup', 'Building public compost bins and preparing instructional signage.', 'Northside Botanical Park', '2026-07-11'),
(2, 'Fruit Tree Planting Drive', 'Planting 50 citrus trees in urban neighborhood sidewalks.', 'District 3 Residential Area', '2026-08-29'),
(2, 'Drip Irrigation Installation', 'Laying down efficient water pipes for the local community farm.', 'South Valley Cultivation Plots', '2026-09-05'),
(2, 'Seasonal Seed Harvesting', 'Collecting, sorting, and packaging organic seeds for the next spring.', 'GreenHarvest Main Office HQ', '2026-10-02');

-- Projects for Organization 3 (UnityServe Volunteers)
INSERT INTO public.project (organization_id, title, description, location, date) VALUES
(3, 'Homeless Shelter Kitchen Support', 'Preparing and serving hot meals for families in need.', 'Hope Shelter Downtown', '2026-06-05'),
(3, 'Senior Tech Literacy Day', 'Teaching elderly citizens how to use smartphones and video calls.', 'Golden Years Retirement Home', '2026-07-19'),
(3, 'Clothing Drive Sorting', 'Organizing and boxing donated winter clothes for distribution.', 'UnityServe Distribution Warehouse', '2026-08-14'),
(3, 'After-School Tutoring Camp', 'Providing math and reading support for underprivileged children.', 'Youth Recreation Center', '2026-09-20'),
(3, 'Neighborhood Clean-up Rally', 'Collecting litter and cleaning graffiti from public squares.', 'East Gate Market District', '2026-10-10');

-- ==========================================
-- Create Categories and Junction Tables
-- ==========================================

-- 1. Create Category Table
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Create Junction Table for Many-to-Many relationship
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY(project_id) 
        REFERENCES public.project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY(category_id) 
        REFERENCES public.category(category_id)
        ON DELETE CASCADE
);

-- ==========================================
-- Insert Sample Categories (At least 3)
-- ==========================================
INSERT INTO public.category (name) VALUES
('Infrastructure & Renovation'),
('Environment & Agriculture'),
('Education & Community Support')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- Associate Existing 15 Projects with Categories
-- ==========================================

-- Organization 1 Projects (IDs 1-5) -> Infrastructure & Renovation (Category 1)
INSERT INTO public.project_category (project_id, category_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1);

-- Organization 2 Projects (IDs 6-10) -> Environment & Agriculture (Category 2)
INSERT INTO public.project_category (project_id, category_id) VALUES
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2);

-- Organization 3 Projects (IDs 11-15) -> Education & Community Support (Category 3)
INSERT INTO public.project_category (project_id, category_id) VALUES
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3);

-- Adding a few multi-category associations to satisfy "Many-to-Many" specification
INSERT INTO public.project_category (project_id, category_id) VALUES
(4, 3),  -- Library Shelving Update also counts as Education
(7, 1),  -- Composting Workshop Setup also involves Infrastructure (building bins)
(14, 1); -- After-School Tutoring Camp also linked to Community Support space

-- Create roles table
CREATE TABLE public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- Seed data for roles
INSERT INTO public.roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Create users table
CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES public.roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);