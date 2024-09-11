import React, { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditAccount = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    setLoading(false);
    axios.get(`http://localhost:5555/accounts/${id}`)
    .then((response) => {
      setUsername(response.data.username);
      setPassword(response.data.password);
      setRole(response.data.role);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      alert('An error happened. Please check console');
      console.log(error);
    });
  }, [])
  const handleSaveAccount = () =>{
    if(password === ""){
        alert("Mật khẩu không được rỗng");
        return;
    }
    const data = {
      username,
      password,
      role
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/accounts/${id}`,data)
      .then(() => {
        setLoading(false);
        navigate('/');
      })
      .catch((error ) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      })
  };

  return (
    <div className='p-4'>
      <BackButton destination = '/dashboard'/>
      <h1 className='text-3xl my-4'>Edit Account</h1>
      {loading ? <Spinner/> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Tên tài khoản</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <label className='text-xl mr-4 text-gray-500'>Mật khẩu</label>
          <input 
            type="text"
            value={password}
            placeholder="Nhập mật khẩu bạn muốn sửa"
            onChange={(e) => setPassword(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <label className='text-xl mr-4 text-gray-500'>Vai trò (user,admin)</label>
          <input 
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300' onClick={handleSaveAccount}>
          Lưu
        </button>
      </div>
    </div>
  )
}

export default EditAccount