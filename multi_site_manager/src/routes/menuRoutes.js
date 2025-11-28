const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Menu management routes
router.get('/app/:appId/menus', menuController.getAppMenus);
router.get('/menus/:menuId', menuController.getMenu);
router.post('/app/:appId/menus', menuController.createMenu);
router.put('/menus/:menuId', menuController.updateMenu);
router.delete('/menus/:menuId', menuController.deleteMenu);

// Menu item routes
router.post('/menus/:menuId/items', menuController.addMenuItem);
router.put('/menu-items/:itemId', menuController.updateMenuItem);
router.delete('/menu-items/:itemId', menuController.removeMenuItem);

// Screen-menu assignment routes
router.get('/screens/:screenId/menus', menuController.getScreenMenus);
router.put('/screens/:screenId/menus', menuController.assignMenusToScreen);

// Menu role access routes
router.get('/app/:appId/menus-with-roles', menuController.getAppMenusWithRoles);
router.get('/menus/:menuId/roles', menuController.getMenuRoleAccess);
router.put('/menus/:menuId/roles', menuController.updateMenuRoleAccess);
router.get('/app/:appId/roles/:roleId/menus', menuController.getMenusByRole);

// Menu duplication
router.post('/menus/:menuId/duplicate', menuController.duplicateMenu);

module.exports = router;
