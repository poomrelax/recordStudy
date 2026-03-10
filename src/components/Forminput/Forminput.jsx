import React, { useState, useEffect, forwardRef, useRef } from 'react'
import stylesForminput from './Forminput.module.css'
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit"
import Active from '../Active/Active';
import html2canvas from "html2canvas"
import { ClimbingBoxLoader } from 'react-spinners'

function Forminput() {

    const [Semester, setSemester] = useState("")
    const [Year, setYear] = useState("")
    const [Count, setCount] = useState("")
    const [Subject, setSubject] = useState("")
    const [HeadSubject, setHeadSubject] = useState("")
    const [Teacher, setTeacher] = useState("")
    const [Date, setDate] = useState("")
    const [STime, setSTime] = useState("")
    const [Kcriteria, setKcriteria] = useState("")
    const [Kpercen, setKpercen] = useState("")
    const [Kdetail, setKdetail] = useState("")
    const [Pcriteria, setPcriteria] = useState("")
    const [Ppercen, setPpercen] = useState("")
    const [Pdetail, setPdetail] = useState("")
    const [Acriteria, setAcriteria] = useState("")
    const [Apercen, setApercen] = useState("")
    const [Adetail, setAdetail] = useState("")
    const [AllStudent, setAllStudent] = useState("")
    const [Present, setPresent] = useState("")
    const [Adsent, setAdsent] = useState("")
    const [Problem, setProblem] = useState("")
    const [Offer, setOffer] = useState("")
    const [OfferT, setOfferT] = useState("")
    const [OfferC, setOfferC] = useState("")
    const [Location, setLocation] = useState("")
    const [ImageTime, setImageTime] = useState(null)
    const [ImageActive, setImageActive] = useState([])
    const [loadding, setLoadding] = useState(false)

    const htmlRef = useRef(null)

    function TextInBox(page, text, x, y, maxWidth, font, size, color) {

    text = text.normalize("NFC");

    let words = Array.from(text);

    let line = "";
    let lines = [];

    for (let i = 0; i < words.length; i++) {

        const testLine = line + words[i];

        const width = font.widthOfTextAtSize(testLine, size);

        if (width > maxWidth) {
            lines.push(line);
            line = words[i];
        } else {
            line = testLine;
        }

    }

    lines.push(line);

    const lineHeight = size + 7;

    lines.forEach((l, index) => {
        page.drawText(l, {
        x: x,
        y: y - (index * lineHeight),
        size: size,
        font: font,
        color: color
        });
    });

    }

    async function addImagesToPdf(pdfDoc, files) {

        const A4_WIDTH = 595
        const A4_HEIGHT = 842

        for (const file of files) {

        const bytes = await file.arrayBuffer()

        let image

        if (file.type === "image/png") {
            image = await pdfDoc.embedPng(bytes)
        } else {
            image = await pdfDoc.embedJpg(bytes)
        }

        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])

        const imgWidth = image.width
        const imgHeight = image.height

        const ratio = Math.min(
            A4_WIDTH / imgWidth,
            A4_HEIGHT / imgHeight
        )

        const width = imgWidth * ratio
        const height = imgHeight * ratio

        page.drawImage(image, {
            x: (A4_WIDTH - width) / 2,
            y: (A4_HEIGHT - height) / 2,
            width: width,
            height: height
        })

        }

    }

    async function generatePDF(e) {

        e.preventDefault()
        console.log("start")
        setLoadding(true)

        const existingPdfBytes = await fetch("/template.pdf")
            .then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        pdfDoc.registerFontkit(fontkit)

        const pages = pdfDoc.getPages();

        const fontBytes = await fetch("/NotoSansThai-Regular.ttf")
        .then(res => res.arrayBuffer())

        const thaiFont = await pdfDoc.embedFont(fontBytes)

        
        // const { width, height } = pages[0].getSize();
        // console.log(height);
        
        // pdf page 1 Head
        pages[0].drawText(Semester, {
            x: 85,
            y: 748,
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });
        pages[0].drawText(Year, {
            x: 115,
            y: 748,
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });
        pages[0].drawText(Count, {
            x: 232,
            y: 748,
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });
        pages[0].drawText(Subject, {
            x: 313,
            y: 748,
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });
        pages[0].drawText(HeadSubject, {
            x: 52,
            y: 719, // 849 - 116
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });
        pages[0].drawText(Teacher, {
            x: 334,
            y: 719, 
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });

        const Date_Text = Date.split("/")
        pages[0].drawText(`${Date_Text[0]} ${Date_Text[1]} ${Date_Text[2]}`, {
            x: 49,
            y: 689, 
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });
        pages[0].drawText(STime, {
            x: 350,
            y: 689, 
            size: 14,
            font: thaiFont,
            color: rgb(0,0,1)
        });

        //pdf content K
        TextInBox(pages[0], Kcriteria, 211, 554.5, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Kpercen, 173, 536, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Kdetail, 48, 516, 258, thaiFont, 12, rgb(0,0,1))

        //pdf content P
        TextInBox(pages[0], Pcriteria, 384, 518, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Ppercen, 500, 518, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Pdetail, 349, 501, 180, thaiFont, 12, rgb(0,0,1))

        //pdf content A
        TextInBox(pages[0], Acriteria, 218, 308, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Apercen, 188, 290, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Adetail, 56, 269.5, 278, thaiFont, 12, rgb(0,0,1))

        //pdf content Number of students
        TextInBox(pages[0], AllStudent, 484, 256, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Present, 484, 222, 258, thaiFont, 12, rgb(0,0,1))
        TextInBox(pages[0], Adsent, 495, 181.5, 258, thaiFont, 12, rgb(0,0,1))

        // pdf page 2 Head

        //pdf content Problem
        TextInBox(pages[1], Problem.normalize("NFC"), 69, 723, 454, thaiFont, 12, rgb(0,0,1))

        //pdf content Offer
        TextInBox(pages[1], Offer.normalize("NFC"), 69, 567, 454, thaiFont, 12, rgb(0,0,1))

        //pdf content OfferT
        TextInBox(pages[1], OfferT.normalize("NFC"), 284, 386, 240, thaiFont, 12, rgb(0,0,1))

        //pdf content OfferC
        TextInBox(pages[1], OfferC.normalize("NFC"), 66, 197, 450, thaiFont, 12, rgb(0,0,1))

        if (ImageTime && ImageTime.length > 0) {
            await addImagesToPdf(pdfDoc, ImageTime)
        }
        
        if (htmlRef.current) {
        await document.fonts.ready 
        const canvas = await html2canvas(htmlRef.current, { scale: 2 })
        const imgDataUrl = canvas.toDataURL("image/png")
        const imgBytes = await fetch(imgDataUrl).then(r => r.arrayBuffer())
        const image = await pdfDoc.embedPng(imgBytes)

        const page = pdfDoc.addPage([595, 842])  // A4
        const ratio = Math.min(595 / image.width, 842 / image.height)
        page.drawImage(image, {
            x: 0,
            y: 842 - image.height * ratio,
            width: image.width * ratio,
            height: image.height * ratio,
        })
        }

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a")
        a.href = url
        a.download = `บันทึกหลังการจัดการเรียนรู้ ${Date}`
        a.click()
        setLoadding(false)
    }

    const templateData = {
        ImageActive, Location, Teacher, Date, Count, Year, Semester 
    }

  return (
    <>
    <Active data={templateData} ref={htmlRef}/>
    {loadding && (
        <div style={{position: 'fixed', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column', color: '#fff', gap: '20px'}}>
            <ClimbingBoxLoader color='#374bff' size={22}/>
            <h3>กำลังโหลดข้อมูล</h3>
        </div>
    )}
    <div className={stylesForminput.container}>
      <div className={stylesForminput.content}>
        <h1>บันทึกหลังการจัดการเรียนรู้</h1>
        <form className={stylesForminput.form} onSubmit={generatePDF}>
            <div className={stylesForminput.form_input}> {/*Input Head*/}
                <div className={stylesForminput._input}>
                    <p>ภาคเรียนที่</p>
                    <input type="number" placeholder='ภาคเรียนที่' value={Semester} onChange={(e) => setSemester(e.target.value)} required/>
                </div>
                <div className={stylesForminput._input}>
                    <p>ปีการศึกษา</p>
                    <input type="number" placeholder='ปีการศึกษา' value={Year} onChange={(e) => setYear(e.target.value)} required/>
                </div>
                <div className={stylesForminput._input}>
                    <p>ครั้งที่</p>
                    <input type="number" placeholder='ครั้งที่' value={Count} onChange={(e) => setCount(e.target.value)} required/>
                </div>
                <div className={stylesForminput._input}>
                    <p>วิชา</p>
                    <input type="text" placeholder='วิชา' value={Subject} onChange={(e) => setSubject(e.target.value)} required/>
                </div>
                <div className={stylesForminput._input}>
                    <p>เรื่อง</p>
                    <input type="text" placeholder='เรื่อง' value={HeadSubject} onChange={(e) => setHeadSubject(e.target.value)} required/>
                </div>
                <div className={stylesForminput._input}>
                    <p>ครูผู้สอน</p>
                    <input type="text" placeholder='ครูผู้สอน' value={Teacher} onChange={(e) => setTeacher(e.target.value)} required/>
                </div>
                <div className={stylesForminput._input}>
                    <p>วันที่ในรูปแบบ (วัน/เดือน/ปี)</p>
                    <input type="text" placeholder='วันที่ในรูปแบบ (วัน/เดือน/ปี)' value={Date} onChange={(e) => setDate(e.target.value)} required/>
                </div>
                <div className={stylesForminput._input}>
                    <p>เวลาเรียน</p>
                    <input type="text" placeholder='เวลาเรียน' value={STime} onChange={(e) => setSTime(e.target.value)} required/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*ด้านความรู้*/}
                <h3>ด้านความรู้ (K)</h3>
                <div className={stylesForminput._input}>
                    <p>ผ่านเกณฑ์การประเมินจำนวนกี่คน</p>
                    <input type="number" placeholder='จำนวนคน' value={Kcriteria} onChange={(e) => setKcriteria(e.target.value)} />
                </div>
                <div className={stylesForminput._input}>
                    <p>คิดเป็นร้อยละ</p>
                    <input type="number" step="0.1" placeholder='ร้อยละ' value={Kpercen} onChange={(e) => setKpercen(e.target.value)} />
                </div>
                <div className={stylesForminput._input}>
                    <p>ความรู้</p>
                    <input type="text" placeholder='ความรู้' value={Kdetail} onChange={(e) => setKdetail(e.target.value)} />
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*ด้านทักษะกระบวนการ*/}
                <h3>ด้านทักษะกระบวนการ (P)</h3>
                <div className={stylesForminput._input}>
                    <p>ผ่านเกณฑ์การประเมินจำนวนกี่คน</p>
                    <input type="number" placeholder='จำนวนคน' value={Pcriteria} onChange={(e) => setPcriteria(e.target.value)}/>
                </div>
                <div className={stylesForminput._input}>
                    <p>คิดเป็นร้อยละ</p>
                    <input type="number" step="0.1" placeholder='ร้อยละ' value={Ppercen} onChange={(e) => setPpercen(e.target.value)}/>
                </div>
                <div className={stylesForminput._input}>
                    <p>ทักษะกระบวนการ</p>
                    <input type="text" placeholder='ทักษะกระบวนการ' value={Pdetail} onChange={(e) => setPdetail(e.target.value)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*ด้านคุณลักษณะอันพึงประสงค์*/}
                <h3>ด้านคุณลักษณะอันพึงประสงค์ (A)</h3>
                <div className={stylesForminput._input}>
                    <p>ผ่านเกณฑ์การประเมินจำนวนกี่คน</p>
                    <input type="number" step="0.1" placeholder='จำนวนคน' value={Acriteria} onChange={(e) => setAcriteria(e.target.value)}/>
                </div>
                <div className={stylesForminput._input}>
                    <p>คิดเป็นร้อยละ</p>
                    <input type="number" placeholder='ร้อยละ' value={Apercen} onChange={(e) => setApercen(e.target.value)}/>
                </div>
                <div className={stylesForminput._input}>
                    <p>คุณลักษณะอันพึงประสงค์</p>
                    <input type="text" placeholder='คุณลักษณะอันพึงประสงค์' value={Adetail} onChange={(e) => setAdetail(e.target.value)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*จำนวนผู้เรียน*/}
                <h3>จำนวนผู้เรียน</h3>
                <div className={stylesForminput._input}>
                    <p>จำนวนผู้เรียนทั้งหมดกี่คน</p>
                    <input type="number" placeholder='จำนวนผู้เรียนทั้งหมด' value={AllStudent} onChange={(e) => setAllStudent(e.target.value)}/>
                </div>
                <div className={stylesForminput._input}>
                    <p>พบกลุ่มเรียนกี่คน</p>
                    <input type="number" placeholder='จำนวนพบกลุ่มเรียน' value={Present} onChange={(e) => setPresent(e.target.value)}/>
                </div>
                <div className={stylesForminput._input}>
                    <p>ขาดพบกลุ่มเรียนกี่คน</p>
                    <input type="number" placeholder='จำนวนขาดพบกลุ่มเรียน' value={Adsent} onChange={(e) => setAdsent(e.target.value)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*ปัญหา/อุปสรรค*/}
                <h3>ปัญหา/อุปสรรค</h3>
                <div className={stylesForminput._input}>
                    <p>ปัญหา/อุปสรรค</p>
                    <input type="text" placeholder='ปัญหา/อุปสรรค' value={Problem} onChange={(e) => setProblem(e.target.value)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*ข้อเสนอแนะ/แนวทางแก้ไข*/}
                <h3>ข้อเสนอแนะ/แนวทางแก้ไข</h3>
                <div className={stylesForminput._input}>
                    <p>ข้อเสนอแนะ/แนวทางแก้ไข</p>
                    <input type="text" placeholder='ข้อเสนอแนะ/แนวทางแก้ไข' value={Offer} onChange={(e) => setOffer(e.target.value)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*ข้อเสนอของนายทะเบียน*/}
                <h3>ข้อเสนอของนายทะเบียน</h3>
                <div className={stylesForminput._input}>
                    <p>ข้อเสนอแนะของนายทะเบียน</p>
                    <input type="text" placeholder='ข้อเสนอแนะของนายทะเบียน' value={OfferT} onChange={(e) => setOfferT(e.target.value)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*ข้อเสนอแนะของผู้บริหาร*/}
                <h3>ข้อเสนอแนะของผู้บริหาร</h3>
                <div className={stylesForminput._input}>
                    <p>ข้อเสนอแนะของผู้บริหาร</p>
                    <input type="text" placeholder='ข้อเสนอแนะของผู้บริหาร' value={OfferC} onChange={(e) => setOfferC(e.target.value)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*แนวรูปบัญชีลงเวลาพบกลุ่มเรียน*/}
                <h3>แนวรูปบัญชีลงเวลาพบกลุ่มเรียน</h3>
                <div className={stylesForminput._input}>
                    <p>แนวรูปบัญชีลงเวลาพบกลุ่มเรียน</p>
                    <input type="file" multiple placeholder='แนวรูปบัญชีลงเวลาพบกลุ่มเรียน' onChange={(e) => setImageTime(e.target.files)}/>
                </div>
            </div>
            <div className={stylesForminput.form_input}> {/*แนวรูปภาพกิจกรรมพบกลุ่มเรียน*/}
                <h3>แนวรูปภาพกิจกรรมพบกลุ่มเรียน</h3>
                <div className={stylesForminput._input}>
                    <p>แนวรูปภาพกิจกรรมพบกลุ่มเรียน (สูงสุด 6 รูป)</p>
                    <input type="file" multiple accept="image/*" placeholder='แนวรูปภาพกิจกรรมพบกลุ่มเรียน' onChange={(e) => {const files = Array.from(e.target.files); const urls = files.map(file => URL.createObjectURL(file)); setImageActive(urls); if(e.target.files.length > 8){alert("อัปโหลดได้ไม่เกิน 8 รูป"); e.target.value = ""; return; }}}/>
                </div>
                <div className={stylesForminput._input}>
                    <p>สถานที่พบกลุ่มเรียน</p>
                    <input type="text" multiple placeholder='สถานที่พบกลุ่มเรียน' value={Location} onChange={(e) => setLocation(e.target.value)}/>
                </div>
            </div>
            <button type="submit" >บันทึก</button>
        </form>
      </div>
    </div>
    </>
  )
}

export default Forminput