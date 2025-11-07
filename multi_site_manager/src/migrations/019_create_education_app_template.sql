-- ============================================
-- Education/Learning Platform Template
-- Migration: 019
-- Created: Nov 7, 2025
-- Description: Complete template for online learning and education apps
--              (like Udemy, Coursera, Khan Academy, Duolingo)
-- ============================================

-- Create the Education App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at) VALUES
('Education & Learning Platform', 'Complete template for online learning and education applications. Includes courses, lessons, quizzes, progress tracking, certificates, and live classes.', 'Education', 'BookOpen', 1, NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- ADD SCREENS TO TEMPLATE
-- ============================================

-- AUTHENTICATION & ONBOARDING (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 1, 0, NOW()),
(@template_id, 'Onboarding', 'onboarding', 'Learning platform introduction', 'BookOpen', 'Onboarding', 2, 0, NOW()),
(@template_id, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, NOW()),
(@template_id, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, NOW()),
(@template_id, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, NOW()),
(@template_id, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, NOW());

-- MAIN NAVIGATION (2 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Home Dashboard', 'home_dashboard', 'Main learning dashboard', 'Home', 'Navigation', 7, 1, NOW()),
(@template_id, 'Search', 'search', 'Search courses and content', 'Search', 'Navigation', 8, 0, NOW());

-- COURSE DISCOVERY (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Browse Courses', 'browse_courses', 'Explore available courses', 'Grid', 'Discovery', 9, 0, NOW()),
(@template_id, 'Course Categories', 'course_categories', 'Browse by category', 'Folder', 'Discovery', 10, 0, NOW()),
(@template_id, 'Featured Courses', 'featured_courses', 'Highlighted courses', 'Star', 'Discovery', 11, 0, NOW()),
(@template_id, 'Trending Courses', 'trending_courses', 'Popular courses', 'TrendingUp', 'Discovery', 12, 0, NOW()),
(@template_id, 'Recommended', 'recommended', 'Personalized recommendations', 'ThumbsUp', 'Discovery', 13, 0, NOW());

-- COURSE DETAILS (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Course Details', 'course_details', 'Course information and curriculum', 'FileText', 'Courses', 14, 0, NOW()),
(@template_id, 'Course Preview', 'course_preview', 'Preview course content', 'Eye', 'Courses', 15, 0, NOW()),
(@template_id, 'Instructor Profile', 'instructor_profile', 'View instructor details', 'User', 'Courses', 16, 0, NOW()),
(@template_id, 'Course Reviews', 'course_reviews', 'Student reviews and ratings', 'Star', 'Courses', 17, 0, NOW());

-- LEARNING (8 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'My Courses', 'my_courses', 'Enrolled courses', 'BookOpen', 'Learning', 18, 0, NOW()),
(@template_id, 'Course Player', 'course_player', 'Video lesson player', 'Play', 'Learning', 19, 0, NOW()),
(@template_id, 'Lesson Content', 'lesson_content', 'Text and media lesson', 'FileText', 'Learning', 20, 0, NOW()),
(@template_id, 'Course Notes', 'course_notes', 'Take and view notes', 'Edit', 'Learning', 21, 0, NOW()),
(@template_id, 'Bookmarks', 'bookmarks', 'Saved lessons', 'Bookmark', 'Learning', 22, 0, NOW()),
(@template_id, 'Downloads', 'downloads', 'Offline content', 'Download', 'Learning', 23, 0, NOW()),
(@template_id, 'Continue Learning', 'continue_learning', 'Resume where you left off', 'Play', 'Learning', 24, 0, NOW()),
(@template_id, 'Learning Path', 'learning_path', 'Structured learning journey', 'GitBranch', 'Learning', 25, 0, NOW());

-- ASSESSMENTS (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Quiz', 'quiz', 'Take quiz', 'HelpCircle', 'Assessments', 26, 0, NOW()),
(@template_id, 'Quiz Results', 'quiz_results', 'View quiz score', 'CheckCircle', 'Assessments', 27, 0, NOW()),
(@template_id, 'Assignments', 'assignments', 'Course assignments', 'FileText', 'Assessments', 28, 0, NOW()),
(@template_id, 'Submit Assignment', 'submit_assignment', 'Upload assignment', 'Upload', 'Assessments', 29, 0, NOW()),
(@template_id, 'Practice Tests', 'practice_tests', 'Practice exams', 'Edit', 'Assessments', 30, 0, NOW()),
(@template_id, 'Final Exam', 'final_exam', 'Course final exam', 'Award', 'Assessments', 31, 0, NOW());

-- PROGRESS & ACHIEVEMENTS (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Progress Dashboard', 'progress_dashboard', 'Learning progress overview', 'TrendingUp', 'Progress', 32, 0, NOW()),
(@template_id, 'Course Progress', 'course_progress', 'Individual course progress', 'Activity', 'Progress', 33, 0, NOW()),
(@template_id, 'Certificates', 'certificates', 'Earned certificates', 'Award', 'Progress', 34, 0, NOW()),
(@template_id, 'Achievements', 'achievements', 'Badges and milestones', 'Trophy', 'Progress', 35, 0, NOW()),
(@template_id, 'Leaderboard', 'leaderboard', 'Student rankings', 'TrendingUp', 'Progress', 36, 0, NOW());

-- LIVE CLASSES (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Live Classes', 'live_classes', 'Scheduled live sessions', 'Video', 'Live', 37, 0, NOW()),
(@template_id, 'Join Live Class', 'join_live_class', 'Enter live session', 'Video', 'Live', 38, 0, NOW()),
(@template_id, 'Class Schedule', 'class_schedule', 'Upcoming live classes', 'Calendar', 'Live', 39, 0, NOW()),
(@template_id, 'Recorded Sessions', 'recorded_sessions', 'Past live class recordings', 'Video', 'Live', 40, 0, NOW());

-- COMMUNITY (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Discussion Forum', 'discussion_forum', 'Course discussions', 'MessageCircle', 'Community', 41, 0, NOW()),
(@template_id, 'Q&A', 'qa', 'Ask questions', 'HelpCircle', 'Community', 42, 0, NOW()),
(@template_id, 'Study Groups', 'study_groups', 'Join study groups', 'Users', 'Community', 43, 0, NOW()),
(@template_id, 'Messages', 'messages', 'Chat with students and instructors', 'Mail', 'Community', 44, 0, NOW()),
(@template_id, 'Announcements', 'announcements', 'Course updates', 'Bell', 'Community', 45, 0, NOW());

-- ENROLLMENT & PAYMENT (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Enroll Course', 'enroll_course', 'Course enrollment', 'ShoppingCart', 'Enrollment', 46, 0, NOW()),
(@template_id, 'Payment', 'payment', 'Course payment', 'CreditCard', 'Enrollment', 47, 0, NOW()),
(@template_id, 'Purchase History', 'purchase_history', 'Past purchases', 'Receipt', 'Enrollment', 48, 0, NOW()),
(@template_id, 'Wishlist', 'wishlist', 'Saved courses', 'Heart', 'Enrollment', 49, 0, NOW());

-- PROFILE & SETTINGS (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 50, 0, NOW()),
(@template_id, 'Edit Profile', 'edit_profile', 'Update profile', 'Edit', 'Profile', 51, 0, NOW()),
(@template_id, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 52, 0, NOW()),
(@template_id, 'Notifications Settings', 'notifications_settings', 'Notification preferences', 'Bell', 'Settings', 53, 0, NOW());

-- NOTIFICATIONS (1 screen)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 54, 0, NOW());

-- SUPPORT & INFORMATION (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 55, 0, NOW()),
(@template_id, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 56, 0, NOW()),
(@template_id, 'About Us', 'about_us', 'Platform information', 'Info', 'Information', 57, 0, NOW()),
(@template_id, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 58, 0, NOW()),
(@template_id, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 59, 0, NOW());

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

SELECT 'Education & Learning Platform Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
