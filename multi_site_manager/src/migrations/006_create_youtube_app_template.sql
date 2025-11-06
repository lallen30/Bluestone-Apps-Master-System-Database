-- YouTube-Style Video Platform App Template Migration
-- Creates a comprehensive video streaming/content platform template with 6 screens

-- Insert YouTube-Style Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at)
VALUES (
  'Video Streaming Platform',
  'Complete video streaming and content platform similar to YouTube with video feed, player, channels, comments, subscriptions, and upload functionality',
  'Media & Entertainment',
  'Video',
  1,
  NOW()
);

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- SCREEN 1: Video Feed
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Video Feed',
  'video_feed',
  'Main feed showing recommended and trending videos',
  'PlayCircle',
  'Content',
  1,
  1,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Video Feed Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'feed_title', 'Page Title', '', 'Home', 0, 1, 1, '{}', NOW()),
  (@screen_id, 1, 'search_videos', 'Search', 'Search videos...', '', 0, 0, 2, '{}', NOW()),
  
  -- Filter Tabs
  (@screen_id, 27, 'filters_heading', 'Filters', '', 'Browse', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'video_category', 'Category', 'All', '', 0, 0, 4, '{"options": [{"label": "All", "value": "all"}, {"label": "Trending", "value": "trending"}, {"label": "Music", "value": "music"}, {"label": "Gaming", "value": "gaming"}, {"label": "News", "value": "news"}, {"label": "Sports", "value": "sports"}, {"label": "Education", "value": "education"}, {"label": "Entertainment", "value": "entertainment"}]}', NOW()),
  
  -- Video Grid
  (@screen_id, 27, 'videos_heading', 'Videos', '', 'Recommended Videos', 0, 1, 5, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'videos_grid', 'Video Grid', '', 'Videos will appear here in a grid layout.', 0, 1, 6, '{"type": "grid"}', NOW()),
  
  -- Quick Actions
  (@screen_id, 33, 'upload_video_button', 'Upload Video', '', 'Upload', 0, 0, 7, '{"variant": "primary", "action": "navigate", "target": "/upload"}', NOW()),
  (@screen_id, 33, 'subscriptions_button', 'Subscriptions', '', 'Subscriptions', 0, 0, 8, '{"variant": "secondary", "action": "navigate", "target": "/subscriptions"}', NOW());

-- ============================================
-- SCREEN 2: Video Player
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Video Player',
  'video_player',
  'Full video player with controls, description, and engagement options',
  'Play',
  'Content',
  2,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Video Player Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Video Player
  (@screen_id, 27, 'video_title', 'Video Title', '', 'Amazing Video Title Here', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'video_player_area', 'Video Player', '', 'Video player will be embedded here.', 0, 1, 2, '{"type": "video"}', NOW()),
  
  -- Video Info
  (@screen_id, 28, 'video_views', 'Views', '', '1.2M views', 0, 1, 3, '{}', NOW()),
  (@screen_id, 28, 'video_date', 'Upload Date', '', 'Published 2 days ago', 0, 1, 4, '{}', NOW()),
  
  -- Engagement Buttons
  (@screen_id, 27, 'engagement_heading', 'Engagement', '', 'Actions', 0, 1, 5, '{"level": "h3"}', NOW()),
  (@screen_id, 33, 'like_button', 'Like', '', '👍 125K', 0, 0, 6, '{"variant": "secondary", "action": "like"}', NOW()),
  (@screen_id, 33, 'dislike_button', 'Dislike', '', '👎 Dislike', 0, 0, 7, '{"variant": "secondary", "action": "dislike"}', NOW()),
  (@screen_id, 33, 'share_button', 'Share', '', '🔗 Share', 0, 0, 8, '{"variant": "secondary", "action": "share"}', NOW()),
  (@screen_id, 33, 'save_button', 'Save', '', '💾 Save', 0, 0, 9, '{"variant": "secondary", "action": "save"}', NOW()),
  
  -- Channel Info
  (@screen_id, 27, 'channel_heading', 'Channel', '', 'Channel Info', 0, 1, 10, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'channel_name', 'Channel Name', '', 'Tech Reviews Channel', 0, 1, 11, '{}', NOW()),
  (@screen_id, 28, 'channel_subscribers', 'Subscribers', '', '2.5M subscribers', 0, 1, 12, '{}', NOW()),
  (@screen_id, 33, 'subscribe_button', 'Subscribe', '', 'Subscribe', 0, 0, 13, '{"variant": "primary", "action": "subscribe"}', NOW()),
  
  -- Description
  (@screen_id, 27, 'description_heading', 'Description', '', 'About', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'video_description', 'Description', '', 'This is the video description with details about the content, links, and timestamps.', 0, 1, 15, '{}', NOW()),
  
  -- Comments Section
  (@screen_id, 27, 'comments_heading', 'Comments', '', 'Comments', 0, 1, 16, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'comments_count', 'Comment Count', '', '1,234 Comments', 0, 1, 17, '{}', NOW()),
  (@screen_id, 33, 'view_comments_button', 'View Comments', '', 'View All Comments', 0, 0, 18, '{"variant": "secondary", "action": "navigate", "target": "/comments"}', NOW()),
  
  -- Related Videos
  (@screen_id, 27, 'related_heading', 'Related Videos', '', 'Up Next', 0, 1, 19, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'related_videos', 'Related Videos', '', 'Related videos will appear here.', 0, 1, 20, '{"type": "list"}', NOW());

-- ============================================
-- SCREEN 3: Channel Page
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Channel Page',
  'channel_page',
  'Channel profile with videos, playlists, and about information',
  'Tv',
  'Profile',
  3,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Channel Page Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Channel Header
  (@screen_id, 27, 'channel_title', 'Channel Name', '', 'Tech Reviews Channel', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'channel_handle', 'Channel Handle', '', '@techreviews', 0, 1, 2, '{}', NOW()),
  (@screen_id, 28, 'subscriber_count', 'Subscribers', '', '2.5M subscribers', 0, 1, 3, '{}', NOW()),
  (@screen_id, 28, 'video_count', 'Videos', '', '456 videos', 0, 1, 4, '{}', NOW()),
  (@screen_id, 33, 'channel_subscribe_button', 'Subscribe', '', 'Subscribe', 0, 0, 5, '{"variant": "primary", "action": "subscribe"}', NOW()),
  
  -- Channel Tabs
  (@screen_id, 27, 'tabs_heading', 'Navigation', '', 'Channel Sections', 0, 1, 6, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'channel_tab', 'Tab', 'Select tab', 'videos', 0, 0, 7, '{"options": [{"label": "Videos", "value": "videos"}, {"label": "Playlists", "value": "playlists"}, {"label": "Community", "value": "community"}, {"label": "About", "value": "about"}]}', NOW()),
  
  -- Videos Tab
  (@screen_id, 27, 'channel_videos_heading', 'Videos', '', 'Channel Videos', 0, 1, 8, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'videos_sort', 'Sort By', 'Sort', 'latest', 0, 0, 9, '{"options": [{"label": "Latest", "value": "latest"}, {"label": "Popular", "value": "popular"}, {"label": "Oldest", "value": "oldest"}]}', NOW()),
  (@screen_id, 28, 'channel_videos_grid', 'Videos', '', 'Channel videos will appear here.', 0, 1, 10, '{"type": "grid"}', NOW()),
  
  -- About Tab
  (@screen_id, 27, 'about_heading', 'About', '', 'About This Channel', 0, 1, 11, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'channel_description', 'Description', '', 'Welcome to our channel! We create amazing tech reviews and tutorials.', 0, 1, 12, '{}', NOW()),
  (@screen_id, 28, 'channel_stats', 'Stats', '', 'Joined: Jan 2020 • Total views: 150M', 0, 1, 13, '{}', NOW()),
  (@screen_id, 28, 'channel_links', 'Links', '', 'Website, Social Media Links', 0, 1, 14, '{}', NOW());

-- ============================================
-- SCREEN 4: Comments
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Comments',
  'comments',
  'View and post comments on videos',
  'MessageSquare',
  'Engagement',
  4,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Comments Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'comments_title', 'Page Title', '', 'Comments', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'total_comments', 'Comment Count', '', '1,234 Comments', 0, 1, 2, '{}', NOW()),
  
  -- Sort Options
  (@screen_id, 10, 'comments_sort', 'Sort By', 'Sort comments', 'top', 0, 0, 3, '{"options": [{"label": "Top Comments", "value": "top"}, {"label": "Newest First", "value": "newest"}, {"label": "Oldest First", "value": "oldest"}]}', NOW()),
  
  -- Add Comment
  (@screen_id, 27, 'add_comment_heading', 'Add Comment', '', 'Add a Comment', 0, 1, 4, '{"level": "h3"}', NOW()),
  (@screen_id, 2, 'new_comment', 'Your Comment', 'Add a public comment...', '', 0, 0, 5, '{}', NOW()),
  (@screen_id, 33, 'post_comment_button', 'Post Comment', '', 'Comment', 0, 0, 6, '{"variant": "primary", "action": "submit"}', NOW()),
  (@screen_id, 33, 'cancel_comment_button', 'Cancel', '', 'Cancel', 0, 0, 7, '{"variant": "secondary", "action": "cancel"}', NOW()),
  
  -- Comments List
  (@screen_id, 27, 'comments_list_heading', 'All Comments', '', 'Comments', 0, 1, 8, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'comments_list', 'Comments', '', 'Comments will appear here with user info, timestamp, likes, and replies.', 0, 1, 9, '{"type": "list"}', NOW()),
  
  -- Comment Actions
  (@screen_id, 27, 'comment_actions_heading', 'Actions', '', 'Comment Actions', 0, 1, 10, '{"level": "h3"}', NOW()),
  (@screen_id, 33, 'like_comment_button', 'Like Comment', '', '👍 Like', 0, 0, 11, '{"variant": "secondary"}', NOW()),
  (@screen_id, 33, 'reply_button', 'Reply', '', '💬 Reply', 0, 0, 12, '{"variant": "secondary"}', NOW()),
  (@screen_id, 33, 'report_comment_button', 'Report', '', '⚠️ Report', 0, 0, 13, '{"variant": "secondary"}', NOW());

-- ============================================
-- SCREEN 5: Subscriptions
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Subscriptions',
  'subscriptions',
  'View videos from subscribed channels',
  'Bell',
  'Content',
  5,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Subscriptions Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'subscriptions_title', 'Page Title', '', 'Subscriptions', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'subscriptions_subtitle', 'Subtitle', '', 'Latest from your subscriptions', 0, 1, 2, '{}', NOW()),
  
  -- Filter Options
  (@screen_id, 10, 'subscription_filter', 'Filter', 'All channels', 'all', 0, 0, 3, '{"options": [{"label": "All", "value": "all"}, {"label": "Today", "value": "today"}, {"label": "This Week", "value": "week"}, {"label": "This Month", "value": "month"}]}', NOW()),
  
  -- Subscribed Channels
  (@screen_id, 27, 'channels_heading', 'Channels', '', 'Your Channels', 0, 1, 4, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'subscribed_channels', 'Channels List', '', 'Your subscribed channels will appear here.', 0, 1, 5, '{"type": "horizontal-list"}', NOW()),
  
  -- Latest Videos
  (@screen_id, 27, 'latest_videos_heading', 'Latest Videos', '', 'New Videos', 0, 1, 6, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'subscription_videos', 'Videos', '', 'Latest videos from your subscriptions will appear here.', 0, 1, 7, '{"type": "list"}', NOW()),
  
  -- Manage Subscriptions
  (@screen_id, 27, 'manage_heading', 'Manage', '', 'Manage Subscriptions', 0, 1, 8, '{"level": "h3"}', NOW()),
  (@screen_id, 33, 'manage_subscriptions_button', 'Manage', '', 'Manage All Subscriptions', 0, 0, 9, '{"variant": "secondary"}', NOW()),
  (@screen_id, 33, 'notification_settings_button', 'Notifications', '', 'Notification Settings', 0, 0, 10, '{"variant": "secondary"}', NOW());

-- ============================================
-- SCREEN 6: Upload Video
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Upload Video',
  'upload_video',
  'Upload and publish new videos to your channel',
  'Upload',
  'Content',
  6,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Upload Video Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'upload_title', 'Page Title', '', 'Upload Video', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'upload_subtitle', 'Subtitle', '', 'Share your content with the world', 0, 1, 2, '{}', NOW()),
  
  -- Video Upload
  (@screen_id, 27, 'video_file_heading', 'Video File', '', 'Select Video', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'video_upload_area', 'Upload Area', '', 'Drag and drop video file or click to browse', 0, 1, 4, '{"type": "file-upload"}', NOW()),
  (@screen_id, 28, 'upload_progress', 'Upload Progress', '', 'Upload progress: 0%', 0, 1, 5, '{}', NOW()),
  
  -- Video Details
  (@screen_id, 27, 'details_heading', 'Video Details', '', 'Details', 0, 1, 6, '{"level": "h3"}', NOW()),
  (@screen_id, 1, 'upload_video_title', 'Title', 'Enter video title', '', 1, 0, 7, '{}', NOW()),
  (@screen_id, 2, 'upload_description', 'Description', 'Tell viewers about your video', '', 1, 0, 8, '{}', NOW()),
  
  -- Thumbnail
  (@screen_id, 27, 'thumbnail_heading', 'Thumbnail', '', 'Video Thumbnail', 0, 1, 9, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'thumbnail_upload', 'Thumbnail', '', 'Upload custom thumbnail or select from auto-generated options', 0, 1, 10, '{"type": "image-upload"}', NOW()),
  
  -- Category & Tags
  (@screen_id, 27, 'category_heading', 'Category & Tags', '', 'Categorization', 0, 1, 11, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'upload_category', 'Category', 'Select category', '', 1, 0, 12, '{"options": [{"label": "Music", "value": "music"}, {"label": "Gaming", "value": "gaming"}, {"label": "Education", "value": "education"}, {"label": "Entertainment", "value": "entertainment"}, {"label": "News", "value": "news"}, {"label": "Sports", "value": "sports"}, {"label": "Technology", "value": "technology"}, {"label": "Vlog", "value": "vlog"}]}', NOW()),
  (@screen_id, 1, 'video_tags', 'Tags', 'Add tags (comma separated)', '', 0, 0, 13, '{}', NOW()),
  
  -- Visibility
  (@screen_id, 27, 'visibility_heading', 'Visibility', '', 'Who Can Watch', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 12, 'visibility_options', 'Visibility', '', 'public', 1, 0, 15, '{"options": [{"label": "Public", "value": "public"}, {"label": "Unlisted", "value": "unlisted"}, {"label": "Private", "value": "private"}]}', NOW()),
  
  -- Advanced Settings
  (@screen_id, 27, 'advanced_heading', 'Advanced Settings', '', 'Additional Options', 0, 1, 16, '{"level": "h3"}', NOW()),
  (@screen_id, 11, 'allow_comments', 'Allow Comments', '', '1', 0, 0, 17, '{}', NOW()),
  (@screen_id, 11, 'age_restriction', 'Age Restriction (18+)', '', '0', 0, 0, 18, '{}', NOW()),
  (@screen_id, 11, 'monetization', 'Enable Monetization', '', '0', 0, 0, 19, '{}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'publish_button', 'Publish', '', 'Publish Video', 0, 0, 20, '{"variant": "primary", "action": "submit"}', NOW()),
  (@screen_id, 33, 'save_draft_button', 'Save Draft', '', 'Save as Draft', 0, 0, 21, '{"variant": "secondary"}', NOW()),
  (@screen_id, 33, 'cancel_upload_button', 'Cancel', '', 'Cancel', 0, 0, 22, '{"variant": "secondary", "action": "cancel"}', NOW());

-- Success message
SELECT CONCAT('✅ Video Streaming Platform template created successfully! Template ID: ', @template_id) AS Result;
SELECT 'Created 6 screens: Video Feed, Video Player, Channel Page, Comments, Subscriptions, Upload Video' AS Screens;
