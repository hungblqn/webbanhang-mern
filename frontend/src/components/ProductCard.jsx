import React, { useState } from 'react';
import Spinner from './Spinner';
import axios from 'axios';

const ProductCard = ({ product, accountId }) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addProductToCart = (accountId,productId, quantity) =>{
    if(accountId === undefined){
      alert("Đăng nhập để mua hàng")
      return;
    }
    if (quantity > product.stock_quantity) {
      alert("Vui lòng điều chỉnh số lượng hàng");
      return;
    }
    axios.post('http://localhost:5555/carts/add-product', {accountId, productId,quantity})
    .then((result) => {
      console.log(result);
      alert("Thêm vào giỏ hàng thành công!")
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <div className="bg-white relative m-10 flex min-w-600 min-h-1200 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <a className="flex items-center justify-center relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
        <img className="object-cover" src={product.image} alt={product.name} />
      </a>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <h5 className="text-xl tracking-tight text-slate-900">{product.name}</h5>
        </a>
        <a href="#">
          <p className="text-l tracking-tight text-slate-900">Mô tả: {product.description}</p>
        </a>
        <a href="#">
          <p className="text-l tracking-tight text-slate-900">Loại sản phẩm: {product.category}</p>
        </a>
        <a href="#">
          <p className="text-l tracking-tight text-slate-900">Còn lại: {product.stock_quantity}</p>
        </a>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
          </p>
        </div>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <label htmlFor="quantity  ">Nhập số lượng:</label>
          <input type="number" defaultValue={1} value={quantity} onChange={(e) => {
            const inputValue = parseInt(e.target.value, 10);
            if (!isNaN(inputValue) && inputValue > 0) {
              setQuantity(inputValue);
            }
          }} name='quantity' className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 w-24" />
        </div>
        <div onClick={() => addProductToCart(accountId, product._id, quantity)} className="mt-2 mb-5 flex items-center justify-between">
            <a className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {/* ... (same as before) */}
              </svg>
              Thêm vào giỏ
            </a>
          </div>
      </div>

    </div>

  );
};
{/*<div className="relative m-10 flex min-w-80 min-h-1024 max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
        <img className="object-cover" src={product.image} alt={product.name} />
        </a>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <h5 className="text-xl tracking-tight text-slate-900">{product.name}</h5>
        </a>
        <a href="#">
          <p className="text-l tracking-tight text-slate-900">Mô tả: {product.description}</p>
        </a>
        <a href="#">
          <p className="text-l tracking-tight text-slate-900">Loại: {product.category}</p>
        </a>
        <a href="#">
          <p className="text-l tracking-tight text-slate-900">Còn lại: {product.stock_quantity}</p>
        </a>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">{product.price} vnđ</span>
          </p>
        </div>
        <a onClick={handleAddToCart} className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to cart</a>
      </div>

    </div>*/}
{/* 
    <div className="border border-slate-700 w-72 mx-auto bg-white rounded-xl overflow-hidden md:w-96">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className=" object-cover w-full h-full object-cover md:w-48"
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className="p-4">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {product.category}
          </div>
          <p className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
            {product.name}
          </p>
          <p className="mt-2 text-gray-500">{product.description}</p>
          <div className="mt-2">
            <span className="text-gray-500">Price: ${product.price}</span>
          </div>
          <div className="mt-2">
            <span className="text-gray-500">Stock: {product.stock_quantity}</span>

          </div>
          <div>
            <button onClick={handleAddToCart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>*/}


export default ProductCard;