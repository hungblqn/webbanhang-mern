import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Order = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState([])

    const [orders, setOrders] = useState([]);

    axios.defaults.withCredentials = true;

    //Lấy dữ liệu cho shopping cart
    useEffect(() => {
        axios
            .get(`http://localhost:5555/orders/${id}/ref`)
            .then((result) => {
                console.log({ message: "message", result: result.data });
                setOrders(result.data.data);
                console.log({ name: "Order", orders: orders })
            })
            .catch((error) => {
                alert('An error happened. Please check console');
                console.log(error);
            });
    }, [id]);
    useEffect(() => {
        try {
            axios.get('http://localhost:5555/accounts/home')
                .then((result) => {
                    setUser(result.data.decoded);
                    //if current user is not own the cart
                    if (result.data.decoded.id !== id) {
                        navigate('/')
                    }
                    //if current user own the cart
                    else {

                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        catch (error) {
            alert("error happened");
            console.log(error);
        }
    }, [])

    return (
        <div>
            <div className='flex bg-black'>
                <h1 onClick={() => navigate('/')} className="ml-8 flex-none justify-center flex items-center text-white p-6 font-extrabold leading-none tracking-tight md:text-5xl lg:text-2xl dark:text-white">
                    Trang chủ
                </h1>
                <h1 className="ml-96 flex-none justify-center text-white p-6 font-extrabold leading-none tracking-tight md:text-5xl lg:text-4xl dark:text-white">
                    Đơn hàng của bạn
                </h1>
            </div>
            {orders.map((order, index) => (
                <div key={index} className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto bg-gray-100">
                    <div className="flex justify-start item-start space-y-2 flex-col">

                        <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Mã đơn hàng: {order._id}</h1>
                        <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">Đặt hàng{` `}
                            {new Date(order.createdAt).toLocaleString('vi-VN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            })}
                        </p>
                        <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">Cập nhật{` `}
                            {new Date(order.updatedAt).toLocaleString('vi-VN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                            <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Chi tiết đơn hàng</p>
                                {order.products.map((product, jdex) => (
                                    <div key={jdex} className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                        <div className="pb-4 md:pb-8 w-full md:w-40">
                                            <img className="w-full hidden md:block" src={product.product.image} alt={product.product.name} />
                                            <img className="w-full md:hidden" src={product.product.image} alt="dress" />

                                        </div>
                                        <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                            <div className="w-full flex flex-col justify-start items-start space-y-8">
                                                <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">{product.product.name}</h3>
                                                <div className="flex justify-start items-start flex-col space-y-2">
                                                    <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Mô tả: </span> {product.product.description} </p>
                                                    <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Loại sản phẩm: </span> {product.product.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between space-x-8 items-start w-full">
                                                <p className="text-base dark:text-white xl:text-lg leading-6">{product.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">{product.quantity}</p>
                                                <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">{(product.product.price * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                    <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Chi tiết</h3>
                                    <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">

                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Tổng tiền</p>
                                        <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">{order.products.reduce((total, product) => total + product.product.price * product.quantity, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                    <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Tình trạng đơn hàng
                                    </h3>
                                    <div className="flex justify-between items-start w-full">
                                        <div className="flex justify-center items-center space-x-4">
                                            {order.status === "Pending" ? "Đang xử lý" : (order.status === "Shipping" ? "Đang giao hàng" : "Đã hoàn thành")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">  </h3>
                            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                <div className="flex flex-col justify-start items-start flex-shrink-0">
                                    <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                        <img src="https://i.ibb.co/5TSg7f6/Rectangle-18.png" alt="avatar" />
                                        <div className="flex justify-start items-start flex-col space-y-2">
                                            <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">{order.account.username}</p>

                                        </div>
                                    </div>

                                    <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                        <img className="dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/order-summary-3-svg1.svg" alt="email" />
                                        <img className="hidden dark:block" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/order-summary-3-svg1dark.svg" alt="email" />
                                        <p className="cursor-pointer text-sm leading-5 ">{order.account.email}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                                    <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                            <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Tên người nhận</p>
                                            <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order.receiverName}</p>
                                        </div>
                                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                            <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Địa chỉ giao hàng</p>
                                            <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order.address}</p>
                                        </div>
                                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                            <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Số điện thoại</p>
                                            <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">0{order.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Order;
