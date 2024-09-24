import React, { useState } from 'react';

const AddProductModal = ({ open, handleClose, handleAdd }) => {
  const [product, setProduct] = useState({
    product_name: '',
    product_code: '',
    price: '',
    stock_quantity: '',
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    handleAdd(product);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <input
          name="product_name"
          type="text"
          placeholder="Product Name"
          className="input input-bordered w-full mb-4"
          value={product.product_name}
          onChange={handleChange}
        />
        <input
          name="product_code"
          type="text"
          placeholder="Product Code"
          className="input input-bordered w-full mb-4"
          value={product.product_code}
          onChange={handleChange}
        />
        <input
          name="price"
          type="text"
          placeholder="Price"
          className="input input-bordered w-full mb-4"
          value={product.price}
          onChange={handleChange}
        />
        <input
          name="stock_quantity"
          type="text"
          placeholder="Stock Quantity"
          className="input input-bordered w-full mb-4"
          value={product.stock_quantity}
          onChange={handleChange}
        />
        <div className="modal-action">
          <button onClick={handleSubmit} className="btn btn-primary">Add Product</button>
          <button onClick={handleClose} className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
