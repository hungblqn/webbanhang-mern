import React from 'react'
import {Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import EditAccount from './pages/Account/EditAccount';
import CreateProduct from './pages/Product/CreateProduct';
import EditProduct from './pages/Product/EditProduct';
import CheckOut from './pages/CheckOut';
import Order from './pages/Order';

import EditOrder from './pages/Order/EditOrder';
import RecoveryAccount from './pages/RecoveryAccount';
import ResetPassword from './pages/ResetPassword';

import ChangePassword from './pages/ChangePassword';

import CreateCategory from './pages/Category/CreateCategory';
import EditCategory from './pages/Category/EditCategory';

const App = () => {
  return (
    <Routes>
      <Route path='/logout' element={<Logout/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/recovery' element={<RecoveryAccount/>}/>
      <Route path='/reset-password/:code' element={<ResetPassword/>}/>


      <Route path='/accounts/edit/:id' element={<EditAccount/>} />

      <Route path='/checkout/:id' element={<CheckOut/>}/>

      <Route path='order/:id' element={<Order/>} />

      <Route path='products/create' element={<CreateProduct/>} />
      <Route path='products/edit/:id' element={<EditProduct/>} />

      <Route path='categories/create' element={<CreateCategory/>} />
      <Route path='categories/edit/:id' element={<EditCategory/>} />

      <Route path='/orders/edit/:id' element={<EditOrder/>} />

      <Route path='/change-password' element={<ChangePassword/>} />

    </Routes>
  )
}

export default App