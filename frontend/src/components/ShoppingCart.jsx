import React, { useState, useEffect } from 'react'
import axios from 'axios';
import CheckOut from '../pages/CheckOut.jsx';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner.jsx';

const ShoppingCart = ({ onClose, accountId }) => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    //Xoá dữ liệu khỏi shopping cart
    const deleteItemFromCart = (productId) => {
        axios.post('http://localhost:5555/carts/remove-product',{accountId,productId})
        .then((result) => {
            console.log(result);
            ResetDataAfterDelete();
        })
        .catch((error) =>{
            alert("error happened: "+error);
        })
    }

    //Lấy dữ liệu cho shopping cart
    useEffect(() => {
        axios
            .get(`http://localhost:5555/carts/${accountId}/ref`)
            .then((result) => {
                console.log({ message: "message", result: result });
                setProducts(result.data.products);
                
            })
            .catch((error) => {
                alert('An error happened. Please check console');
                console.log(error);
            });
    }, [accountId]);
    let subTotal = 0;
    for (let i = 0; i < products.length; i++) {
        subTotal += products[i].product.price * products[i].quantity;
    }
    const ResetDataAfterDelete = async () => {
        setLoading(true);
        await axios.get(`http://localhost:5555/carts/${accountId}/ref`)
            .then((result) => {
                setProducts(result.data.products);
                
                setLoading(false);
            })
            .catch((error) => {
                alert('An error happened. Please check console');
                console.log(error);
            });

    };

    return (
        <div>
            <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-md">
                                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Giỏ hàng của bạn</h2>

                                            <div className="ml-3 flex h-7 items-center">
                                                <button onClick={onClose} type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                                                    <span className="absolute -inset-0.5"></span>
                                                    <span className="sr-only">Close panel</span>
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">{products.length === 0 ? 'Bạn chưa có gì trong giỏ hàng' : `Số lượng: ${products.length}`}</h2>
                                        <div className="mt-8">
                                            <div className="flow-root">
                                                <ul role="list" className="-my-6 divide-y divide-gray-200">

                                                    {products.map((product, index) => (
                                                        <li key={index} className="flex py-6">
                                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                <img src={product.product.image} alt={product.product.name} className="h-full w-full object-cover object-center" />
                                                            </div>

                                                            <div className="ml-4 flex flex-1 flex-col">
                                                                <div>
                                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                                        <h3>
                                                                            <a href="#">{product.product.name}</a>
                                                                        </h3>
                                                                        <p className="ml-4">{product.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                                    </div>
                                                                    <p className="mt-1 text-sm text-gray-500">{product.product.description}</p>
                                                                    <p className="mt-1 text-sm text-gray-500">{product.product.category}</p>
                                                                </div>
                                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                                    <p className="text-gray-500">Số lượng: {product.quantity}</p>
                                                                    <div className="flex">
                                                                        {loading ? <Spinner /> : (
                                                                            <button onClick={() => {
                                                                                deleteItemFromCart(product._id)
                                                                            }} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                                Xoá
                                                                            </button>
                                                                        )}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Tổng tiền</p>
                                            <p>{subTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                        </div>
                                        <div className="mt-6">
                                            <a onClick={() => navigate(`/checkout/${accountId}`)} className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                                                Thanh toán
                                            </a>
                                        </div>
                                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                            <p>
                                                hoặc
                                                <button onClick={onClose} type="button" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
                                                    Tiếp tục mua sắm
                                                    <span aria-hidden="true"> &rarr;</span>
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart