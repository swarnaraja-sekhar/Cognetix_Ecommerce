import Wishlist from "../models/Wishlist.js";

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [itemId],
      });
    } else {
      if (!wishlist.items.includes(itemId)) {
        wishlist.items.push(itemId);
      }
    }

    await wishlist.save();
    res
      .status(200)
      .json({ message: "Item added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (id) => id.toString() !== itemId
    );

    await wishlist.save();
    res
      .status(200)
      .json({ message: "Item removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId }).populate(
      "items"
    );

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if item is in wishlist
export const isInWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });

    const isPresent = wishlist ? wishlist.items.includes(itemId) : false;

    res.status(200).json({ isPresent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
