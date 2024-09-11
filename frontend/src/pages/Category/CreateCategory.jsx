import React, { useState } from 'react'
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSaveBook = () =>{
    const data = {
      name
    };
    setLoading(true);
    axios
      .post('http://localhost:5555/categories',data)
      .then(() => {
        setLoading(false);
        navigate('/dashboard');
      })
      .catch((error ) => {
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
      <BackButton/>
      <h1 className='text-3xl my-4'>Thêm danh mục</h1>
      
      {loading ? <Spinner/> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
        <label className='text-xl mr-4 text-gray-500'>Tên danh mục</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300' onClick={handleSaveBook}>
          Lưu
        </button>
      </div>
    </div>
  )
}

export default CreateCategory