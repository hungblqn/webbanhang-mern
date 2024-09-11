import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ShowAccount from './Account/ShowAccount';
import ShowProduct from './Product/ShowProduct';
import ShowOrder from './Order/ShowOrder';
import ShowCategory from './Category/ShowCategory';
import DashboardOverview from './DashboardOverview';



// Define other components similarly if needed

const Dashboard = () => {
  const [success, setSuccess] = useState();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    
    axios
      .get('http://localhost:5555/accounts/dashboard')
      .then((result) => {
        console.log(result);
        if (result.data === 'Success') {
          setSuccess('Success');
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, []);

  return (
    
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white w-64 h-2000 p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ul className="mt-4">
          <li
            className={`mt-4 py-2 hover:bg-gray-700 cursor-pointer ${
              selectedTab === 'dashboard' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelectedTab('dashboard')}
          >
            Tổng quan
          </li>
          <li
            className={`mt-4 py-2 hover:bg-gray-700 cursor-pointer ${
              selectedTab === 'showproduct' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelectedTab('showcategory')}
          >
            Danh mục
          </li>
          <li
            className={`mt-4 py-2 hover:bg-gray-700 cursor-pointer ${
              selectedTab === 'showproduct' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelectedTab('showproduct')}
          >
            Sản phẩm
          </li>
          <li
            className={`mt-4 py-2 hover:bg-gray-700 cursor-pointer ${
              selectedTab === 'showaccount' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelectedTab('showaccount')}
          >
            Người dùng
          </li>
          <li
            className={`mt-4 py-2 hover:bg-gray-700 cursor-pointer ${
              selectedTab === 'showorder' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelectedTab('showorder')}
          >
            Đơn hàng
          </li>
          <br/>
          <li
            className={`mt-64 py-2 hover:bg-gray-700 cursor-pointer`}
            onClick={() => navigate('/')}
          >
              Trang chủ
          </li>
          <li
            className={`py-2 hover:bg-gray-700 cursor-pointer`}
            onClick={() => navigate('/logout')}
          >
              Đăng xuất
          </li>
          {/* Add more sidebar items as needed */}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 min-h-3000">Dashboard Overview</h1>

        {selectedTab === 'dashboard' && <DashboardOverview />}
        {selectedTab === 'showcategory' && <ShowCategory/>}
        {selectedTab === 'showproduct' && <ShowProduct />}
        {selectedTab === 'showaccount' && <ShowAccount />}
        {selectedTab === 'showorder' && <ShowOrder />}
        {/* Add more content for other sidebar items as needed */}
      </main>
    </div>
  );
};

export default Dashboard;
