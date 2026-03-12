import React, { useState, useRef, useEffect } from "react";
import stylesForminput from "./Forminput.module.css";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import Active from "../Active/Active";
import html2canvas from "html2canvas";
import { ClimbingBoxLoader } from "react-spinners";
import { MdDeleteForever } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import api from "../../../url_data.json";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { isIOS } from "react-device-detect";

function Forminput() {
  const [Semester, setSemester] = useState("");
  const [Year, setYear] = useState("");
  const [Count, setCount] = useState("");
  const [Subject, setSubject] = useState("");
  const [HeadSubject, setHeadSubject] = useState("");
  const [Teacher, setTeacher] = useState("");
  const [Date, setDate] = useState("");
  const [STime, setSTime] = useState("");
  const [Kcriteria, setKcriteria] = useState("");
  const [Kpercen, setKpercen] = useState("");
  const [Kdetail, setKdetail] = useState("");
  const [Pcriteria, setPcriteria] = useState("");
  const [Ppercen, setPpercen] = useState("");
  const [Pdetail, setPdetail] = useState("");
  const [Acriteria, setAcriteria] = useState("");
  const [Apercen, setApercen] = useState("");
  const [Adetail, setAdetail] = useState("");
  const [AllStudent, setAllStudent] = useState("");
  const [Present, setPresent] = useState("");
  const [Adsent, setAdsent] = useState("");
  const [Problem, setProblem] = useState("");
  const [Offer, setOffer] = useState("");
  const [OfferT, setOfferT] = useState("");
  const [OfferC, setOfferC] = useState("");
  const [Location, setLocation] = useState("");
  const [QrcodeImage, setQrcodeImage] = useState("");
  const [ImageTime, setImageTime] = useState(null);
  const [ImageActive, setImageActive] = useState([{ image: "", text: "" }]);
  const [loadding, setLoadding] = useState(true);
  const [sharePopup, setsharePopup] = useState(false);

  const htmlRef = useRef(null);
  const Qrcode = useRef();

  const { id } = useParams();
  const navigation = useNavigate();
  const location = useLocation();

  async function textToImg(text, maxWidth, fontSize, color = "blue") {
    const div = document.createElement("div");
    div.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: ${maxWidth}px;
            font-size: ${fontSize}px;
            font-family: 'Sarabun', sans-serif;
            color: ${color};
            word-break: break-word;
            white-space: pre-wrap;
            line-height: ${fontSize + 7}px;
            background: transparent;
        `;
    div.innerText = text || " ";
    document.body.appendChild(div);

    const canvas = await html2canvas(div, {
      scale: 2,
      backgroundColor: null,
      logging: false,
    });
    document.body.removeChild(div);
    return canvas;
  }

  async function drawTextAsImage(pdfDoc, page, text, x, y, maxWidth, fontSize) {
    if (!text || text.trim() === "") return;

    const canvas = await textToImg(text, maxWidth, fontSize);
    const imgData = canvas.toDataURL("image/png");
    const imgBytes = await fetch(imgData).then((r) => r.arrayBuffer());
    const img = await pdfDoc.embedPng(imgBytes);

    const scale = 0.5;
    const imgW = img.width * scale;
    const imgH = img.height * scale;

    page.drawImage(img, {
      x: x,
      y: y - imgH + 13.5,
      width: imgW,
      height: imgH,
    });
  }

  async function addImagesToPdf(pdfDoc, files) {
    const A4_WIDTH = 595;
    const A4_HEIGHT = 842;

    for (const file of files) {
      let bytes;
      let mimeType;

      if (typeof file === "string") {
        // กรณีเป็น URL
        const response = await fetch(file);
        const blob = await response.blob();
        bytes = await blob.arrayBuffer();
        mimeType = blob.type || inferTypeFromUrl(file);
      } else {
        // กรณีเป็น File object เดิม
        bytes = await file.arrayBuffer();
        mimeType = file.type;
      }

      let image;
      if (mimeType === "image/png") {
        image = await pdfDoc.embedPng(bytes);
      } else {
        image = await pdfDoc.embedJpg(bytes);
      }

      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      const imgWidth = image.width;
      const imgHeight = image.height;
      const ratio = Math.min(A4_WIDTH / imgWidth, A4_HEIGHT / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      page.drawImage(image, {
        x: (A4_WIDTH - width) / 2,
        y: (A4_HEIGHT - height) / 2,
        width: width,
        height: height,
      });
    }
  }

  async function generatePDF(e) {
    e.preventDefault();
    if (Date.split("/").length !== 3) {
      alert("วันที่ ควรใส่ในรูปแบบ วัน/เดือน/ปี");
      setDate("");
      return;
    }
    const confirm_ = confirm(`ถ้า "ปริ้น PDF" แล้วแบบฟอร์มนี้จะถูกลบออกทันที่ \n ❓ คุณต้องการ "ปริ้น PDF" ไหม ❓`)

    if(!confirm_) return

    setLoadding(true);

    const existingPdfBytes = await fetch("/template.pdf").then((res) =>
      res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const pages = pdfDoc.getPages();

    const fontBytes = await fetch("/Sarabun-Regular.ttf").then((res) =>
      res.arrayBuffer(),
    );
    const thaiFont = await pdfDoc.embedFont(fontBytes, { subset: false });

    const drawOpt = (x, y, size = 14) => ({
      x,
      y,
      size,
      font: thaiFont,
      color: rgb(0, 0, 1),
    });

    // pdf page 1 Head
    pages[0].drawText(Semester, drawOpt(85, 748));
    pages[0].drawText(Year, drawOpt(115, 748));
    pages[0].drawText(Count, drawOpt(232, 748));
    pages[0].drawText(Subject, drawOpt(313, 748));
    pages[0].drawText(HeadSubject, drawOpt(52, 719));
    pages[0].drawText(Teacher, drawOpt(334, 719));

    const Date_Text = Date.split("/");
    pages[0].drawText(
      `${Date_Text[0]} ${Date_Text[1]} ${Date_Text[2]}`,
      drawOpt(49, 689),
    );
    pages[0].drawText(STime, drawOpt(350, 689));

    // pdf content K
    await drawTextAsImage(pdfDoc, pages[0], Kcriteria, 211, 554.5, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Kpercen, 173, 536, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Kdetail, 48, 516, 258, 12);

    // pdf content P
    await drawTextAsImage(pdfDoc, pages[0], Pcriteria, 384, 518, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Ppercen, 500, 518, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Pdetail, 349, 501, 180, 12);

    // pdf content A
    await drawTextAsImage(pdfDoc, pages[0], Acriteria, 218, 308, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Apercen, 188, 290, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Adetail, 56, 269.5, 278, 12);

    // pdf content Number of students
    await drawTextAsImage(pdfDoc, pages[0], AllStudent, 484, 256, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Present, 484, 222, 258, 12);
    await drawTextAsImage(pdfDoc, pages[0], Adsent, 495, 181.5, 258, 12);

    // pdf page 2
    await drawTextAsImage(pdfDoc, pages[1], Problem, 69, 723, 454, 12);
    await drawTextAsImage(pdfDoc, pages[1], Offer, 69, 567, 454, 12);
    await drawTextAsImage(pdfDoc, pages[1], OfferT, 284, 386, 240, 12);
    await drawTextAsImage(pdfDoc, pages[1], OfferC, 66, 197, 450, 12);

    if (ImageTime && ImageTime.length > 0) {
      await addImagesToPdf(pdfDoc, ImageTime);
    }

    if (htmlRef.current) {
      await document.fonts.ready;
      const canvas = await html2canvas(htmlRef.current, { scale: 2, useCORS: true, allowTaint: true });
      const imgDataUrl = canvas.toDataURL("image/png");
      const imgBytes = await fetch(imgDataUrl).then((r) => r.arrayBuffer());
      const image = await pdfDoc.embedPng(imgBytes);
      const page = pdfDoc.addPage([595, 842]);
      const ratio = Math.min(595 / image.width, 842 / image.height);
      page.drawImage(image, {
        x: 0,
        y: 842 - image.height * ratio,
        width: image.width * ratio,
        height: image.height * ratio,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    if(isIOS){
        window.open(url)
    }else{
        const a = document.createElement("a");
        a.href = url;
        a.download = `บันทึกหลังการจัดการเรียนรู้${Date}.pdf`;
        a.click();
        // console.log(ImageActive);
    }
    await axios.post(api.api + "deleterecord", {SessionID: id})
    setLoadding(false);
  }

  async function saveData() {
    setLoadding(true);

    const data = {
      SessionID: id,
      Semester: Semester,
      Year: Year,
      Count: Count,
      Subject: Subject,
      HeadSubject: HeadSubject,
      Teacher: Teacher,
      Date: Date,
      STime: STime,
      Kcriteria: Kcriteria,
      Kpercen: Kpercen,
      Kdetail: Kdetail,
      Pcriteria: Pcriteria,
      Ppercen: Ppercen,
      Pdetail: Pdetail,
      Acriteria: Acriteria,
      Apercen: Apercen,
      Adetail: Adetail,
      AllStudent: AllStudent,
      Present: Present,
      Adsent: Adsent,
      Problem: Problem,
      Offer: Offer,
      OfferT: OfferT,
      OfferC: OfferC,
      Location: Location,
      ImageTime: ImageTime,
      ImageActive: ImageActive,
    };

    await axios.post(api.api + "savedata", data).then((r) => {
      console.log(r.data);
      setLoadding(false);
      alert("✅ บันทึกข้อมูลเสร็จแล้ว ✅");
    });
  }

  async function start() {
    setLoadding(true);
    await axios.post(api.api + "create").then((r) => {
      // console.log(r.data)
      setLoadding(false);
      navigation(`/record/${r.data}/`);
    });
    setsharePopup(false)
    setSemester("")
    setYear("")
    setCount("")
    setSubject("")
    setHeadSubject("")
    setTeacher("")
    setDate("")
    setSTime("")
    setKcriteria("")
    setKpercen("")
    setKdetail("")
    setPcriteria("")
    setPpercen("")
    setPdetail("")
    setAcriteria("")
    setApercen("")
    setAdetail("")
    setAllStudent("")
    setPresent("")
    setAdsent("")
    setProblem("")
    setOffer("")
    setOfferT("")
    setOfferC("")
    setLocation("")
    setImageTime(null)
    setImageActive([{ image: "", text: "" }])
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const templateData = {
    ImageActive,
    Location,
    Teacher,
    Date,
    Count,
    Year,
    Semester,
  };

  useEffect(() => {
    const getData = async () => {
        const data = {
            SessionID: id
        }
        await axios.post(api.api + "data", data).then(r => {
            console.log(r.data)
            if(r.data == "on-data"){
                setLoadding(false)
                setSemester("")
                setYear("")
                setCount("")
                setSubject("")
                setHeadSubject("")
                setTeacher("")
                setDate("")
                setSTime("")
                setKcriteria("")
                setKpercen("")
                setKdetail("")
                setPcriteria("")
                setPpercen("")
                setPdetail("")
                setAcriteria("")
                setApercen("")
                setAdetail("")
                setAllStudent("")
                setPresent("")
                setAdsent("")
                setProblem("")
                setOffer("")
                setOfferT("")
                setOfferC("")
                setLocation("")
                setImageTime(null)
                setImageActive([{ image: "", text: "" }])
                
            }else if(r.data == "on-record") {
                alert("❌ การบันทึกถูกลบไปแล้ว ❌")
                navigation("/")
                return
            }else{
            setLoadding(false)
            setSemester(String(r.data.Semester))
            setYear(String(r.data.Year))
            setCount(String(r.data.Count))
            setSubject(String(r.data.Subject))
            setHeadSubject(String(r.data.HeadSubject))
            setTeacher(String(r.data.Teacher))
            setDate(String(r.data.Date))
            setSTime(String(r.data.STime))
            setKcriteria(String(r.data.Kcriteria))
            setKpercen(String(r.data.Kpercen))
            setKdetail(String(r.data.Kdetail))
            setPcriteria(String(r.data.Pcriteria))
            setPpercen(String(r.data.Ppercen))
            setPdetail(String(r.data.Pdetail))
            setAcriteria(String(r.data.Acriteria))
            setApercen(String(r.data.Apercen))
            setAdetail(String(r.data.Adetail))
            setAllStudent(String(r.data.AllStudent))
            setPresent(String(r.data.Present))
            setAdsent(String(r.data.Adsent))
            setProblem(String(r.data.Problem))
            setOffer(String(r.data.Offer))
            setOfferT(String(r.data.OfferT))
            setOfferC(String(r.data.OfferC))
            setLocation(String(r.data.Location))
            setImageTime(r.data.ImageTime)
            setImageActive(r.data.ImageActive)
        }
        })
        }

    getData()
  }, [])

  useEffect(() => {
    if (!sharePopup) return;
    setLoadding(true);

    setTimeout(() => {
        const canvas = Qrcode.current?.querySelector("canvas");
        if (!canvas) return;

        const padding = 20;

        const newCanvas = document.createElement("canvas");
        const ctx = newCanvas.getContext("2d");

        newCanvas.width = canvas.width + padding * 2;
        newCanvas.height = canvas.height + padding * 2;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        ctx.drawImage(canvas, padding, padding);

        const url = newCanvas.toDataURL("image/png");

        setQrcodeImage(url);
        setLoadding(false);
    }, 700);
  }, [sharePopup]);

  return (
    <>
      <Active data={templateData} ref={htmlRef} />
      {loadding && ( //Loadding Icon
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            flexDirection: "column",
            color: "#fff",
            gap: "20px",
            zIndex: 999,
          }}
        >
          <ClimbingBoxLoader color="#374bff" size={22} />
          <h3>กำลังโหลดข้อมูล</h3>
        </div>
      )}
      {sharePopup && ( //Share Popup
        <div
          className=""
          style={{
            display: "felx",
            position: "fixed",
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.5)",
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            onClick={() => setsharePopup(false)}
          ></div>
          <div
            className={stylesForminput.Qrcode}
            style={{
              background: "#fff",
              padding: "10px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "5px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font3)",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              แชร์แบบฟอร์ม
            </h3>
            <div
              className={stylesForminput.content}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div ref={Qrcode}>
                <QRCodeCanvas
                  value={window.location.href}
                  size={256}
                  style={{ padding: "10px" }}
                />
              </div>
              <div
                className={stylesForminput.btn}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  marginTop: "20px",
                  gap: "20px",
                  marginLeft: "20px",
                }}
              >
                <a
                  href={window.location.href}
                  onClick={(e) => {
                    e.preventDefault();

                    const link = window.location.href;

                    if (navigator.clipboard && window.isSecureContext) {
                      navigator.clipboard
                        .writeText(link)
                        .then(() => {
                          alert("คัดลอกลิงก์เรียบร้อย ✅");
                        })
                        .catch(() => {
                          alert("ไม่สามารถคัดลอกได้ ❌");
                        });
                    } else {
                      const textarea = document.createElement("textarea");
                      textarea.value = link;
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textarea);
                      alert("คัดลอกลิงก์เรียบร้อย ✅");
                    }
                  }}
                  className="btn btn-success fw-bold"
                >
                  คัดลอกลิ้งค์ 📄
                </a>
                <a
                  href={QrcodeImage}
                  download={`qrcode ${Date}`}
                  className="btn btn-warning fw-bold"
                >
                  โหลดรุปQrocde
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar navbar-dark bg-dark sticky-top">
        <div className="container-fluid d-flex">
          <h3 className="text-primary">RecordStudy</h3>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      <div
        className="collapse sticky-top"
        id="navbarToggleExternalContent"
        data-bs-theme="dark"
      >
        <div className="bg-dark p-4 d-flex flex-column w-100 ">
          <button
            className="navbar-toggler align-self-end fs-4"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul>
            <li>
              <a
                href="#header"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                หัวข้อ
              </a>
            </li>
            <li>
              <a
                href="#k"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                ด้านความรู้
              </a>
            </li>
            <li>
              <a
                href="#p"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                ด้านทักษะกระบวนการ
              </a>
            </li>
            <li>
              <a
                href="#a"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                ด้านคุณลักษณะอันพึงประสงค์
              </a>
            </li>
            <li>
              <a
                href="#all"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                จำนวนผู้เรียน
              </a>
            </li>
            <li>
              <a
                href="#problem"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                ปัญหา/อุปสรรค
              </a>
            </li>
            <li>
              <a
                href="#offer"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                ข้อเสนอแนะ/แนวทางแก้ไข
              </a>
            </li>
            <li>
              <a
                href="#offerT"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                ข้อเสนอของนายทะเบียน
              </a>
            </li>
            <li>
              <a
                href="#offerC"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                ข้อเสนอแนะของผู้บริหาร
              </a>
            </li>
            <li>
              <a
                href="#imageTime"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                แนบรูปบัญชีลงเวลาพบกลุ่มเรียน
              </a>
            </li>
            <li>
              <a
                href="#imageActive"
                className="nav-link text-light mb-2 border-bottom border-3 rounded-end "
              >
                แนบรูปภาพกิจกรรมพบกลุ่มเรียน
              </a>
            </li>
            <button
              className="btn btn-outline-warning mt-2 fw-bold"
              onClick={start}
              data-bs-toggle="collapse"
              data-bs-target="#navbarToggleExternalContent"
              aria-controls="navbarToggleExternalContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              สร้างบันทึกใหม่
            </button>
          </ul>
        </div>
      </div>
      <div className={stylesForminput.container}>
        <div className={stylesForminput.content}>
          <h1 id="header">บันทึกหลังการจัดการเรียนรู้</h1>
          <form className={stylesForminput.form} onSubmit={generatePDF}>
            <div className={stylesForminput.form_input}>
              <div className={stylesForminput._input}>
                <p>ภาคเรียนที่</p>
                <input
                  type="number"
                  placeholder="ภาคเรียนที่"
                  value={Semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>ปีการศึกษา</p>
                <input
                  type="number"
                  placeholder="ปีการศึกษา"
                  value={Year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>ครั้งที่</p>
                <input
                  type="number"
                  placeholder="ครั้งที่"
                  value={Count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>วิชา</p>
                <input
                  type="text"
                  placeholder="วิชา"
                  value={Subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>เรื่อง</p>
                <input
                  type="text"
                  placeholder="เรื่อง"
                  value={HeadSubject}
                  onChange={(e) => setHeadSubject(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>ครูผู้สอน</p>
                <input
                  type="text"
                  placeholder="ครูผู้สอน"
                  value={Teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>วันที่ในรูปแบบ (วัน/เดือน/ปี)</p>
                <input
                  type="text"
                  placeholder="วันที่ในรูปแบบ (วัน/เดือน/ปี)"
                  value={Date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>เวลาเรียน</p>
                <input
                  type="text"
                  placeholder="เวลาเรียน"
                  value={STime}
                  onChange={(e) => setSTime(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="k">ด้านความรู้ (K)</h3>
              <div className={stylesForminput._input}>
                <p>ผ่านเกณฑ์การประเมินจำนวนกี่คน</p>
                <input
                  type="number"
                  placeholder="จำนวนคน"
                  value={Kcriteria}
                  onChange={(e) => setKcriteria(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>คิดเป็นร้อยละ</p>
                <input
                  type="number"
                  step="0.1"
                  placeholder="ร้อยละ"
                  value={Kpercen}
                  onChange={(e) => setKpercen(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>ความรู้</p>
                <input
                  type="text"
                  placeholder="ความรู้"
                  value={Kdetail}
                  onChange={(e) => setKdetail(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="p">ด้านทักษะกระบวนการ (P)</h3>
              <div className={stylesForminput._input}>
                <p>ผ่านเกณฑ์การประเมินจำนวนกี่คน</p>
                <input
                  type="number"
                  placeholder="จำนวนคน"
                  value={Pcriteria}
                  onChange={(e) => setPcriteria(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>คิดเป็นร้อยละ</p>
                <input
                  type="number"
                  step="0.1"
                  placeholder="ร้อยละ"
                  value={Ppercen}
                  onChange={(e) => setPpercen(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>ทักษะกระบวนการ</p>
                <input
                  type="text"
                  placeholder="ทักษะกระบวนการ"
                  value={Pdetail}
                  onChange={(e) => setPdetail(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="a">ด้านคุณลักษณะอันพึงประสงค์ (A)</h3>
              <div className={stylesForminput._input}>
                <p>ผ่านเกณฑ์การประเมินจำนวนกี่คน</p>
                <input
                  type="number"
                  step="0.1"
                  placeholder="จำนวนคน"
                  value={Acriteria}
                  onChange={(e) => setAcriteria(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>คิดเป็นร้อยละ</p>
                <input
                  type="number"
                  placeholder="ร้อยละ"
                  value={Apercen}
                  onChange={(e) => setApercen(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>คุณลักษณะอันพึงประสงค์</p>
                <input
                  type="text"
                  placeholder="คุณลักษณะอันพึงประสงค์"
                  value={Adetail}
                  onChange={(e) => setAdetail(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="all">จำนวนผู้เรียน</h3>
              <div className={stylesForminput._input}>
                <p>จำนวนผู้เรียนทั้งหมดกี่คน</p>
                <input
                  type="number"
                  placeholder="จำนวนผู้เรียนทั้งหมด"
                  value={AllStudent}
                  onChange={(e) => setAllStudent(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>พบกลุ่มเรียนกี่คน</p>
                <input
                  type="number"
                  placeholder="จำนวนพบกลุ่มเรียน"
                  value={Present}
                  onChange={(e) => setPresent(e.target.value)}
                />
              </div>
              <div className={stylesForminput._input}>
                <p>ขาดพบกลุ่มเรียนกี่คน</p>
                <input
                  type="number"
                  placeholder="จำนวนขาดพบกลุ่มเรียน"
                  value={Adsent}
                  onChange={(e) => setAdsent(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="problem">ปัญหา/อุปสรรค</h3>
              <div className={stylesForminput._input}>
                <p>ปัญหา/อุปสรรค</p>
                <input
                  type="text"
                  placeholder="ปัญหา/อุปสรรค"
                  value={Problem}
                  onChange={(e) => setProblem(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="offer">ข้อเสนอแนะ/แนวทางแก้ไข</h3>
              <div className={stylesForminput._input}>
                <p>ข้อเสนอแนะ/แนวทางแก้ไข</p>
                <input
                  type="text"
                  placeholder="ข้อเสนอแนะ/แนวทางแก้ไข"
                  value={Offer}
                  onChange={(e) => setOffer(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="offerT">ข้อเสนอของนายทะเบียน</h3>
              <div className={stylesForminput._input}>
                <p>ข้อเสนอแนะของนายทะเบียน</p>
                <input
                  type="text"
                  placeholder="ข้อเสนอแนะของนายทะเบียน"
                  value={OfferT}
                  onChange={(e) => setOfferT(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="offerC">ข้อเสนอแนะของผู้บริหาร</h3>
              <div className={stylesForminput._input}>
                <p>ข้อเสนอแนะของผู้บริหาร</p>
                <input
                  type="text"
                  placeholder="ข้อเสนอแนะของผู้บริหาร"
                  value={OfferC}
                  onChange={(e) => setOfferC(e.target.value)}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="imageTime">แนบรูปบัญชีลงเวลาพบกลุ่มเรียน</h3>
              <div className={stylesForminput._input}>
                <p>แนบรูปบัญชีลงเวลาพบกลุ่มเรียน (ถ่ายรูปแนวตั้ง)</p>
                <input
                  type="file"
                  multiple
                  placeholder="แนวรูปบัญชีลงเวลาพบกลุ่มเรียน"
                  onChange={(e) => {
                    let image = [];
                    for (const file of e.target.files) {
                      const render = new FileReader();
                      render.readAsDataURL(file);
                      render.onload = (e) => {
                        image.push(e.target.result);
                      };
                    }
                    setImageTime(image);
                  }}
                />
              </div>
            </div>
            <div className={stylesForminput.form_input}>
              <h3 id="imageActive">แนบรูปภาพกิจกรรมพบกลุ่มเรียน</h3>
              <div className={stylesForminput._input}>
                <p>สถานที่พบกลุ่มเรียน</p>
                <input
                  type="text"
                  placeholder="สถานที่พบกลุ่มเรียน"
                  value={Location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              {/* <div className={stylesForminput._input}>
                        <p>แนวรูปภาพกิจกรรมพบกลุ่มเรียน (สูงสุด 4 รูป)</p>
                        <input type="file" multiple accept="image/*" placeholder='แนวรูปภาพกิจกรรมพบกลุ่มเรียน' onChange={(e) => {
                            const files = Array.from(e.target.files)
                            const urls = files.map(file => URL.createObjectURL(file))
                            setImageActive(urls)
                            if (e.target.files.length > 4) {
                                alert("อัปโหลดได้ไม่เกิน 4 รูป")
                                e.target.value = ""
                                return
                            }
                        }}/>
                    </div> */}
              <div className={stylesForminput._input}>
                <p>เพิ่มรูปกิจกรรม</p>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    ImageActive.length < 4
                      ? setImageActive([
                          ...ImageActive,
                          { image: "", text: "" },
                        ])
                      : alert("สูงสุดได้ 4 รูปภาพ");
                  }}
                >
                  + เพิ่มรูปภาพ
                </button>
                {[...ImageActive].reverse().map((item, index) => {
                  return (
                    <>
                      <div className={stylesForminput.input} key={index}>
                        <div className="">
                          <MdDeleteForever
                            color="red"
                            size={20}
                            style={{ cursor: "pointer", marginBottom: 10 }}
                            onClick={() => {
                              setImageActive(
                                ImageActive.filter((item, i) => i != index),
                              );
                            }}
                          />
                        </div>
                        <div className="">
                          <p>ใส่รูปกิจกรรม</p>
                          <input
                            type="file"
                            onChange={(e) => {
                              if (!e.target.files[0]) return;
                              const render = new FileReader();
                              render.readAsDataURL(e.target.files[0]);
                              const newItems = [...ImageActive];
                              render.onload = (e) => {
                                newItems[index].image = e.target.result;
                                setImageActive(newItems);
                              };
                            }}
                          />
                        </div>
                        <div className="">
                          <p>คำอธิบาย</p>
                          <input
                            type="text"
                            placeholder="คำอธิบายใต้ภาพ"
                            value={ImageActive[index].text}
                            onChange={(e) => {
                              const newItem = [...ImageActive];
                              newItem[index].text = e.target.value;
                              setImageActive(newItem);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <div style={{ width: "100%" }} className="d-flex gap-2">
              <button
                type="button"
                onClick={saveData}
                className="btn btn-outline-success border-2 flex-fill col-5 fw-bold "
              >
                บันทึกข้อมูล 📝
              </button>
              <button
                type="submit"
                className="btn btn-outline-warning border-2 flex-fill col-5 fw-bold"
              >
                ปริ้นPDF 📄
              </button>
              <button
                type="button"
                className="btn btn-outline-primary border-2 flex-fill fw-bold"
                onClick={() => setsharePopup(true)}
              >
                <FaShareAlt />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Forminput;
