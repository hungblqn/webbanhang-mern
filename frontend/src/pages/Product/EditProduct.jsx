import React, { useState,useEffect } from 'react'
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [stock_quantity, setStockQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
        axios.get(`http://localhost:5555/products/${id}`)
        .then((response) => {
          setName(response.data.name);
          setDescription(response.data.description);
          setPrice(response.data.price);
          setImage(response.data.image);
          setCategory(response.data.category);
          setStockQuantity(response.data.stock_quantity);
          setLoading(false);
        }).catch((error) => {
          setLoading(false);
          alert('An error happened. Please check console');
          console.log(error);
        });
      }, [])

    const handleSaveProduct = () => {
        const data = {
            name,
            description,
            price,
            image,
            category,
            stock_quantity
        };
        setLoading(true);
        axios
            .put(`http://localhost:5555/products/${id}`, data)
            .then((response) => {
                setLoading(false);
                navigate('/dashboard');
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Please check console');
                console.log(error);
            })
    };
    // File input handling to convert the file to Base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set the Base64-encoded string to the state
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='p-4'>
            <BackButton destination = '/dashboard' />
            <h1 className='text-3xl my-4'>Cập nhật sản phẩm</h1>
            {loading ? <Spinner /> : ''}
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Tên sản phẩm</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                    <label className='text-xl mr-4 text-gray-500'>Mô tả</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                    <label className='text-xl mr-4 text-gray-500'>Giá thành</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                    <label className='text-xl mr-4 text-gray-500'>Danh mục</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                    <label className='text-xl mr-4 text-gray-500'>Số lượng trong kho</label>
                    <input
                        type="number"
                        value={stock_quantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                    <label className='text-xl mr-4 text-gray-500'>Ảnh sản phẩm</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>
                <button className='p-2 bg-sky-300' onClick={handleSaveProduct}>
                    Lưu
                </button>
            </div>
        </div>
    )
}

export default EditProduct