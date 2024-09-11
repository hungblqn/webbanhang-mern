import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckOut = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState([])

    const [products, setProducts] = useState([]);

    axios.defaults.withCredentials = true;

    //Lấy dữ liệu cho shopping cart
    useEffect(() => {
        axios
            .get(`http://localhost:5555/carts/${id}/ref`)
            .then((result) => {
                console.log({message: "message",result: result});
                setProducts(result.data.products);
            })
            .catch((error) => {
                alert('An error happened. Please check console');
                console.log(error);
            });
    }, [id]);
    let subTotal = 0;
    for(let i=0;i<products.length;i++){
        subTotal+= products[i].product.price * products[i].quantity;
    }

    //get user
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
                        // set data for cart products
                        axios.get(`http://localhost:5555/carts/${id}`)
                            .then((result) => {
                                console.log(result);
                                if (result.data.products.length === 0) {
                                    alert("Giỏ hàng rỗng");
                                    navigate('/');
                                }
                                setCartProducts(result.data.products);
                                getDataReference(result.data.products);
                                console.log({ message: 'message', data: products });
                            })
                            .catch((error) => {
                                console.log(error);
                            })

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

    const [customerName, setCustomerName] = useState('');
    const [exactAddress, setExactAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [phoneNumber, setPhoneNumber] = useState();

    const placeOrder = () => {
        if(customerName === "" || exactAddress === "" || district === "" || province === "" || phoneNumber === ""){
            alert("Please input all required fields")
            return;
        }
        const data = {
          account: id,
          products: products,
          receiverName: customerName,
          address: exactAddress+' '+district+' '+province,
          phoneNumber: phoneNumber,
          totalMoney: subTotal
        };
        console.log(data)
        axios
          .post('http://localhost:5555/orders',data)
          .then(() => {
            alert("Đặt hàng thành công!")
            //Tiến hành xoá giỏ hàng
            axios.delete(`http://localhost:5555/carts/${id}`)
                .then((result) => {
                    navigate('/')
                })
                .catch((error) => {
                    console.log(error.message);
                })
          })
          .catch((error ) => {
            if(error.response.data.message === "Insufficient stock for one or more products in the order."){
                alert("Không đủ hàng, làm ơn điều chỉnh lại số lượng trong giỏ hàng của bạn");
            }
            console.log(error);
          })
      };


    return (
        <div className='bg-black'>
            <div className='flex'>
                <h1 onClick={() => navigate('/')} className="ml-8 flex-none justify-center flex items-center text-white p-6 font-extrabold leading-none tracking-tight md:text-5xl lg:text-2xl dark:text-white">
                    Trang chủ
                </h1>
                <h1 className="ml-64 flex-none justify-center text-white p-6 font-extrabold leading-none tracking-tight md:text-5xl lg:text-4xl dark:text-white">
                    Thanh toán giỏ hàng của bạn
                </h1>
            </div>
            <div className='p-10 flex overflow-y-scroll bg-white shadow-xl'>
                <div className="flex-none w-1/2 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                <div className="flex justify-between text-base lg:text-2xl font-medium text-gray-900">
                                    <p>Tổng tiền</p>
                                    <p>{subTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                </div>
                            </div>
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
                                        </div>
                                    </div>
                                </li>
                            ))}
                            
                        </ul>
                    </div>
                </div>
                <div className='flex-none w-1/2'>
                    <div className="w-full md:w-96 md:max-w-full mx-auto">
                        <div className="p-6 border border-gray-300 sm:rounded-md">
                            <div>
                                <label className="block mb-6">
                                    <span className="text-gray-700">Tên người nhận</span>
                                    <input
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        name="name"
                                        type="text" F
                                        className="
            block
            w-full
            mt-1
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
          "
                                        placeholder=""
                                    />
                                </label>
                                <label className="block mb-6">
                                    <span className="text-gray-700">Địa chỉ</span>
                                    <input
                                        value={exactAddress}
                                        onChange={(e) => setExactAddress(e.target.value)}
                                        name="address1"
                                        type="text"
                                        className="
            block
            w-full
            mt-1
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
          "
                                        placeholder=""
                                    />
                                </label>
                                <label className="block mb-6">
                                    <span className="text-gray-700">Quận huyện</span>
                                    <input
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        name="city"
                                        type="text"
                                        className="
            block
            w-full
            mt-1
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
          "
                                        placeholder=""
                                    />
                                </label>
                                <label className="block mb-6">
                                    <span className="text-gray-700">Tỉnh thành</span>
                                    <input
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}
                                        name="state"
                                        type="text"
                                        className="
            block
            w-full
            mt-1
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
          "
                                        placeholder=""
                                    />
                                </label>
                                <label className="block mb-6">
                                    <span className="text-gray-700">Số điện thoại</span>
                                    <input
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        name="telephone"
                                        type="number"
                                        className="
            block
            w-full
            mt-1
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
          "
                                        placeholder=""
                                    />
                                </label>
                                <div className="mb-6">
                                    <button
                                        onClick={() => placeOrder()}
                                        className="
            h-10
            px-5
            text-indigo-100
            bg-indigo-700
            rounded-lg
            transition-colors
            duration-150
            focus:shadow-outline
            hover:bg-indigo-800
          "
                                    >
                                        Đặt hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CheckOut;
