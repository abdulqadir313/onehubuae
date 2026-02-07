const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT category_id, category_name, category_slug, category_image
       FROM categories
       WHERE is_active = 1
       ORDER BY category_name ASC`
    );

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};
