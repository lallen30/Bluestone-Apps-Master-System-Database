const db = require('../config/database');

// Get all screen elements
exports.getAllElements = async (req, res) => {
  try {
    const elements = await db.query(
      `SELECT * FROM screen_elements 
       WHERE is_active = 1 
       ORDER BY category, display_order`
    );
    
    res.json({
      success: true,
      data: elements
    });
  } catch (error) {
    console.error('Error fetching screen elements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen elements'
    });
  }
};

// Get elements by category
exports.getElementsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const elements = await db.query(
      `SELECT * FROM screen_elements 
       WHERE category = ? AND is_active = 1 
       ORDER BY display_order`,
      [category]
    );
    
    res.json({
      success: true,
      data: elements
    });
  } catch (error) {
    console.error('Error fetching elements by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching elements'
    });
  }
};

// Get element by ID
exports.getElementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const elements = await db.query(
      'SELECT * FROM screen_elements WHERE id = ?',
      [id]
    );
    
    if (elements.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Element not found'
      });
    }
    
    res.json({
      success: true,
      data: elements[0]
    });
  } catch (error) {
    console.error('Error fetching element:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching element'
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await db.query(
      `SELECT DISTINCT category 
       FROM screen_elements 
       WHERE is_active = 1 
       ORDER BY category`
    );
    
    res.json({
      success: true,
      data: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};
