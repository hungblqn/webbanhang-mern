import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { BsCartPlus } from "react-icons/bs";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import ShoppingCart from '../components/ShoppingCart';
import Spinner from '../components/Spinner';



const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [success, setSuccess] = useState();
  const [selectedTab, setSelectedTab] = useState('home');

  const [cartModal, setCartModal] = useState(false);

  const [products, setProducts] = useState([]);

  const [cartProducts, setCartProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;



  //Lấy dữ liệu sản phẩm để hiển thị
  useEffect(() => {
    axios
      .get('http://localhost:5555/products')
      .then((result) => {
        setProducts(result.data.data);
        setLoading(false)
      })
      .catch((error) => {
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, []);

  //Lấy dữ liệu cho account
  useEffect(() => {
    axios
      .get('http://localhost:5555/accounts/home')
      .then((result) => {
        if (result.data.message === 'Success') {
          setSuccess('Success');
          setUser(result.data.decoded);
          
        } else {
          setSuccess('NotSuccess');
        }
      })
      .catch((error) => {
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, []);

  //Tạo cart cho account
  const createNewCart = (id) => {
    axios
      .post('http://localhost:5555/carts', { account: id })
      .then((result) => {

      })
      .catch((error) => {
        alert('An error happened. Please check console');
        console.log(error);
      })
  }

  //Nếu đã đăng nhập thì check xem giỏ hàng được tạo chưa, chưa thì tạo giỏ hàng
  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:5555/carts/${user.id}`)
        .then((result) => {
          if (result.data === null) {
            //alert("Giỏ hàng chưa được tạo")
            //alert(`Tiến hành tạo giỏ hàng rỗng cho ${user.username}`)
            createNewCart(user.id)
          }
        })
        .catch((error) => {
          alert("error happened");
          console.log(error);
        })
    }
  }, [user]);

  //Mở cart
  const handleOpenCart = (id) => {
    setCartModal(true);
    axios
      .get(`http://localhost:5555/carts/${id}`)
      .then((result) => {
        console.log(result)
        if (result.data === null) {
        }
        else {
          console.log(result.data);
          console.log({ message: "Success", result: result.data })
        }
      })
      .catch((error) => {
        alert("error happened");
        console.log(error);
      })
  }
  //Xoay chữ
  const text1 = '         MUA  NGAY!           '
  const [displayText, setDisplayText] = useState(text1);
  const text2 = '        TÌM  KIẾM       ';
  const [displayText2, setDisplayText2] = useState(text2);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayText((prevText) => {
        // Shift the first character to the end
        const rotatedText = prevText.slice(1) + prevText.charAt(0);
        return rotatedText;
      });
    }, 400);
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const interval2 = setInterval(() => {
      setDisplayText2((prevText) => {
        // Shift the first character to the end
        const rotatedText2 = prevText.slice(1) + prevText.charAt(0);
        return rotatedText2;
      });
    }, 400);
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval2);
  }, []);

  const [nameToFind, setNameToFind] = useState('');

  const handleFindProductWithName = (productName) => {
    if(nameToFind === ""){
      axios
      .get('http://localhost:5555/products')
      .then((result) => {
        setProducts(result.data.data);

        setLoading(false)
      })
      .catch((error) => {
        alert('An error happened. Please check console');
        console.log(error);
      });
      return;
    }
    axios.get(`http://localhost:5555/products/findByName/${productName}`)
    .then((result) =>{
      console.log({message: "message",result: result})
      setProducts(result.data.data);
    })
    .catch((error) => {
      alert("error happened");
      console.log(error);
    })
  }


  return (

    <div >
      <header className="bg-red-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-semibold">
            <button onClick={() => setSelectedTab('home')} className='mr-6 hover:bg-black cursor-pointer p-4'>TRANG CHỦ</button>
            {success === "Success" && (
              
              <button onClick={() => navigate('/change-password')} className='text-white hover:bg-black cursor-pointer p-4'>ĐỔI MẬT KHẨU</button>
            
            )}
            {user.role === "admin" && (
              <button onClick={() => navigate('/dashboard')} className='text-white hover:bg-black cursor-pointer p-4'>BẢNG ĐIỀU KHIỂN</button>
            )}
          </div>
          <div className='text-center'>
            <h1 className="justify-center flex items-center text-white mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl dark:text-white">
            <BsCartPlus/> {displayText}
            </h1>
          </div>
          <nav className="space-x-4 text-xl font-semibold">
            {/* Chưa đăng nhập */}
            {success === "NotSuccess" && (
              <>
                <a onClick={() => navigate('/login')} className="p-4 text-white hover:text-gray-300">
                  Đăng nhập
                </a>
                <a onClick={() => navigate('/register')} className="p-4 text-white hover:text-gray-300">
                  Đăng ký
                </a>
              </>
            )}
            {/* Đã đăng nhập */}
            {success === "Success" && (
              
              <div className="mr-3 container mx-auto flex justify-between items-center">
                
                <div className='p-4 hover:bg-black cursor-pointer'>
                  <a className="text-white hover:text-gray-300">
                    Xin chào
                  </a>
                  <p className='text-white text-lg'>{user.username}</p>
                </div>
                <div onClick={() => navigate(`/order/${user.id}`)} className='p-4 hover:bg-black cursor-pointer'>
                  <a className="text-white hover:text-gray-300">
                    Đơn hàng
                  </a>
                  <p className='text-white text-lg'>của bạn</p>
                </div>
                <div className='p-4 hover:bg-black cursor-pointer' onClick={() => navigate('/logout')}>
                  <a className="text-white hover:text-gray-300">
                    Đăng xuất
                  </a>
                  <RiLogoutCircleRFill size={32} className='2xl text-white text-left' />
                </div>

                <div onClick={() => handleOpenCart(user.id)} className='flex mr-3 hover:bg-black cursor-pointer'>
                  <p className='p-4 text-white'>Giỏ hàng<BsCartPlus size={32} className='2xl text-white text-right' /></p>
                  
                </div>
                {cartModal === true && <ShoppingCart accountId={user.id} onClose={() => setCartModal(false)} />}
              </div>

            )}
          </nav>

        </div>
      </header>
      <main className='bg-gradient-to-br from-cyan-300 via-cyan-500 to-cyan-600 min-h-[800px]'>

        <div className='bg-black mb-2 flex'>
          <div className='flex-none w-1/2 h-3/2'>
            <div className='text-right mr-16'>
              <h1 className="mt-2 text-white mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl dark:text-white">
                {displayText2} :
              </h1>
            </div>
          </div>
          <div className='flex-none w-1/2 mt-2 '>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative p-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="text" value={nameToFind} onChange={(e) => setNameToFind(e.target.value)} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Tìm kiếm sản phẩm với tên" required />
              <button onClick={() => handleFindProductWithName(nameToFind)} className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Xác nhận</button>
            </div>
          </div>
        </div>
        <div className='text-center'>
          <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-white">Mua ngay</h2>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 z-10'>
        {loading && <Spinner/>}
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} accountId={user.id} />
          ))}
        </div>

      </main>




      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="#" className="flex items-center">
                <img src="/logo.png" className="h-8 me-3" alt="FlowBite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BRAND</span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">SOCIAL MEDIA</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">Facebook</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">Twitter</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="https://github.com/themesberg/flowbite" className="hover:underline ">Github</a>
                  </li>
                  <li>
                    <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#" className="hover:underline">Website</a>. All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                  <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Facebook page</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                  <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                </svg>
                <span className="sr-only">Discord community</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                  <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Twitter page</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Dribbble account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>


    </div>

  )
}

export default Home