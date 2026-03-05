import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCouch, FaTruck, FaTools, FaShieldAlt, FaBox, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const Home = () => {
  const { user, isAuthenticated, isCustomer } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      fetchRecentOrders();
    }
  }, [isAuthenticated, isCustomer]);

  const fetchRecentOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await ordersAPI.getAll();
      // Get only the 3 most recent orders
      setRecentOrders(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_production: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-600 text-white',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Space with Premium Furniture
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Discover handcrafted furniture from expert carpenters. Quality designs delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              <Link to="/catalogue" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Shop Now
              </Link>
              <Link to="/register" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
                Get Started
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FurniHome?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCouch className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handcrafted furniture from skilled carpenters</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and secure delivery to your location</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTools className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
              <p className="text-gray-600">Order custom furniture made to your specs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">100% satisfaction with every purchase</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Orders Section - Only for logged-in customers */}
      {isAuthenticated && isCustomer && (
        <section className="py-16 bg-white border-b">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <FaClipboardList className="text-primary-600 text-3xl" />
                <h2 className="text-3xl font-bold">My Orders</h2>
              </div>
              <Link 
                to="/customerdashboard" 
                className="text-primary-600 hover:text-primary-800 font-semibold flex items-center gap-2"
              >
                View All Orders →
              </Link>
            </div>
            
            {loadingOrders ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your orders...</p>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentOrders.map((order) => (
                  <div key={order._id} className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-bold text-gray-900">
                        Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      📅 {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <FaBox className="text-gray-400" />
                      <span className="text-sm text-gray-600">{order.items?.length || 0} item(s)</span>
                      <span className="text-lg font-bold text-green-600 ml-auto">${order.totalAmount}</span>
                    </div>
                    <Link 
                      to={`/orders/${order._id}`}
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                    >
                      Track Order
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
                <Link to="/catalogue" className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['chair', 'table', 'sofa', 'bed', 'cabinet', 'desk', 'shelf'].map((category) => (
              <Link 
                key={category}
                to={`/catalogue?category=${category}`}
                className="card hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-4xl capitalize">{category}</span>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold capitalize">{category}s</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Carpenter?</h2>
          <p className="text-xl mb-8">Join our platform and showcase your designs to thousands of customers</p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Join as Carpenter
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
