import React, { useState, useEffect, forwardRef } from 'react'

const Active = forwardRef(({ data }, ref) => {


    const DateS = data.Date.split("/")

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "-9999px", 
        top: 0,
        width: "210mm",  
        height: "297mm",
        background: "white",
        padding: "40px",
        fontFamily: "Noto Sans Thai, sans-serif",
        fontSize: "14px",
        color: "#000",
        overflow: 'hidden'
      }}
    >
      <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
        <p style={{fontWeight: '600'}}>ภาพกิจกรรมพบกลุ่มเรียน ภาคเรียนที่ {data.Semester} ปีการศึกษา {data.Year}</p>
        <p>ครั้งที่  {data.Count}  วันที่  {DateS[0]}  เดือน  {DateS[1]}  พ.ศ.  {DateS[2]}</p>
        <p>สถานที่พบกลุ่มเรียน {data.Location}</p>
        <p>ชื่อครูผู้สอน {data.Teacher}</p>
      </div>
      <div style={{display: 'felx', justifyContent: 'center'}}>
      <div style={{width: '100%', height: '100%', overflow: 'hidden', display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '40px', gap: '20px'}}>
        {data.ImageActive?.map((item, index) => (
            <>
                <img src={item} width={280} height={200} style={{objectFit: 'cover'}}/>
            </>
        ))}
      </div>
      </div>

    </div>
  )
})

export default Active