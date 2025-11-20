/**
 * Migration Script: Auto-Configure Existing Apps
 * Date: November 18, 2025
 * 
 * Purpose: Migrate existing apps to use the new smart auto-configuration system
 * - Updates all screens with sidebar menus to show header bar icons
 * - Assigns footer bars to screens with tab bar menus
 * - Converts "Header Bar with Sidebar Icons" assignments to "Simple Header Bar"
 * 
 * Usage: node multi_site_manager/src/scripts/migrate-existing-apps-auto-config.js
 */

const db = require('../config/database');

async function migrateExistingApps() {
  console.log('🚀 Starting migration: Auto-Configure Existing Apps');
  console.log('='.repeat(80));

  try {
    // ============================================================================
    // STEP 1: Get all screens with menu assignments
    // ============================================================================
    console.log('\n📋 Step 1: Finding screens with menu assignments...');
    
    const screensQuery = `
      SELECT DISTINCT 
        sma.screen_id,
        s.name as screen_name
      FROM screen_menu_assignments sma
      JOIN app_screens s ON sma.screen_id = s.id
      ORDER BY s.name
    `;
    
    const screensResult = await db.query(screensQuery);
    const screens = Array.isArray(screensResult) && Array.isArray(screensResult[0]) 
      ? screensResult[0] 
      : screensResult;

    console.log(`✅ Found ${screens.length} screens with menu assignments`);

    // ============================================================================
    // STEP 2: Process each screen
    // ============================================================================
    let updatedCount = 0;
    let headerIconsConfigured = 0;
    let footerBarsAssigned = 0;
    let errors = 0;

    for (const screen of screens) {
      try {
        console.log(`\n📱 Processing: ${screen.screen_name} (ID: ${screen.screen_id})`);

        // Get menus assigned to this screen
        const menusQuery = `
          SELECT m.id, m.menu_type
          FROM screen_menu_assignments sma
          JOIN app_menus m ON sma.menu_id = m.id
          WHERE sma.screen_id = ? AND m.is_active = 1
        `;
        
        const menusResult = await db.query(menusQuery, [screen.screen_id]);
        const menus = Array.isArray(menusResult) && Array.isArray(menusResult[0]) 
          ? menusResult[0] 
          : menusResult;

        const hasLeftSidebar = menus.some(m => m.menu_type === 'sidebar_left');
        const hasRightSidebar = menus.some(m => m.menu_type === 'sidebar_right');
        const hasTabBar = menus.some(m => m.menu_type === 'tabbar');

        console.log(`   Menus: Left=${hasLeftSidebar}, Right=${hasRightSidebar}, Tab=${hasTabBar}`);

        // ========================================================================
        // AUTO-CONFIGURE HEADER BAR
        // ========================================================================
        if (hasLeftSidebar || hasRightSidebar) {
          const headerQuery = `
            SELECT sma.id as assignment_id, sma.module_id, sma.config
            FROM screen_module_assignments sma
            JOIN app_modules m ON sma.module_id = m.id
            WHERE sma.screen_id = ? AND m.module_type = 'header_bar' AND m.is_active = 1
          `;
          
          const headerResult = await db.query(headerQuery, [screen.screen_id]);
          const headerModules = Array.isArray(headerResult) && Array.isArray(headerResult[0]) 
            ? headerResult[0] 
            : headerResult;

          if (headerModules && headerModules.length > 0) {
            // Update existing header bar config
            const headerModule = headerModules[0];
            const currentConfig = typeof headerModule.config === 'string' 
              ? JSON.parse(headerModule.config) 
              : headerModule.config || {};
            
            const updatedConfig = {
              ...currentConfig,
              showLeftIcon: hasLeftSidebar || currentConfig.leftIconType === 'back',
              showRightIcon: hasRightSidebar
            };

            await db.query(
              'UPDATE screen_module_assignments SET config = ? WHERE id = ?',
              [JSON.stringify(updatedConfig), headerModule.assignment_id]
            );

            console.log(`   ✅ Updated header bar icons: left=${updatedConfig.showLeftIcon}, right=${updatedConfig.showRightIcon}`);
            headerIconsConfigured++;
          } else {
            // Assign Simple Header Bar
            const defaultConfig = {
              showTitle: true,
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
              showLeftIcon: hasLeftSidebar,
              showRightIcon: hasRightSidebar,
              elevation: 2
            };

            await db.query(
              'INSERT INTO screen_module_assignments (screen_id, module_id, config) VALUES (?, ?, ?)',
              [screen.screen_id, 2, JSON.stringify(defaultConfig)]
            );

            console.log(`   ✅ Assigned Simple Header Bar with sidebar icons`);
            headerIconsConfigured++;
          }
        }

        // ========================================================================
        // AUTO-CONFIGURE FOOTER BAR
        // ========================================================================
        if (hasTabBar) {
          const footerQuery = `
            SELECT sma.id
            FROM screen_module_assignments sma
            JOIN app_modules m ON sma.module_id = m.id
            WHERE sma.screen_id = ? AND m.module_type = 'footer_bar' AND m.is_active = 1
          `;
          
          const footerResult = await db.query(footerQuery, [screen.screen_id]);
          const footerModules = Array.isArray(footerResult) && Array.isArray(footerResult[0]) 
            ? footerResult[0] 
            : footerResult;

          if (!footerModules || footerModules.length === 0) {
            // Assign Simple Footer Bar (id=4)
            await db.query(
              'INSERT INTO screen_module_assignments (screen_id, module_id, config) VALUES (?, ?, ?)',
              [screen.screen_id, 4, JSON.stringify({})]
            );

            console.log(`   ✅ Assigned Simple Footer Bar for tab bar`);
            footerBarsAssigned++;
          } else {
            console.log(`   ℹ️  Footer bar already exists`);
          }
        }

        updatedCount++;
      } catch (err) {
        console.error(`   ❌ Error processing screen ${screen.screen_id}:`, err.message);
        errors++;
      }
    }

    // ============================================================================
    // SUMMARY
    // ============================================================================
    console.log('\n' + '='.repeat(80));
    console.log('✅ Migration Complete!');
    console.log('='.repeat(80));
    console.log(`📊 Statistics:`);
    console.log(`   - Screens processed: ${updatedCount}/${screens.length}`);
    console.log(`   - Header icons configured: ${headerIconsConfigured}`);
    console.log(`   - Footer bars assigned: ${footerBarsAssigned}`);
    console.log(`   - Errors: ${errors}`);
    console.log('='.repeat(80));

    if (errors === 0) {
      console.log('\n🎉 Migration completed successfully! All screens are now auto-configured.');
    } else {
      console.log(`\n⚠️  Migration completed with ${errors} errors. Please review the logs above.`);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// ============================================================================
// RUN MIGRATION
// ============================================================================
if (require.main === module) {
  migrateExistingApps()
    .then(() => {
      console.log('\n👋 Migration script finished. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { migrateExistingApps };
