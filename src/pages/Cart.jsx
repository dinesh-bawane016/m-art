import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-serif font-bold text-primary-950 mb-2" id="cart-title">Shopping Cart</h1>
        <p className="text-sm text-primary-500 mb-10">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border border-gray-200">
            <p className="font-serif text-2xl text-primary-950">Your cart is empty</p>
            <p className="text-sm text-primary-500 mt-2 mb-8">Discover something you love in our gallery</p>
            <Link to="/gallery" className="inline-block px-10 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors">
              Browse Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="border-t border-gray-200">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-5 py-6 border-b border-gray-200" id={`cart-item-${item._id}`}>
                    <div className="w-24 h-28 flex-shrink-0 bg-surface-200 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary-500 uppercase tracking-wider">{item.artist_id?.name || 'Artist'}</p>
                      <h3 className="font-serif text-lg text-primary-950 mt-0.5">{item.title}</h3>
                      <p className="text-xs text-primary-400 mt-1">{item.category}</p>
                      <p className="text-sm font-medium text-primary-950 mt-2">₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => removeFromCart(item._id)}
                      className="self-start text-xs text-primary-500 uppercase tracking-wider hover:text-primary-950 transition-colors underline">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={clearCart}
                className="mt-4 text-xs text-primary-500 uppercase tracking-wider hover:text-primary-950 transition-colors underline"
                id="clear-cart-btn">
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div className="border border-gray-200 p-8 h-fit sticky top-24" id="order-summary">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-6">Order Summary</h3>
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500">Subtotal</span>
                  <span className="text-primary-950">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-500">Shipping</span>
                  <span className="text-green-700">Free</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-serif font-bold mt-6 mb-8">
                <span className="text-primary-950">Total</span>
                <span className="text-primary-950">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {user ? (
                <Link to="/checkout"
                  className="block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors"
                  id="checkout-btn">
                  Checkout
                </Link>
              ) : (
                <Link to="/login"
                  className="block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-white bg-primary-950 hover:bg-accent-hover transition-colors"
                  id="login-to-checkout">
                  Log In to Checkout
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
