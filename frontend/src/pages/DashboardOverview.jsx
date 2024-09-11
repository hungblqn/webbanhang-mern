import React, {useState, useEffect} from 'react'
import axios from 'axios';

const DashboardOverview = () => {
  const [money, setMoney] = useState(0);
  useEffect(() => {
    axios.get('http://localhost:5555/orders/done/done')
    .then((result) => {
      console.log(result);
      let totalMoney=0;
      for(let i=0;i<result.data.data.length;i++){
        totalMoney+=result.data.data[i].totalMoney
      }
      setMoney(totalMoney);
    })
    .catch((error) => {
      console.log(error);
    })

  }, [])
  return (
    <div>
      <p className='font-bold'>Tổng tiền các đơn hàng đã hoàn thành: {money.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
    </div>
    
  )
}

export default DashboardOverview