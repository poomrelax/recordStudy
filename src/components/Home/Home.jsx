import React, { useState, useEffect } from 'react'
import stylesHome from './Home.module.css'
import { ClimbingBoxLoader } from 'react-spinners'
import axios from 'axios'
import api from '../../../url_data.json'
import { useNavigate } from 'react-router-dom'


function Home() {

    const [loadding, setLoadding] = useState(false)

    const navigation = useNavigate()

    async function start(){
        setLoadding(true)
        try{
          await axios.post(api.api + "create", {}, {
            timeout: 4000
          })
            .then(r => {
            // console.log(r.data)
            setLoadding(false)
            navigation(`/record/${r.data}/`)
        })
        }catch(err){
          setLoadding(false)
          alert("ผู้ดูแลระบบยังไม่เปิดเซิร์ฟเวอร์สำหรับสร้างบันทึกหลังการจัดการเรียนรู้ในขณะนี้ กรุณาติดต่อผู้ดูแลระบบเพื่อขอข้อมูลเพิ่มเติม")
        }
    }

  return (
    <>
        {loadding && (
            <div style={{position: 'fixed', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column', color: '#fff', gap: '20px'}}>
                <ClimbingBoxLoader color='#374bff' size={22}/>
                <h3>กำลังโหลดข้อมูล</h3>
            </div>
        )}
    <div className={stylesHome.container}>
      <div className={stylesHome.content}>
        <h1>📝 บันทึกหลังการจัดการเรียนรู้ 📝</h1>
        <button onClick={start} className='btn btn-outline-warning fw-bold mt-5'>📚 สร้างบันทึกหลังการจัดการเรียนรู้ 📚</button>
      </div>
    </div>
    </>
  )
}

export default Home