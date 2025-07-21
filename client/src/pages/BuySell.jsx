import React, { useState, useEffect } from 'react';

function BuySell() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(stored);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...products, form];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    setForm({
      title: '',
      description: '',
      price: '',
      image: '',
    });
  };

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-blue-200 flex justify-center items-center'>
      <div className='w-full bg-white max-w-md rounded-md shadow-md p-6'>
        <h1 className='text-3xl font-bold block p-6 mb-6 text-blue-800'>Buy/Sell Marketplace</h1>

        <form onSubmit={handleSubmit} className=''>
          <input
            type="text"
            name="title"
            placeholder='Item title'
            value={form.title}
            onChange={handleChange}
            required
            className='w-full h-12 m-2 rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className='w-full h-12 m-2 rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className='w-full h-12 m-2 rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            required
            className='w-full h-12 m-2 rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <button
            type="submit"
            className="w-full bg-blue-500 rounded-md p-2 m-2 text-white font-bold"
          >
            Post Item
          </button>
        </form>

        <input
          type="text"
          placeholder="Search by title/description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 mt-4 mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className='mt-4'>
          <h2 className='text-2xl font-semibold mb-4 text-blue-800'>Available Products</h2>

          {filteredProducts.length === 0 ? (
            <p className='text-gray-600'>No products found.</p>
          ) : (
            <div className='space-y-4'>
              {filteredProducts.map((item, index) => (
                <div key={index} className='p-4 bg-blue-50 border rounded shadow-sm'>
                  <h3 className='text-lg font-bold'>{item.title}</h3>
                  <p className='text-sm'>{item.description}</p>
                  <p className='text-green-700 font-semibold mb-2'>₹ {item.price}</p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className='w-full h-48 object-cover rounded-md'
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuySell;
      