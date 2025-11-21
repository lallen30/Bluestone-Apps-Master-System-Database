-- Sample Property Listings for Knoxville, TN
-- User: user1@knoxweb.com (ID: 22)
-- App: Property Rental App (ID: 28)

INSERT INTO property_listings (
  app_id, user_id, title, description, property_type,
  price_per_night, cleaning_fee, service_fee_percentage,
  address_line1, city, state, country, postal_code,
  bedrooms, bathrooms, guests_max,
  min_nights, max_nights, status
) VALUES
-- 1. Downtown Loft
(28, 22, 'Modern Downtown Loft with City Views',
 'Stunning loft in the heart of downtown Knoxville with floor-to-ceiling windows, exposed brick, and walking distance to Market Square, restaurants, and nightlife. Perfect for business travelers or couples exploring the city.',
 'loft', 125.00, 50.00, 10.0,
 '531 S Gay St', 'Knoxville', 'TN', 'United States', '37902',
 1, 1, 2, 2, 30, 'published', 1),

-- 2. Family House Near UT
(28, 22, 'Spacious Family Home Near University of Tennessee',
 'Beautiful 4-bedroom home in a quiet neighborhood, just minutes from UT campus. Perfect for families visiting students or attending football games. Large backyard, fully equipped kitchen, and plenty of parking.',
 'house', 200.00, 75.00, 10.0,
 '1823 Laurel Ave', 'Knoxville', 'TN', 'United States', '37916',
 4, 3, 8, 2, 14, 'published', 1),

-- 3. Cozy Studio in Old City
(28, 22, 'Cozy Studio in Historic Old City',
 'Charming studio apartment in the vibrant Old City district. Walk to breweries, art galleries, and live music venues. Exposed brick walls, modern amenities, and a murphy bed for extra space.',
 'studio', 85.00, 35.00, 10.0,
 '112 W Jackson Ave', 'Knoxville', 'TN', 'United States', '37902',
 0, 1, 2, 1, 30, 'published', 1),

-- 4. Luxury Condo with River View
(28, 22, 'Luxury Waterfront Condo on Tennessee River',
 'Upscale 2-bedroom condo with breathtaking river views from the private balcony. High-end finishes, granite countertops, stainless appliances, and access to building gym and pool. Minutes from downtown.',
 'condo', 175.00, 60.00, 10.0,
 '900 S Gay St Unit 1502', 'Knoxville', 'TN', 'United States', '37902',
 2, 2, 4, 3, 30, 'published', 1),

-- 5. Charming Cottage in Sequoyah Hills
(28, 22, 'Charming Cottage in Upscale Sequoyah Hills',
 'Adorable 2-bedroom cottage in one of Knoxville\'s most desirable neighborhoods. Hardwood floors, updated kitchen, private patio with garden. Quiet street perfect for morning walks.',
 'house', 150.00, 55.00, 10.0,
 '3847 Taliluna Ave', 'Knoxville', 'TN', 'United States', '37919',
 2, 1, 4, 2, 30, 'published', 1),

-- 6. Pet-Friendly Apartment Near Zoo
(28, 22, 'Pet-Friendly Apartment Near Knoxville Zoo',
 'Welcome your furry friends! Spacious 2-bedroom apartment near Zoo Knoxville and Chilhowee Park. Fenced yard, pet washing station, and walking trails nearby. Great for families with pets.',
 'apartment', 110.00, 45.00, 10.0,
 '3428 Magnolia Ave', 'Knoxville', 'TN', 'United States', '37914',
 2, 1, 4, 2, 30, 'published', 1),

-- 7. Historic Victorian in Fourth & Gill
(28, 22, 'Restored Victorian Home in Fourth & Gill',
 'Step back in time in this beautifully restored 1890s Victorian home. Original hardwood floors, stained glass windows, and period details throughout. Modern kitchen and baths. Walk to downtown.',
 'house', 180.00, 70.00, 10.0,
 '711 Eleanor St', 'Knoxville', 'TN', 'United States', '37917',
 3, 2, 6, 2, 14, 'published', 1),

-- 8. Modern Townhouse in West Knoxville
(28, 22, 'Contemporary Townhouse in West Knoxville',
 'Brand new 3-bedroom townhouse in West Knoxville. Open floor plan, granite counters, stainless appliances, and attached garage. Close to Turkey Creek shopping and dining.',
 'house', 165.00, 65.00, 10.0,
 '11250 Parkside Dr', 'Knoxville', 'TN', 'United States', '37934',
 3, 2, 6, 2, 30, 'published', 1),

-- 9. Affordable Apartment for Students
(28, 22, 'Budget-Friendly Apartment Near UT Campus',
 'Perfect for students or budget travelers! Clean, comfortable 1-bedroom apartment within walking distance to UT. Includes WiFi, parking, and all utilities. Quiet building with laundry facilities.',
 'apartment', 75.00, 30.00, 10.0,
 '1716 Melrose Ave', 'Knoxville', 'TN', 'United States', '37916',
 1, 1, 2, 1, 90, 'published', 1),

-- 10. Luxury Villa in Farragut
(28, 22, 'Stunning Luxury Villa in Farragut',
 'Spectacular 5-bedroom estate home in prestigious Farragut community. Gourmet kitchen, home theater, pool, hot tub, and game room. Perfect for large groups, family reunions, or executive retreats.',
 'villa', 350.00, 125.00, 10.0,
 '12345 Wexford Downs Ln', 'Knoxville', 'TN', 'United States', '37934',
 5, 4, 12, 3, 14, 'published', 1);

-- Verify the listings were created
SELECT 
  id, title, property_type, price_per_night, 
  bedrooms, bathrooms, city, status
FROM property_listings 
WHERE user_id = 22 
ORDER BY id DESC 
LIMIT 10;
