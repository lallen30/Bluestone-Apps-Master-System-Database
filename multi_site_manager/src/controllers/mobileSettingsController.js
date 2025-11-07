const db = require('../config/database');

/**
 * Mobile Settings Controller
 * Handles user settings, preferences, notifications, and privacy settings
 */

// Get user settings
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [settings] = await db.query(
      `SELECT 
        notifications_enabled,
        email_notifications,
        push_notifications,
        sms_notifications,
        language,
        theme,
        timezone,
        privacy_settings,
        custom_settings,
        updated_at
      FROM user_settings 
      WHERE user_id = ?`,
      [userId]
    );

    if (!settings || settings.length === 0) {
      // Create default settings if they don't exist
      await db.query(
        `INSERT INTO user_settings (user_id) VALUES (?)`,
        [userId]
      );

      const [newSettings] = await db.query(
        `SELECT 
          notifications_enabled,
          email_notifications,
          push_notifications,
          sms_notifications,
          language,
          theme,
          timezone,
          privacy_settings,
          custom_settings,
          updated_at
        FROM user_settings 
        WHERE user_id = ?`,
        [userId]
      );

      return res.json({
        success: true,
        settings: newSettings[0]
      });
    }

    res.json({
      success: true,
      settings: settings[0]
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve settings'
    });
  }
};

// Update general settings
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      language,
      theme,
      timezone
    } = req.body;

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (language !== undefined) {
      updates.push('language = ?');
      values.push(language);
    }
    if (theme !== undefined) {
      updates.push('theme = ?');
      values.push(theme);
    }
    if (timezone !== undefined) {
      updates.push('timezone = ?');
      values.push(timezone);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No settings provided to update'
      });
    }

    values.push(userId);

    await db.query(
      `UPDATE user_settings 
       SET ${updates.join(', ')} 
       WHERE user_id = ?`,
      values
    );

    // Get updated settings
    const [settings] = await db.query(
      `SELECT 
        notifications_enabled,
        email_notifications,
        push_notifications,
        sms_notifications,
        language,
        theme,
        timezone,
        privacy_settings,
        custom_settings,
        updated_at
      FROM user_settings 
      WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settings[0]
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// Get notification preferences
const getNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const [settings] = await db.query(
      `SELECT 
        notifications_enabled,
        email_notifications,
        push_notifications,
        sms_notifications
      FROM user_settings 
      WHERE user_id = ?`,
      [userId]
    );

    if (!settings || settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    res.json({
      success: true,
      notifications: settings[0]
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notification preferences'
    });
  }
};

// Update notification preferences
const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      notifications_enabled,
      email_notifications,
      push_notifications,
      sms_notifications
    } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (notifications_enabled !== undefined) {
      updates.push('notifications_enabled = ?');
      values.push(notifications_enabled ? 1 : 0);
    }
    if (email_notifications !== undefined) {
      updates.push('email_notifications = ?');
      values.push(email_notifications ? 1 : 0);
    }
    if (push_notifications !== undefined) {
      updates.push('push_notifications = ?');
      values.push(push_notifications ? 1 : 0);
    }
    if (sms_notifications !== undefined) {
      updates.push('sms_notifications = ?');
      values.push(sms_notifications ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No notification preferences provided'
      });
    }

    values.push(userId);

    await db.query(
      `UPDATE user_settings 
       SET ${updates.join(', ')} 
       WHERE user_id = ?`,
      values
    );

    // Get updated preferences
    const [settings] = await db.query(
      `SELECT 
        notifications_enabled,
        email_notifications,
        push_notifications,
        sms_notifications
      FROM user_settings 
      WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      notifications: settings[0]
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences'
    });
  }
};

// Get privacy settings
const getPrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT privacy_settings FROM user_settings WHERE user_id = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    // Default privacy settings if none exist
    const privacySettings = rows[0]?.privacy_settings || {
      profile_visibility: 'public', // public, friends, private
      show_email: false,
      show_phone: false,
      show_location: true,
      show_online_status: true,
      allow_friend_requests: true,
      allow_messages: true,
      show_activity: true,
      data_sharing: false,
      personalized_ads: true
    };

    res.json({
      success: true,
      privacy: privacySettings
    });
  } catch (error) {
    console.error('Get privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve privacy settings'
    });
  }
};

// Update privacy settings
const updatePrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const privacyUpdates = req.body;

    // Get current privacy settings
    const [rows] = await db.query(
      `SELECT privacy_settings FROM user_settings WHERE user_id = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    // Merge with existing settings
    const currentPrivacy = rows[0]?.privacy_settings || {};
    const updatedPrivacy = {
      ...currentPrivacy,
      ...privacyUpdates
    };

    await db.query(
      `UPDATE user_settings 
       SET privacy_settings = ? 
       WHERE user_id = ?`,
      [JSON.stringify(updatedPrivacy), userId]
    );

    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      privacy: updatedPrivacy
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update privacy settings'
    });
  }
};

// Get custom settings (app-specific settings)
const getCustomSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT custom_settings FROM user_settings WHERE user_id = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    res.json({
      success: true,
      custom_settings: rows[0]?.custom_settings || {}
    });
  } catch (error) {
    console.error('Get custom settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve custom settings'
    });
  }
};

// Update custom settings
const updateCustomSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const customUpdates = req.body;

    // Get current custom settings
    const [rows] = await db.query(
      `SELECT custom_settings FROM user_settings WHERE user_id = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    // Merge with existing settings
    const currentCustom = rows[0]?.custom_settings || {};
    const updatedCustom = {
      ...currentCustom,
      ...customUpdates
    };

    await db.query(
      `UPDATE user_settings 
       SET custom_settings = ? 
       WHERE user_id = ?`,
      [JSON.stringify(updatedCustom), userId]
    );

    res.json({
      success: true,
      message: 'Custom settings updated successfully',
      custom_settings: updatedCustom
    });
  } catch (error) {
    console.error('Update custom settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update custom settings'
    });
  }
};

// Reset settings to defaults
const resetSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      `UPDATE user_settings 
       SET 
         notifications_enabled = 1,
         email_notifications = 1,
         push_notifications = 1,
         sms_notifications = 0,
         language = 'en',
         theme = 'auto',
         timezone = 'UTC',
         privacy_settings = NULL,
         custom_settings = NULL
       WHERE user_id = ?`,
      [userId]
    );

    // Get reset settings
    const [settings] = await db.query(
      `SELECT 
        notifications_enabled,
        email_notifications,
        push_notifications,
        sms_notifications,
        language,
        theme,
        timezone,
        privacy_settings,
        custom_settings,
        updated_at
      FROM user_settings 
      WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Settings reset to defaults successfully',
      settings: settings[0]
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings'
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getNotificationPreferences,
  updateNotificationPreferences,
  getPrivacySettings,
  updatePrivacySettings,
  getCustomSettings,
  updateCustomSettings,
  resetSettings
};
