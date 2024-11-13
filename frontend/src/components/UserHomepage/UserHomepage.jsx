// frontend/src/components/UserHomepage/UserHomepage.jsx
import React, { useState, useEffect } from 'react';
import { StarIcon, ShoppingCartIcon, Loader2 } from 'lucide-react';

const UserHomepage = () => {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, offersRes] = await Promise.all([
          fetch('http://localhost:5000/api/user-home/products'),
          fetch('http://localhost:5000/api/user-home/offers')
        ]);

        if (!productsRes.ok || !offersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsRes.json();
        const offersData = await offersRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setOffers(Array.isArray(offersData) ? offersData : []);
      } catch (err) {
        setError(err.message);
        setProducts([]);
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user-home/reviews/${productId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
      setSelectedProduct(productId);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Special Offers Section */}
      {offers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div key={offer.offer_id} className="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">{offer.offer_title}</h3>
                <p className="text-green-600 font-bold">{offer.discount_value}% OFF</p>
                <p className="text-sm text-gray-600">
                  Valid until {new Date(offer.end_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-600">No products available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.product_id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center mb-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="ml-1">{product.rating}</span>
                </div>
                <p className="text-lg font-bold text-green-600">${product.price}</p>
                {product.offer_title && (
                  <div className="mt-2 text-sm text-red-600">
                    {product.offer_title} - {product.discount_value}% OFF
                  </div>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => fetchReviews(product.product_id)}
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    View Reviews
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Product Reviews</h3>
            <div className="max-h-96 overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-center text-gray-600">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.review_id} className="mb-4 border-b pb-4">
                    <div className="flex items-center mb-2">
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1">{review.rating}</span>
                      <span className="ml-2 text-gray-600">{review.first_name}</span>
                    </div>
                    <p className="text-gray-700">{review.review_text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.review_date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomepage;