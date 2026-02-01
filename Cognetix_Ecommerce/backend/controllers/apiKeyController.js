/**
 * API Key Controller - Manage API keys and access control
 */

import APIKey from '../models/APIKey.js';
import crypto from 'crypto';

// Generate new API key
export const generateAPIKey = async (req, res) => {
  try {
    const { name, permissions = [] } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'API key name is required' });
    }

    // Generate unique key
    const key = 'pk_' + crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');

    const apiKey = new APIKey({
      name,
      key: hashedKey,
      permissions,
      createdBy: req.user?.id,
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerDay: 10000
      }
    });

    await apiKey.save();

    // Return the unhashed key (only shown once)
    res.status(201).json({
      ...apiKey.toObject(),
      key: key // Only time we send unhashed key
    });
  } catch (error) {
    console.error('Failed to generate API key:', error);
    res.status(500).json({ message: 'Failed to generate API key' });
  }
};

// Get all API keys
export const getAPIKeys = async (req, res) => {
  try {
    const keys = await APIKey.find({ createdBy: req.user?.id }).select('-key');
    res.json(keys);
  } catch (error) {
    console.error('Failed to fetch API keys:', error);
    res.status(500).json({ message: 'Failed to fetch API keys' });
  }
};

// Get API key by ID
export const getAPIKeyById = async (req, res) => {
  try {
    const key = await APIKey.findById(req.params.id).select('-key');

    if (!key) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (key.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(key);
  } catch (error) {
    console.error('Failed to fetch API key:', error);
    res.status(500).json({ message: 'Failed to fetch API key' });
  }
};

// Update API key
export const updateAPIKey = async (req, res) => {
  try {
    const { name, permissions, active } = req.body;
    const key = await APIKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (key.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (name) key.name = name;
    if (permissions) key.permissions = permissions;
    if (active !== undefined) key.active = active;

    await key.save();
    res.json(key);
  } catch (error) {
    console.error('Failed to update API key:', error);
    res.status(500).json({ message: 'Failed to update API key' });
  }
};

// Delete API key
export const deleteAPIKey = async (req, res) => {
  try {
    const key = await APIKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (key.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await APIKey.findByIdAndDelete(req.params.id);
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Failed to delete API key:', error);
    res.status(500).json({ message: 'Failed to delete API key' });
  }
};

// Validate API key
export const validateAPIKey = async (apiKey) => {
  try {
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    const key = await APIKey.findOne({ key: hashedKey, active: true });

    if (!key) {
      return null;
    }

    // Check rate limit
    if (key.usageStats.requestsThisMinute >= key.rateLimit.requestsPerMinute) {
      return { error: 'Rate limit exceeded' };
    }

    // Update usage
    key.usageStats.totalRequests += 1;
    key.usageStats.requestsThisMinute += 1;
    key.usageStats.lastUsed = new Date();

    await key.save();

    return key;
  } catch (error) {
    console.error('Failed to validate API key:', error);
    return null;
  }
};

// Get API key usage stats
export const getAPIKeyStats = async (req, res) => {
  try {
    const key = await APIKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (key.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      name: key.name,
      usageStats: key.usageStats,
      rateLimit: key.rateLimit,
      createdAt: key.createdAt,
      lastUsed: key.usageStats.lastUsed
    });
  } catch (error) {
    console.error('Failed to fetch API key stats:', error);
    res.status(500).json({ message: 'Failed to fetch API key stats' });
  }
};

// Update rate limit
export const updateRateLimit = async (req, res) => {
  try {
    const { requestsPerMinute, requestsPerDay } = req.body;
    const key = await APIKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (key.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    key.rateLimit = {
      requestsPerMinute: requestsPerMinute || key.rateLimit.requestsPerMinute,
      requestsPerDay: requestsPerDay || key.rateLimit.requestsPerDay
    };

    await key.save();
    res.json(key);
  } catch (error) {
    console.error('Failed to update rate limit:', error);
    res.status(500).json({ message: 'Failed to update rate limit' });
  }
};

// Rotate API key
export const rotateAPIKey = async (req, res) => {
  try {
    const oldKey = await APIKey.findById(req.params.id);

    if (!oldKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    if (oldKey.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Generate new key
    const newKey = 'pk_' + crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(newKey).digest('hex');

    oldKey.key = hashedKey;
    oldKey.rotatedAt = new Date();
    oldKey.usageStats.requestsThisMinute = 0;

    await oldKey.save();

    res.json({
      message: 'API key rotated successfully',
      key: newKey,
      rotatedAt: oldKey.rotatedAt
    });
  } catch (error) {
    console.error('Failed to rotate API key:', error);
    res.status(500).json({ message: 'Failed to rotate API key' });
  }
};

export default {
  generateAPIKey,
  getAPIKeys,
  getAPIKeyById,
  updateAPIKey,
  deleteAPIKey,
  validateAPIKey,
  getAPIKeyStats,
  updateRateLimit,
  rotateAPIKey
};
