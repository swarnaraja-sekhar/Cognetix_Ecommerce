/**
 * API Key Service
 */

import api from './api';

const apiKeyAPI = {
  // Generate new API key
  generateAPIKey: (name, permissions = []) =>
    api.post('/api-keys/generate', { name, permissions }),

  // Get all API keys
  getAPIKeys: () =>
    api.get('/api-keys'),

  // Get API key by ID
  getAPIKeyById: (keyId) =>
    api.get(`/api-keys/${keyId}`),

  // Update API key
  updateAPIKey: (keyId, updates) =>
    api.put(`/api-keys/${keyId}`, updates),

  // Delete API key
  deleteAPIKey: (keyId) =>
    api.delete(`/api-keys/${keyId}`),

  // Get API key statistics
  getAPIKeyStats: (keyId) =>
    api.get(`/api-keys/${keyId}/stats`),

  // Update rate limit
  updateRateLimit: (keyId, requestsPerMinute, requestsPerDay) =>
    api.put(`/api-keys/${keyId}/rate-limit`, { requestsPerMinute, requestsPerDay }),

  // Rotate API key
  rotateAPIKey: (keyId) =>
    api.post(`/api-keys/${keyId}/rotate`),

  // Get all permissions
  getPermissions: () =>
    Promise.resolve([
      'read:products',
      'read:orders',
      'write:products',
      'write:orders',
      'read:analytics',
      'read:payments',
      'write:payments',
      'read:shipping',
      'write:shipping',
      'read:notifications',
      'write:notifications',
      'read:webhooks',
      'write:webhooks',
      'admin:access'
    ]),

  // Test API key
  testAPIKey: (apiKey) =>
    api.post('/api-keys/test', { apiKey })
};

export default apiKeyAPI;
