import QRCode from "qrcode.react";

const QRCodeModal = ({ transactionId, userId, onClose }) => {
  console.log("QRCodeModal Props:", { transactionId, userId, onClose });

  if (!transactionId || !userId) {
    console.log("QRCodeModal returning null: transactionId or userId is missing");
    return null;
  }

  const qrData = `${transactionId}.${userId}`;
  console.log("QRCodeModal qrData:", qrData);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg w-[300px] h-[300px] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <QRCode value="TXN_1742931061106_rqljkv.User_001" size={250} />
      </div>
    </div>
  );
};

export default QRCodeModal;