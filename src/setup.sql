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