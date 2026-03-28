import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../utils/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = cartItems.map((item) => ({ artwork_id: item._id }));
      
      // Step 1: Create Order on Backend
      const { data } = await API.post('/orders/create-payment', { items });
      const { order, key_id } = data;

      // Step 2: Initialize Razorpay Checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "M-Art Marketplace",
        description: "Artwork Purchase",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify Payment
            const verifyRes = await API.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items
            });
            setOrderResult(verifyRes.data);
            setSuccess(true);
            clearCart();
          } catch (err) {
            alert(err.response?.data?.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: "M-Art User",
          email: "user@m-art.com",
          contact: "9999999999"
        },
        theme: {
          color: "#0f172a" // Tracking primary-950
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
      
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to initiate payment';
      alert('Error: ' + errorMsg);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-6">✓</div>
          <h1 className="text-3xl font-serif font-bold text-primary-950 mb-2" id="order-success-title">Order Confirmed</h1>
          <p className="text-sm text-primary-500 mb-2">Your order has been placed successfully.</p>
          <p className="text-xs text-primary-400 mb-10">{orderResult?.orders?.length} artwork(s) purchased</p>
          <div className="flex flex-col gap-3">
            <Link to="/gallery" className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors text-center" id="continue-shopping-btn">
              Continue Shopping
            </Link>
            <Link to="/" className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest text-primary-950 border border-primary-950 hover:bg-primary-950 hover:text-white transition-colors text-center">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-serif font-bold text-primary-950 mb-2" id="checkout-title">Checkout</h1>
        <p className="text-sm text-primary-500 mb-10">Review your order and confirm</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-4">Order Items</h3>
              <div className="border border-gray-200">
                {cartItems.map((item, i) => (
                  <div key={item._id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-gray-200' : ''}`}>
                    <div className="w-14 h-14 flex-shrink-0 bg-surface-200 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface-200"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-950 truncate">{item.title}</p>
                      <p className="text-xs text-primary-500">{item.category}</p>
                    </div>
                    <span className="text-sm font-medium text-primary-950">₹{item.price?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-4">Payment</h3>
              <div className="p-6 border border-gray-200">
                <p className="text-sm font-medium text-primary-950">Secure Razorpay Checkout</p>
                <p className="text-xs text-primary-500 mt-1">Cards, UPI, NetBanking supported. Uses Razorpay Test Mode.</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border border-gray-200 p-8 h-fit sticky top-24" id="checkout-summary">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-6">Summary</h3>
            <div className="space-y-3 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-primary-500">Items ({cartItems.length})</span>
                <span className="text-primary-950">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-500">Shipping</span>
                <span className="text-green-700">Free</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-serif font-bold mt-6 mb-8">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button onClick={handleCheckout} disabled={loading}
              className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors disabled:opacity-50"
              id="place-order-btn">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
