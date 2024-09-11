import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfo, BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';


const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/products')
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://localhost:5555/products/${id}`)
      .then((response) => {
        setProducts(products.filter(product => product._id !== id));
        setLoading(false);
      })
      .catch((error) =>{
        console.log(error);
        setLoading(false);
      })
  }

  return (
    <div className='p-4 overflow-auto bg-gray-100'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Danh sách sản phẩm</h1>
        <Link to='/products/create'>
          <MdOutlineAddBox className='text-sky-800 text-4xl'/>
        </Link>
      </div>
      {loading ? (
        <Spinner/>
      ) : (
        <div className='overflow-x-auto overflow-y-auto'>
        <table className='w-full border-separate border-spacing-2'>
          <thead>
            <tr>
              <th className='border border-slate-600 rounded-md'>STT</th>
              <th className='border border-slate-600 rounded-md'>Tên sản phẩm</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Loại sản phẩm</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Mô tả</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Giá</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Tồn kho</th>
              <th className='border border-slate-600 rounded-md'>Ảnh</th>
              <th className='border border-slate-600 rounded-md'>Xử lý</th>
              
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className='h-8'>
                <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>
                <td className='border border-slate-700 rounded-md text-center'>{product.name}</td>
                <td className='border border-slate-700 rounded-md text-center'>{product.category}</td>
                <td className='border border-slate-700 rounded-md text-center'>{product.description}</td>
                <td className='border border-slate-700 rounded-md text-center'>{product.price}</td>
                <td className='border border-slate-700 rounded-md text-center'>{product.stock_quantity}</td>
                <td className='border border-slate-700 rounded-md text-center'>
                  {product.image && (
                    <img
                      src={product.image} // Assuming product.image contains the URL or Base64-encoded string
                      alt={`Product ${index + 1}`}
                      style={{ maxWidth: '100px', maxHeight: '100px' }} // Adjust size as needed
                      className='mx-auto'
                    />
                  )}
                </td>
                <td className='border border-slate-700 rounded-md text-center'>
                  <div className='flex justify-center gap-x-4'>
                    <Link to={`/products/edit/${product._id}`}>
                      <AiOutlineEdit className='text-2xl text-yellow-800'/>
                    </Link>
                    <button onClick={() => handleDeleteProduct(product._id)}>
                      <MdOutlineDelete className='text-2xl text-red-800'/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}

export default ShowProduct