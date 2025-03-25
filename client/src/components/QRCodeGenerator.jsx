"use client";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

const QRCodeGenerator = ({
  bookName = "Book Title",
  bookId = "BOOKID",
  logoPath = "/ExpandedLogo-Darkmode.png", // Ensure the logo is in your public folder
}) => {
  const canvasRef = useRef(null);
  const qrRef = useRef(null);
  const [finalImageUrl, setFinalImageUrl] = useState(null);

  // Helper function to wrap text within maxWidth.
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
    const CANVAS_HEIGHT = 900;

    // 1) Fill the entire canvas with a black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2) White card dimensions & position (520x720) centered horizontally
    const cardWidth = 520;
    const cardHeight = 720;
    const cardX = (CANVAS_WIDTH - cardWidth) / 2; // centers horizontally
    const cardY = 10; // vertical offset for the card
    const radius = 25;

    // Draw white rounded rectangle for the card
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

    // 3) Draw the book title inside the card with proper wrapping
    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    const cardPadding = 40;
    const textX = cardX + cardWidth / 2;
    const textY = cardY + cardPadding;
    const maxTextWidth = cardWidth - cardPadding * 2;
    const lineHeight = 36;
    const numLines = wrapText(ctx, bookName, textX, textY, maxTextWidth, lineHeight);

    // 4) Draw the QR code inside the card below the title
    // Use a margin of 20px after the title.
    const qrMarginTop = 20;
    const qrY = textY + numLines * lineHeight + qrMarginTop;
    const qrSize = 480; // slightly smaller than the card width
    const qrX = cardX + (cardWidth - qrSize) / 2;
    const qrDataUrl = qrRef.current.toDataURL("image/png");
    const qrImage = new Image();
    qrImage.src = qrDataUrl;
    qrImage.onload = () => {
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // 5) Draw the book ID below the QR code with a margin of 20px
      ctx.fillStyle = "#000000";
      ctx.font = "bold 28px Arial";
      const idMarginTop = 60;
      const idY = qrY + qrSize + idMarginTop ;
      ctx.fillText(bookId, cardX + cardWidth / 2, idY);

      // 6) Load and draw the logo below the white card
      const logoImg = new Image();
      logoImg.src = logoPath;
      logoImg.onload = () => {
        // Draw logo 10px below the card, set to be 520px wide (same as card width)
        const logoX = (CANVAS_WIDTH - cardWidth) / 2;
        const logoY = cardY + cardHeight + 10;
        // Adjust logo height proportionally or set a fixed height; here we use 136px
        ctx.drawImage(logoImg, logoX, logoY, cardWidth, 136);

        // 7) Save the final image and update state
        const dataUrl = canvas.toDataURL("image/png");
        setFinalImageUrl(dataUrl);
      };
      logoImg.onerror = () => {
        const dataUrl = canvas.toDataURL("image/png");
        setFinalImageUrl(dataUrl);
      };
    };
  };

  // Generate image when component mounts
  useEffect(() => {
    generateImage();
  }, []);

  // Automatically trigger download when final image URL is available
  useEffect(() => {
    if (finalImageUrl) {
      downloadImage();
    }
  }, [finalImageUrl]);

  // Download function for manual trigger
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
      {/* Hidden main canvas for composing the final image */}
      <canvas ref={canvasRef} width={550} height={900} style={{ display: "none" }} />
      {/* Hidden QR code canvas rendered off-screen */}
      <QRCodeCanvas ref={qrRef} value={bookId} size={500} style={{ display: "none" }} />

      {/* Display the generated image */}
      {finalImageUrl && (
        <img
          src={finalImageUrl}
          alt="Generated QR Code"
          style={{ borderRadius: "25px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}
        />
      )}

      {/* Button to manually trigger download */}
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