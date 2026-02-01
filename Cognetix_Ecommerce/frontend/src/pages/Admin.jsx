/**
 * Admin Dashboard - Complete E-Commerce Management System
 * Features: Products, Orders, Coupons, Users, Analytics, Inventory, Returns, Loyalty, Campaigns, Support
 */

import { useState, useEffect } from 'react';
import { productsAPI, ordersAPI, couponAPI, authAPI } from '../services/api';
import paymentAPI from '../services/paymentAPI';
import shippingAPI from '../services/shippingAPI';
import notificationAPI from '../services/notificationAPI';
import webhookAPI from '../services/webhookAPI';
import apiKeyAPI from '../services/apiKeyAPI';
import analyticsAPI from '../services/analyticsAPI';
import Loading from '../components/Loading';
import { 
  FiPackage, FiShoppingCart, FiDollarSign, FiUsers, 
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiTag,
  FiTrendingUp, FiBarChart2, FiSettings, FiLogOut, 
  FiSearch, FiFilter, FiDownload, FiEye, FiStar, FiRefreshCw,
  FiAward, FiMail, FiMessageSquare, FiTrendingDown, FiAlertTriangle,
  FiRotateCcw, FiGift, FiTarget, FiHeart, FiClipboard, FiTruck,
  FiBell, FiLink2, FiKey, FiCode
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Admin = () => {
  // ============ STATE MANAGEMENT ============
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [loyaltyProgram, setLoyaltyProgram] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [returns, setReturns] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Form States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editingLoyalty, setEditingLoyalty] = useState(null);

  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Sports', 
    'Books', 'Toys', 'Health & Beauty', 'Automotive', 
    'Food & Beverages', 'Other'
  ];

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
    stock: '',
    brand: '',
    featured: false,
    rating: '0',
    variants: [{ name: 'Size', values: ['S', 'M', 'L', 'XL'] }],
    reorderLevel: '5',
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minAmount: '',
    maxDiscount: '',
    maxUses: '',
    expiryDate: '',
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'email',
    description: '',
    targetAudience: 'all',
    discount: '',
    startDate: '',
    endDate: '',
    active: true,
  });

  const [loyaltyForm, setLoyaltyForm] = useState({
    name: 'Loyalty Program',
    pointsPerPurchase: '10',
    pointsPerReview: '5',
    redeemRate: '100',
    redeemValue: '1',
  });

  const [supportTicketForm, setSupportTicketForm] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });

  const [returnForm, setReturnForm] = useState({
    orderId: '',
    reason: '',
    items: [],
    refundAmount: '',
  });

  // ============ DATA FETCHING ============
  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, couponsRes, usersRes] = await Promise.all([
        productsAPI.getProducts({ limit: 1000 }),
        ordersAPI.getAllOrders({ limit: 1000 }),
        couponAPI.getAllCoupons().catch(() => ({ data: [] })),
        authAPI.getAllUsers().catch(() => ({ data: [] })),
      ]);
      
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setCoupons(couponsRes.data || []);
      setUsers(usersRes.data || []);

      // Calculate inventory alerts
      const alerts = (productsRes.data || []).filter(p => p.stock < (p.reorderLevel || 10));
      setInventoryAlerts(alerts);

      // Mock data for other features
      setLoyaltyProgram(JSON.parse(localStorage.getItem('loyaltyProgram')) || []);
      setSupportTickets(JSON.parse(localStorage.getItem('supportTickets')) || []);
      setCampaigns(JSON.parse(localStorage.getItem('campaigns')) || []);
      setReturns(JSON.parse(localStorage.getItem('returns')) || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ============ PRODUCT OPERATIONS ============
  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        stock: product.stock.toString(),
        brand: product.brand || '',
        featured: product.featured || false,
        rating: (product.rating || 0).toString(),
        variants: product.variants || [],
        reorderLevel: (product.reorderLevel || 5).toString(),
      });
    } else {
      resetProductForm();
    }
    setModalType('product');
    setShowModal(true);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      image: '',
      stock: '',
      brand: '',
      featured: false,
      rating: '0',
      variants: [],
      reorderLevel: '5',
    });
    setEditingProduct(null);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.description) {
      toast.error('Name, price, and description are required');
      return;
    }

    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock) || 0,
        rating: parseFloat(productForm.rating) || 0,
        reorderLevel: parseInt(productForm.reorderLevel) || 5,
      };

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, data);
        toast.success('✅ Product updated successfully');
      } else {
        await productsAPI.createProduct(data);
        toast.success('✅ Product created successfully');
      }

      setShowModal(false);
      resetProductForm();
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    try {
      await productsAPI.deleteProduct(id);
      toast.success('🗑️ Product deleted successfully');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    try {
      const product = products.find(p => p._id === id);
      await productsAPI.updateProduct(id, { ...product, featured: !isFeatured });
      toast.success(isFeatured ? 'Removed from featured' : 'Added to featured');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to toggle featured status');
    }
  };

  // ============ ORDER OPERATIONS ============
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      toast.success(`✅ Order status updated to ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order? Stock will be restored.')) return;

    try {
      await ordersAPI.cancelOrder(orderId);
      toast.success('✅ Order cancelled and stock restored');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  // ============ COUPON OPERATIONS ============
  const openCouponModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponForm({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minAmount: (coupon.minAmount || '').toString(),
        maxDiscount: (coupon.maxDiscount || '').toString(),
        maxUses: (coupon.maxUses || '').toString(),
        expiryDate: coupon.expiryDate?.split('T')[0] || '',
      });
    } else {
      resetCouponForm();
    }
    setModalType('coupon');
    setShowModal(true);
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minAmount: '',
      maxDiscount: '',
      maxUses: '',
      expiryDate: '',
    });
    setEditingCoupon(null);
  };

  const handleCouponFormChange = (e) => {
    const { name, value } = e.target;
    setCouponForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCoupon = async () => {
    if (!couponForm.code || !couponForm.discountValue) {
      toast.error('Code and discount value are required');
      return;
    }

    try {
      const data = {
        ...couponForm,
        discountValue: parseFloat(couponForm.discountValue),
        minAmount: parseFloat(couponForm.minAmount) || 0,
        maxDiscount: couponForm.maxDiscount ? parseFloat(couponForm.maxDiscount) : null,
        maxUses: couponForm.maxUses ? parseInt(couponForm.maxUses) : null,
      };

      if (editingCoupon) {
        await couponAPI.updateCoupon(editingCoupon._id, data);
        toast.success('✅ Coupon updated successfully');
      } else {
        await couponAPI.createCoupon(data);
        toast.success('✅ Coupon created successfully');
      }

      setShowModal(false);
      resetCouponForm();
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;

    try {
      await couponAPI.deleteCoupon(id);
      toast.success('🗑️ Coupon deleted successfully');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  // ============ CAMPAIGN OPERATIONS ============
  const handleSaveCampaign = () => {
    if (!campaignForm.name || !campaignForm.discount) {
      toast.error('Campaign name and discount are required');
      return;
    }

    try {
      let updatedCampaigns;
      if (editingCampaign) {
        updatedCampaigns = campaigns.map(c => c.id === editingCampaign.id ? { ...campaignForm, id: c.id } : c);
        toast.success('✅ Campaign updated successfully');
      } else {
        updatedCampaigns = [...campaigns, { ...campaignForm, id: Date.now() }];
        toast.success('✅ Campaign created successfully');
      }

      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      setCampaigns(updatedCampaigns);
      setShowModal(false);
      resetCampaignForm();
    } catch (error) {
      toast.error('Failed to save campaign');
    }
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      name: '',
      type: 'email',
      description: '',
      targetAudience: 'all',
      discount: '',
      startDate: '',
      endDate: '',
      active: true,
    });
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (id) => {
    if (!window.confirm('Delete this campaign?')) return;

    const updated = campaigns.filter(c => c.id !== id);
    localStorage.setItem('campaigns', JSON.stringify(updated));
    setCampaigns(updated);
    toast.success('🗑️ Campaign deleted successfully');
  };

  // ============ LOYALTY PROGRAM ============
  const handleSaveLoyalty = () => {
    try {
      localStorage.setItem('loyaltySettings', JSON.stringify(loyaltyForm));
      toast.success('✅ Loyalty program updated successfully');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save loyalty program');
    }
  };

  // ============ RETURN MANAGEMENT ============
  const handleProcessReturn = (returnId, status) => {
    const updated = returns.map(r => r.id === returnId ? { ...r, status } : r);
    localStorage.setItem('returns', JSON.stringify(updated));
    setReturns(updated);
    toast.success(`✅ Return status updated to ${status}`);
  };

  // ============ USER ROLE MANAGEMENT ============
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await authAPI.updateUserRole(userId, newRole);
      toast.success(`✅ User role changed to ${newRole}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  // ============ STATISTICS ============
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const activeCoupons = coupons.filter(c => new Date(c.expiryDate) > new Date()).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const totalReturns = returns.filter(r => r.status === 'pending').length;
  const loyaltyMembers = (loyaltyProgram || []).length;
  const activeCampaigns = campaigns.filter(c => c.active).length;
  const openTickets = supportTickets.filter(t => t.status !== 'closed').length;

  // Filtered data
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o._id.includes(searchQuery) || 
                         o.user?.email?.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <FiRefreshCw className="w-5 h-5" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={FiDollarSign}
                title="Total Revenue"
                value={`₹${totalRevenue.toLocaleString('en-IN')}`}
                color="green"
              />
              <StatCard
                icon={FiShoppingCart}
                title="Total Orders"
                value={totalOrders}
                subtitle={`${pendingOrders} pending`}
                color="blue"
              />
              <StatCard
                icon={FiPackage}
                title="Total Products"
                value={totalProducts}
                subtitle={`${lowStockProducts} low stock`}
                color="purple"
              />
              <StatCard
                icon={FiUsers}
                title="Total Users"
                value={totalUsers}
                subtitle={`${adminUsers} admins`}
                color="orange"
              />
              <StatCard
                icon={FiTag}
                title="Active Coupons"
                value={activeCoupons}
                color="pink"
              />
              <StatCard
                icon={FiAward}
                title="Loyalty Members"
                value={loyaltyMembers}
                color="indigo"
              />
              <StatCard
                icon={FiTarget}
                title="Active Campaigns"
                value={activeCampaigns}
                color="cyan"
              />
              <StatCard
                icon={FiRotateCcw}
                title="Pending Returns"
                value={totalReturns}
                color="red"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <button
                  onClick={() => { setActiveTab('products'); openProductModal(); }}
                  className="flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiPlus className="w-5 h-5" /> Add Product
                </button>
                <button
                  onClick={() => { setActiveTab('coupons'); setModalType('coupon'); setShowModal(true); }}
                  className="flex flex-col items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiTag className="w-5 h-5" /> Create Coupon
                </button>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="flex flex-col items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiTarget className="w-5 h-5" /> New Campaign
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className="flex flex-col items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiMessageSquare className="w-5 h-5" /> Support
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="flex flex-col items-center justify-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiDollarSign className="w-5 h-5" /> Payments
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className="flex flex-col items-center justify-center gap-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiTruck className="w-5 h-5" /> Shipping
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="flex flex-col items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiBell className="w-5 h-5" /> Alerts
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="flex flex-col items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-3 rounded-lg transition font-medium text-xs"
                >
                  <FiTrendingUp className="w-5 h-5" /> Analytics
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lowStockProducts > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <FiAlertTriangle /> Low Stock Alert
                  </h3>
                  <p className="text-yellow-800">{lowStockProducts} products below reorder level</p>
                </div>
              )}
              {totalReturns > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <FiRotateCcw /> Return Requests
                  </h3>
                  <p className="text-orange-800">{totalReturns} pending return approvals</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <ProductsTab
            products={filteredProducts}
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onEdit={openProductModal}
            onDelete={handleDeleteProduct}
            onToggleFeatured={handleToggleFeatured}
            onAdd={() => openProductModal()}
            onShowModal={() => setShowModal(true)}
          />
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={filteredOrders}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onUpdateStatus={handleUpdateOrderStatus}
            onCancel={handleCancelOrder}
          />
        )}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && (
          <CouponsTab
            coupons={coupons}
            onEdit={openCouponModal}
            onDelete={handleDeleteCoupon}
            onAdd={() => { resetCouponForm(); setModalType('coupon'); setShowModal(true); }}
            onShowModal={() => setShowModal(true)}
          />
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <UsersTab
            users={users}
            onUpdateRole={handleUpdateUserRole}
          />
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <CampaignsTab
            campaigns={campaigns}
            onEdit={(campaign) => { setEditingCampaign(campaign); setCampaignForm(campaign); setModalType('campaign'); setShowModal(true); }}
            onDelete={handleDeleteCampaign}
            onAdd={() => { resetCampaignForm(); setModalType('campaign'); setShowModal(true); }}
            onShowModal={() => setShowModal(true)}
          />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            orders={orders}
            products={products}
            users={users}
            totalRevenue={totalRevenue}
          />
        )}

        {/* LOYALTY TAB */}
        {activeTab === 'loyalty' && (
          <LoyaltyTab
            loyaltyProgram={loyaltyProgram || []}
            loyaltyForm={loyaltyForm}
            setLoyaltyForm={setLoyaltyForm}
            onSave={() => { setShowModal(true); setModalType('loyalty'); }}
          />
        )}

        {/* RETURNS TAB */}
        {activeTab === 'returns' && (
          <ReturnsTab
            returns={returns}
            onUpdateStatus={handleProcessReturn}
          />
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <InventoryTab
            products={products}
            alerts={inventoryAlerts}
          />
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
          <SupportTab
            tickets={supportTickets}
          />
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <PaymentsTab
            payments={payments}
            orders={orders}
          />
        )}

        {/* SHIPPING TAB */}
        {activeTab === 'shipping' && (
          <ShippingTab
            shipments={shipments}
            orders={orders}
          />
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <NotificationsTab
            notifications={notifications}
            users={users}
          />
        )}

        {/* WEBHOOKS TAB */}
        {activeTab === 'webhooks' && (
          <WebhooksTab
            webhooks={webhooks}
          />
        )}

        {/* API KEYS TAB */}
        {activeTab === 'apikeys' && (
          <APIKeysTab
            apiKeys={apiKeys}
          />
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 py-3">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: FiBarChart2 },
            { id: 'products', label: '📦 Products', icon: FiPackage },
            { id: 'orders', label: '🛒 Orders', icon: FiShoppingCart },
            { id: 'payments', label: '💳 Payments', icon: FiDollarSign },
            { id: 'shipping', label: '🚚 Shipping', icon: FiTruck },
            { id: 'coupons', label: '🏷️ Coupons', icon: FiTag },
            { id: 'campaigns', label: '🎯 Campaigns', icon: FiTarget },
            { id: 'users', label: '👥 Users', icon: FiUsers },
            { id: 'loyalty', label: '🏆 Loyalty', icon: FiAward },
            { id: 'returns', label: '↩️ Returns', icon: FiRotateCcw },
            { id: 'inventory', label: '📊 Inventory', icon: FiTrendingDown },
            { id: 'notifications', label: '🔔 Notifications', icon: FiBell },
            { id: 'webhooks', label: '🔗 Webhooks', icon: FiLink2 },
            { id: 'apikeys', label: '🔑 API Keys', icon: FiKey },
            { id: 'analytics', label: '📈 Analytics', icon: FiTrendingUp },
            { id: 'support', label: '💬 Support', icon: FiMessageSquare },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 whitespace-nowrap rounded-lg transition font-medium text-sm ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add padding for fixed tab bar */}
      <div className="h-20"></div>

      {/* MODALS */}
      {showModal && (
        <Modal
          modalType={modalType}
          productForm={productForm}
          handleProductFormChange={handleProductFormChange}
          handleSaveProduct={handleSaveProduct}
          editingProduct={editingProduct}
          couponForm={couponForm}
          handleCouponFormChange={handleCouponFormChange}
          handleSaveCoupon={handleSaveCoupon}
          editingCoupon={editingCoupon}
          campaignForm={campaignForm}
          handleSaveCampaign={handleSaveCampaign}
          editingCampaign={editingCampaign}
          loyaltyForm={loyaltyForm}
          setLoyaltyForm={setLoyaltyForm}
          handleSaveLoyalty={handleSaveLoyalty}
          categories={categories}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// ============ COMPONENT HELPERS ============

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  const colors = {
    green: 'bg-green-100', blue: 'bg-blue-100', purple: 'bg-purple-100',
    orange: 'bg-orange-100', pink: 'bg-pink-100', red: 'bg-red-100',
    indigo: 'bg-indigo-100', cyan: 'bg-cyan-100'
  };
  const textColors = {
    green: 'text-green-600', blue: 'text-blue-600', purple: 'text-purple-600',
    orange: 'text-orange-600', pink: 'text-pink-600', red: 'text-red-600',
    indigo: 'text-indigo-600', cyan: 'text-cyan-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`${colors[color]} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${textColors[color]}`} />
        </div>
      </div>
    </div>
  );
}

// Product Tab Component
function ProductsTab({ products, categories, searchQuery, setSearchQuery, onEdit, onDelete, onToggleFeatured, onAdd, onShowModal }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Featured</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{product.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onToggleFeatured(product._id, product.featured)}
                      className={`px-3 py-1 rounded-lg transition font-medium ${
                        product.featured
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.featured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">No products found</div>
        )}
      </div>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, filterStatus, setFilterStatus, searchQuery, setSearchQuery, onUpdateStatus, onCancel }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h2>

      <div className="mb-6 flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Paid">Paid</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.user?.email || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{order.total}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                      <button
                        onClick={() => onCancel(order._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
}

// Coupons Tab Component
function CouponsTab({ coupons, onEdit, onDelete, onAdd, onShowModal }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Coupons Management</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiPlus /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map(coupon => {
          const isExpired = new Date(coupon.expiryDate) < new Date();
          return (
            <div key={coupon._id} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{coupon.code}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}% OFF` 
                      : `₹${coupon.discountValue} OFF`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isExpired ? 'Expired' : 'Active'}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4 border-t pt-4">
                <p className="text-gray-600">Min: ₹{coupon.minAmount || 0}</p>
                <p className="text-gray-600">Max: ₹{coupon.maxDiscount || '∞'}</p>
                <p className="text-gray-600">Uses: {coupon.usedCount || 0}/{coupon.maxUses || '∞'}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(coupon)}
                  className="flex-1 text-blue-600 hover:text-blue-800 py-2 font-medium flex items-center justify-center gap-1"
                >
                  <FiEdit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => onDelete(coupon._id)}
                  className="flex-1 text-red-600 hover:text-red-800 py-2 font-medium flex items-center justify-center gap-1"
                >
                  <FiTrash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {coupons.length === 0 && (
        <div className="text-center py-12 text-gray-500">No coupons yet. Create one to get started!</div>
      )}
    </div>
  );
}

// Users Tab Component
function UsersTab({ users, onUpdateRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
    thisMonth: users.filter(u => {
      const joinDate = new Date(u.createdAt);
      const today = new Date();
      return joinDate.getMonth() === today.getMonth() && joinDate.getFullYear() === today.getFullYear();
    }).length,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Users Management</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FiUsers} title="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={FiUser} title="Admin Users" value={stats.adminUsers} color="purple" />
        <StatCard icon={FiUser} title="Regular Users" value={stats.regularUsers} color="green" />
        <StatCard icon={FiUser} title="New This Month" value={stats.thisMonth} color="orange" />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Regular Users</option>
            <option value="admin">Admin Users</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive !== false
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive !== false ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => onUpdateRole(user._id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No users found matching your criteria</div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
        </p>
      </div>
    </div>
  );
}

// Campaigns Tab Component
function CampaignsTab({ campaigns, onEdit, onDelete, onAdd }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiPlus /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{campaign.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                campaign.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {campaign.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4 border-t pt-4">
              <p className="text-gray-600">Discount: {campaign.discount}%</p>
              <p className="text-gray-600">Target: {campaign.targetAudience}</p>
              <p className="text-gray-600">Duration: {campaign.startDate} to {campaign.endDate}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(campaign)}
                className="flex-1 text-blue-600 hover:text-blue-800 py-2 font-medium flex items-center justify-center gap-1"
              >
                <FiEdit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => onDelete(campaign.id)}
                className="flex-1 text-red-600 hover:text-red-800 py-2 font-medium flex items-center justify-center gap-1"
              >
                <FiTrash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {campaigns.length === 0 && (
        <div className="text-center py-12 text-gray-500">No campaigns yet. Create one to boost sales!</div>
      )}
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ orders, products, users, totalRevenue }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-bold">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Orders</span>
              <span className="font-bold">{orders.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Order Value</span>
              <span className="font-bold">₹{(totalRevenue / (orders.length || 1)).toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-2">
            {products.slice(0, 3).map((p, i) => (
              <div key={p._id} className="flex justify-between text-sm">
                <span className="text-gray-600">{i + 1}. {p.name.substring(0, 20)}</span>
                <span className="font-bold">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loyalty Tab Component
function LoyaltyTab({ loyaltyProgram, loyaltyForm, setLoyaltyForm, onSave }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Loyalty Program</h2>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiSettings /> Configure
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Members</h3>
          <p className="text-3xl font-bold text-primary-600">{loyaltyProgram.length}</p>
          <p className="text-sm text-gray-500 mt-1">Active loyalty members</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Points System</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">Points per purchase: {loyaltyForm.pointsPerPurchase}</p>
            <p className="text-gray-600">Points per review: {loyaltyForm.pointsPerReview}</p>
            <p className="text-gray-600">Redeem rate: {loyaltyForm.redeemRate} points = ₹{loyaltyForm.redeemValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Returns Tab Component
function ReturnsTab({ returns, onUpdateStatus }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Requests</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Refund Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {returns.map(ret => (
                <tr key={ret.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">#{ret.orderId?.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ret.reason}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{ret.refundAmount}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={ret.status}
                      onChange={(e) => onUpdateStatus(ret.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        ret.status === 'approved' ? 'bg-green-100 text-green-700' :
                        ret.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {ret.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => onUpdateStatus(ret.id, 'approved')} className="text-green-600 hover:text-green-800">Approve</button>
                        <button onClick={() => onUpdateStatus(ret.id, 'rejected')} className="text-red-600 hover:text-red-800">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {returns.length === 0 && (
          <div className="text-center py-8 text-gray-500">No return requests</div>
        )}
      </div>
    </div>
  );
}

// Inventory Tab Component
function InventoryTab({ products, alerts }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FiPackage}
          title="Total Stock"
          value={products.reduce((sum, p) => sum + p.stock, 0)}
          color="blue"
        />
        <StatCard
          icon={FiAlertTriangle}
          title="Low Stock Items"
          value={alerts.length}
          color="orange"
        />
        <StatCard
          icon={FiTrendingDown}
          title="Out of Stock"
          value={products.filter(p => p.stock === 0).length}
          color="red"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Current Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reorder Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {alerts.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm">{product.stock} units</td>
                  <td className="px-6 py-4 text-sm">{product.reorderLevel || 5}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Support Tickets Tab Component
function SupportTab({ tickets }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Support Tickets</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">#{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{ticket.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ticket.subject}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'in-progress' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">No support tickets</div>
        )}
      </div>
    </div>
  );
}

// Payments Tab Component
function PaymentsTab({ payments, orders }) {
  const stats = {
    totalPayments: payments.length,
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    successfulPayments: payments.filter(p => p.status === 'success').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
  };

  const paymentMethods = ['Razorpay', 'Stripe', 'PayPal', 'UPI'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FiDollarSign} title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="green" />
        <StatCard icon={FiCheck} title="Successful" value={stats.successfulPayments} color="blue" />
        <StatCard icon={FiAlertTriangle} title="Failed" value={stats.failedPayments} color="red" />
        <StatCard icon={FiTrendingUp} title="Total Transactions" value={stats.totalPayments} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Payment Methods Distribution</h3>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{method}</span>
                <div className="h-2 bg-gray-200 flex-1 mx-3 rounded"></div>
                <span className="text-sm font-medium">{Math.floor(Math.random() * 40)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-left">
              💳 Initialize Razorpay Payment
            </button>
            <button className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium text-left">
              💳 Initialize Stripe Payment
            </button>
            <button className="w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition font-medium text-left">
              💳 Initialize UPI Payment
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.slice(0, 5).map((payment, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">₹{payment.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.method || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && <div className="text-center py-8 text-gray-500">No payment transactions yet</div>}
      </div>
    </div>
  );
}

// Shipping Tab Component
function ShippingTab({ shipments, orders }) {
  const stats = {
    totalShipments: shipments.length,
    inTransit: shipments.filter(s => s.status === 'in_transit').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    pending: shipments.filter(s => s.status === 'pending').length,
  };

  const carriers = ['Shiprocket', 'Delhivery', 'FedEx'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FiTruck} title="Total Shipments" value={stats.totalShipments} color="blue" />
        <StatCard icon={FiAlertTriangle} title="Pending" value={stats.pending} color="orange" />
        <StatCard icon={FiTrendingUp} title="In Transit" value={stats.inTransit} color="purple" />
        <StatCard icon={FiCheck} title="Delivered" value={stats.delivered} color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Carrier Distribution</h3>
          <div className="space-y-3">
            {carriers.map(carrier => (
              <div key={carrier} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{carrier}</span>
                <div className="h-2 bg-gray-200 flex-1 mx-3 rounded"></div>
                <span className="text-sm font-medium">{Math.floor(Math.random() * 50)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium text-left">
              + Create Shipment
            </button>
            <button className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium text-left">
              🔍 Track Shipment
            </button>
            <button className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium text-left">
              💰 Calculate Cost
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">Shipment Tracking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tracking ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Carrier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {shipments.slice(0, 5).map((shipment, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">{shipment.trackingId || `TRK${i}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{shipment.carrier || 'Shiprocket'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shipment.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{shipment.destination || 'City, State'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {shipments.length === 0 && <div className="text-center py-8 text-gray-500">No shipments yet</div>}
      </div>
    </div>
  );
}

// Notifications Tab Component
function NotificationsTab({ notifications, users }) {
  const notificationTypes = ['Email', 'SMS', 'Push', 'WhatsApp', 'In-App'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification System</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {notificationTypes.map(type => (
          <div key={type} className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{type}</p>
            <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 100)}</p>
            <p className="text-xs text-gray-400">Sent this month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Send Notification</h3>
          <div className="space-y-4">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Select Channel</option>
              <option>Email</option>
              <option>SMS</option>
              <option>Push Notification</option>
              <option>WhatsApp</option>
            </select>
            <input type="email" placeholder="Recipient" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <textarea placeholder="Message" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              Send Notification
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Notification Templates</h3>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <p className="text-sm font-medium">Order Confirmation</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <p className="text-sm font-medium">Shipment Update</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <p className="text-sm font-medium">Promotional Offer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">Notification History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Recipient</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notifications.slice(0, 5).map((notif, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{notif.type || 'Email'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{notif.recipient || 'user@example.com'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notif.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {notif.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(notif.createdAt || Date.now()).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Webhooks Tab Component
function WebhooksTab({ webhooks }) {
  const events = ['order.created', 'order.updated', 'payment.completed', 'shipment.updated', 'notification.sent'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Webhooks Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Subscribe to Event</h3>
          <div className="space-y-4">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Select Event</option>
              {events.map(evt => <option key={evt}>{evt}</option>)}
            </select>
            <input type="url" placeholder="Webhook URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Secret (optional)" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              Subscribe
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Webhook Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Webhooks</span>
              <span className="font-bold">{webhooks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-bold">{webhooks.filter(w => w.active).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Failed Deliveries</span>
              <span className="font-bold">5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">Active Webhooks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Event</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">URL</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {webhooks.slice(0, 5).map((webhook, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{webhook.event || 'order.created'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate">{webhook.url || 'https://example.com/webhook'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      webhook.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {webhooks.length === 0 && <div className="text-center py-8 text-gray-500">No webhooks configured</div>}
      </div>
    </div>
  );
}

// API Keys Tab Component
function APIKeysTab({ apiKeys }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">API Key Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Generate New API Key</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Key Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Permissions</label>
              <div className="space-y-2">
                {['read:products', 'write:products', 'read:orders', 'write:orders'].map(perm => (
                  <label key={perm} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    <span className="text-sm text-gray-700">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              Generate Key
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Key Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Keys</span>
              <span className="font-bold">{apiKeys.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-bold">{apiKeys.filter(k => k.active).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Requests</span>
              <span className="font-bold">1,234</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-gray-900">API Keys</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Key</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rate Limit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {apiKeys.slice(0, 5).map((key, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{key.name || 'API Key'}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500 truncate">sk_****{(i * 4 + i).toString().slice(-4)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      key.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {key.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">60/min</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {apiKeys.length === 0 && <div className="text-center py-8 text-gray-500">No API keys yet</div>}
      </div>
    </div>
  );
}

// Modal Component
function Modal({ modalType, productForm, handleProductFormChange, handleSaveProduct, editingProduct, couponForm, handleCouponFormChange, handleSaveCoupon, editingCoupon, campaignForm, handleSaveCampaign, editingCampaign, loyaltyForm, setLoyaltyForm, handleSaveLoyalty, categories, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {modalType === 'product' ? (editingProduct ? 'Edit Product' : 'Add New Product') :
             modalType === 'coupon' ? (editingCoupon ? 'Edit Coupon' : 'Create Coupon') :
             modalType === 'campaign' ? (editingCampaign ? 'Edit Campaign' : 'New Campaign') :
             'Configure Loyalty Program'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {modalType === 'product' && (
            <>
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleProductFormChange}
                placeholder="Product Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                name="description"
                value={productForm.description}
                onChange={handleProductFormChange}
                placeholder="Description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  placeholder="Price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleProductFormChange}
                  placeholder="Stock"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="brand"
                  value={productForm.brand}
                  onChange={handleProductFormChange}
                  placeholder="Brand"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <input
                type="text"
                name="image"
                value={productForm.image}
                onChange={handleProductFormChange}
                placeholder="Image URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={productForm.featured}
                  onChange={handleProductFormChange}
                  className="h-4 w-4"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">Featured Product</label>
              </div>
            </>
          )}

          {modalType === 'coupon' && (
            <>
              <input
                type="text"
                name="code"
                value={couponForm.code}
                onChange={handleCouponFormChange}
                placeholder="Coupon Code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="discountType"
                  value={couponForm.discountType}
                  onChange={handleCouponFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
                <input
                  type="number"
                  name="discountValue"
                  value={couponForm.discountValue}
                  onChange={handleCouponFormChange}
                  placeholder="Discount Value"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="minAmount"
                  value={couponForm.minAmount}
                  onChange={handleCouponFormChange}
                  placeholder="Min Amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  name="maxDiscount"
                  value={couponForm.maxDiscount}
                  onChange={handleCouponFormChange}
                  placeholder="Max Discount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="maxUses"
                  value={couponForm.maxUses}
                  onChange={handleCouponFormChange}
                  placeholder="Max Uses"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="date"
                  name="expiryDate"
                  value={couponForm.expiryDate}
                  onChange={handleCouponFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          )}

          {modalType === 'campaign' && (
            <>
              <input
                type="text"
                name="name"
                value={campaignForm.name}
                onChange={(e) => campaignForm.name = e.target.value}
                placeholder="Campaign Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                name="description"
                value={campaignForm.description}
                onChange={(e) => campaignForm.description = e.target.value}
                placeholder="Campaign Description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Discount %" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="date" placeholder="Start Date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </>
          )}

          {modalType === 'loyalty' && (
            <>
              <input
                type="number"
                value={loyaltyForm.pointsPerPurchase}
                onChange={(e) => setLoyaltyForm({...loyaltyForm, pointsPerPurchase: e.target.value})}
                placeholder="Points Per Purchase"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                value={loyaltyForm.pointsPerReview}
                onChange={(e) => setLoyaltyForm({...loyaltyForm, pointsPerReview: e.target.value})}
                placeholder="Points Per Review"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={loyaltyForm.redeemRate}
                  onChange={(e) => setLoyaltyForm({...loyaltyForm, redeemRate: e.target.value})}
                  placeholder="Redeem Rate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={loyaltyForm.redeemValue}
                  onChange={(e) => setLoyaltyForm({...loyaltyForm, redeemValue: e.target.value})}
                  placeholder="Redeem Value"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={modalType === 'product' ? handleSaveProduct : modalType === 'coupon' ? handleSaveCoupon : modalType === 'campaign' ? handleSaveCampaign : handleSaveLoyalty}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {editingProduct || editingCoupon || editingCampaign ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
