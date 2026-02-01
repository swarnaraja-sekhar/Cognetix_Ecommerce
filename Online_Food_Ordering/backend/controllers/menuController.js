import MenuItem from "../models/MenuItem.js";

// @route   GET /api/menu
// @desc    Get all food items with optional filters
// @access  Public
export const getAllMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build filter object
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Menu items retrieved successfully",
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/menu/:id
// @desc    Get single food item by ID
// @access  Public
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item retrieved successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/menu
// @desc    Create a new menu item (Admin only)
// @access  Private/Admin
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, availability } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const item = new MenuItem({
      name,
      description,
      price,
      category,
      image: image || "https://via.placeholder.com/300x200?text=Food+Item",
      availability: availability !== undefined ? availability : true,
    });

    await item.save();

    res.status(201).json({
      message: "Menu item created successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/menu/:id
// @desc    Update menu item (Admin only)
// @access  Private/Admin
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update item
    const item = await MenuItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/menu/:id
// @desc    Delete menu item (Admin only)
// @access  Private/Admin
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item deleted successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
