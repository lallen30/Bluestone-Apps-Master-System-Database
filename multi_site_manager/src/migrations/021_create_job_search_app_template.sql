-- ============================================
-- Job Search/Recruitment App Template
-- Migration: 021
-- Created: Nov 7, 2025
-- Description: Complete template for job search and recruitment apps
--              (like LinkedIn Jobs, Indeed, Glassdoor, ZipRecruiter)
-- ============================================

-- Create the Job Search App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at) VALUES
('Job Search & Recruitment', 'Complete template for job search and recruitment applications. Includes job listings, applications, resume builder, company profiles, and interview scheduling.', 'Business & Productivity', 'Briefcase', 1, NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- ADD SCREENS TO TEMPLATE
-- ============================================

-- AUTHENTICATION & ONBOARDING (7 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 1, 0, NOW()),
(@template_id, 'Onboarding', 'onboarding', 'Job app introduction', 'BookOpen', 'Onboarding', 2, 0, NOW()),
(@template_id, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, NOW()),
(@template_id, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, NOW()),
(@template_id, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, NOW()),
(@template_id, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, NOW()),
(@template_id, 'Profile Setup', 'profile_setup', 'Complete profile after signup', 'User', 'Onboarding', 7, 0, NOW());

-- MAIN NAVIGATION (2 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Home Feed', 'home_feed', 'Job recommendations feed', 'Home', 'Navigation', 8, 1, NOW()),
(@template_id, 'Search Jobs', 'search_jobs', 'Search and filter jobs', 'Search', 'Navigation', 9, 0, NOW());

-- JOB DISCOVERY (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Browse Jobs', 'browse_jobs', 'Explore all job listings', 'Grid', 'Discovery', 10, 0, NOW()),
(@template_id, 'Job Categories', 'job_categories', 'Browse by category', 'Folder', 'Discovery', 11, 0, NOW()),
(@template_id, 'Nearby Jobs', 'nearby_jobs', 'Jobs near you', 'MapPin', 'Discovery', 12, 0, NOW()),
(@template_id, 'Remote Jobs', 'remote_jobs', 'Work from home opportunities', 'Home', 'Discovery', 13, 0, NOW()),
(@template_id, 'Recommended Jobs', 'recommended_jobs', 'Personalized recommendations', 'ThumbsUp', 'Discovery', 14, 0, NOW());

-- JOB DETAILS (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Job Details', 'job_details', 'Full job description', 'FileText', 'Jobs', 15, 0, NOW()),
(@template_id, 'Company Profile', 'company_profile', 'Company information', 'Building', 'Jobs', 16, 0, NOW()),
(@template_id, 'Company Reviews', 'company_reviews', 'Employee reviews', 'Star', 'Jobs', 17, 0, NOW()),
(@template_id, 'Similar Jobs', 'similar_jobs', 'Related job listings', 'List', 'Jobs', 18, 0, NOW());

-- APPLICATION PROCESS (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Apply for Job', 'apply_for_job', 'Job application form', 'Send', 'Applications', 19, 0, NOW()),
(@template_id, 'Quick Apply', 'quick_apply', 'One-click application', 'Zap', 'Applications', 20, 0, NOW()),
(@template_id, 'Application Questions', 'application_questions', 'Screening questions', 'HelpCircle', 'Applications', 21, 0, NOW()),
(@template_id, 'Upload Documents', 'upload_documents', 'Upload resume and cover letter', 'Upload', 'Applications', 22, 0, NOW()),
(@template_id, 'Application Confirmation', 'application_confirmation', 'Application submitted', 'CheckCircle', 'Applications', 23, 0, NOW()),
(@template_id, 'My Applications', 'my_applications', 'Track application status', 'List', 'Applications', 24, 0, NOW());

-- RESUME & PROFILE (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'My Resume', 'my_resume', 'View and edit resume', 'FileText', 'Profile', 25, 0, NOW()),
(@template_id, 'Resume Builder', 'resume_builder', 'Create resume', 'Edit', 'Profile', 26, 0, NOW()),
(@template_id, 'Work Experience', 'work_experience', 'Add work history', 'Briefcase', 'Profile', 27, 0, NOW()),
(@template_id, 'Education', 'education', 'Add education', 'BookOpen', 'Profile', 28, 0, NOW()),
(@template_id, 'Skills', 'skills', 'Add skills and certifications', 'Award', 'Profile', 29, 0, NOW());

-- SAVED & ALERTS (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Saved Jobs', 'saved_jobs', 'Bookmarked jobs', 'Bookmark', 'Saved', 30, 0, NOW()),
(@template_id, 'Job Alerts', 'job_alerts', 'Set up job alerts', 'Bell', 'Saved', 31, 0, NOW()),
(@template_id, 'Followed Companies', 'followed_companies', 'Companies you follow', 'Heart', 'Saved', 32, 0, NOW());

-- INTERVIEWS (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Interview Schedule', 'interview_schedule', 'Upcoming interviews', 'Calendar', 'Interviews', 33, 0, NOW()),
(@template_id, 'Interview Details', 'interview_details', 'Interview information', 'FileText', 'Interviews', 34, 0, NOW()),
(@template_id, 'Interview Preparation', 'interview_preparation', 'Tips and resources', 'BookOpen', 'Interviews', 35, 0, NOW()),
(@template_id, 'Video Interview', 'video_interview', 'Virtual interview', 'Video', 'Interviews', 36, 0, NOW());

-- SALARY & INSIGHTS (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Salary Calculator', 'salary_calculator', 'Estimate salary range', 'DollarSign', 'Insights', 37, 0, NOW()),
(@template_id, 'Career Insights', 'career_insights', 'Industry trends', 'TrendingUp', 'Insights', 38, 0, NOW()),
(@template_id, 'Skill Assessment', 'skill_assessment', 'Test your skills', 'Award', 'Insights', 39, 0, NOW());

-- NETWORKING (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Connections', 'connections', 'Professional network', 'Users', 'Networking', 40, 0, NOW()),
(@template_id, 'Messages', 'messages', 'Chat with recruiters', 'MessageCircle', 'Networking', 41, 0, NOW()),
(@template_id, 'Referrals', 'referrals', 'Employee referrals', 'UserPlus', 'Networking', 42, 0, NOW());

-- NOTIFICATIONS (1 screen)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 43, 0, NOW());

-- PROFILE & SETTINGS (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 44, 0, NOW()),
(@template_id, 'Edit Profile', 'edit_profile', 'Update profile', 'Edit', 'Profile', 45, 0, NOW()),
(@template_id, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 46, 0, NOW()),
(@template_id, 'Privacy Settings', 'privacy_settings', 'Control visibility', 'Lock', 'Settings', 47, 0, NOW());

-- SUPPORT & INFORMATION (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 48, 0, NOW()),
(@template_id, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 49, 0, NOW()),
(@template_id, 'About Us', 'about_us', 'App information', 'Info', 'Information', 50, 0, NOW()),
(@template_id, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 51, 0, NOW()),
(@template_id, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 52, 0, NOW());

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    t.id,
    t.name,
    t.category,
    COUNT(ts.id) as screen_count
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
WHERE t.id = @template_id
GROUP BY t.id, t.name, t.category;

SELECT 'Job Search & Recruitment Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
