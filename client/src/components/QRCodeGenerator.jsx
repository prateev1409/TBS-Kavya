"use client";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

const QRCodeGenerator = ({
  bookName = "Book Title",
  bookId = "BOOKID",
  logoPath = "/ExpandedLogo-Darkmode.png",
}) => {
  const canvasRef = useRef(null);
  const qrRef = useRef(null);
  const [finalImageUrl, setFinalImageUrl] = useState(null);

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].trim(), x, y + i * lineHeight);
    }
    return lines.length;
  };

  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const CANVAS_WIDTH = 550;
    const CANVAS_HEIGHT = 550;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const cardWidth = 520;
    const cardHeight = 520;
    const cardX = (CANVAS_WIDTH - cardWidth) / 2;
    const cardY = 10;
    const radius = 25;

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(cardX + radius, cardY);
    ctx.lineTo(cardX + cardWidth - radius, cardY);
    ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius);
    ctx.lineTo(cardX + cardWidth, cardY + cardHeight - radius);
    ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - radius, cardY + cardHeight);
    ctx.lineTo(cardX + radius, cardY + cardHeight);
    ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - radius);
    ctx.lineTo(cardX, cardY + radius);
    ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
    ctx.closePath();
    ctx.fill();

    /*ctx.fillStyle = "#000000";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    const cardPadding = 40;
    const textX = cardX + cardWidth / 2;
    const textY = cardY + cardPadding;
    const maxTextWidth = cardWidth - cardPadding * 2;
    const lineHeight = 36;
    const numLines = wrapText(ctx, bookName, textX, textY, maxTextWidth, lineHeight);*/

    const qrMarginTop = 30;
    const qrY = qrMarginTop;
    const qrSize = 480;
    const qrX = cardX + (cardWidth - qrSize) / 2;
    const qrDataUrl = qrRef.current.toDataURL("image/png");
    const qrImage = new Image();
    qrImage.src = qrDataUrl;
    qrImage.onload = () => {
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      /*ctx.fillStyle = "#000000";
      ctx.font = "bold 28px Arial";
      const idMarginTop = 60;
      const idY = qrY + qrSize + idMarginTop;
      ctx.fillText(bookId, cardX + cardWidth / 2, idY);*/

      /*const logoImg = new Image();
      logoImg.src = logoPath;
      logoImg.onload = () => {
        const logoX = (CANVAS_WIDTH - cardWidth) / 2;
        const logoY = cardY + cardHeight + 10;
        ctx.drawImage(logoImg, logoX, logoY, cardWidth, 136);

        const dataUrl = canvas.toDataURL("image/png");
        setFinalImageUrl(dataUrl);
      };*/
      //logoImg.onerror = () => {
        const dataUrl = canvas.toDataURL("image/png");
        setFinalImageUrl(dataUrl);
     // };
    };
  };

  useEffect(() => {
    generateImage();
  }, []);

  /*useEffect(() => {
    if (finalImageUrl) {
      downloadImage();
    }
  }, [finalImageUrl]);*/

  const downloadImage = () => {
    if (finalImageUrl) {
      const link = document.createElement("a");
      link.download = `${bookId}.png`;
      link.href = finalImageUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} width={550} height={550} style={{ display: "none" }} />
      <QRCodeCanvas ref={qrRef} value={bookId} size={500} style={{ display: "none" }} />

      {finalImageUrl && (
        <img
          src={finalImageUrl}
          alt="Generated QR Code"
          style={{ borderRadius: "25px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}
        />
      )}

      <button
        onClick={downloadImage}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeGenerator;