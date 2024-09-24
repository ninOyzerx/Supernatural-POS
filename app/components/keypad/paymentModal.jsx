import { CreditCard, X ,Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

export default function PaymentModal({ 
  amount, 
  setAmount, 
  handleNumberClick, 
  handleClear, 
  handleQuickAmount, 
  isModalOpen, 
  closeModal,
  totalWithVAT,
  totalPrice,
  selectedProducts // Receive selected products
}) {
  const [showModal, setShowModal] = useState(isModalOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false); 
  const [change, setChange] = useState(0); 
  const [date] = useState(new Date().toLocaleString()); 
  const [subtotal, setSubtotal] = useState(totalWithVAT); 
  const [paymentMethod] = useState('เงินสด');
  
  const [paymentData, setPaymentData] = useState(null); 

  const calculatedTotalPrice = totalPrice; 

  useEffect(() => {
    if (isModalOpen) {
      setShowModal(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isModalOpen]);

  const handleFullPayment = () => {
    setAmount(totalWithVAT.toFixed(2));
  };

  const formatTransactionId = (uuid) => {
    const segments = uuid.split('-'); 
    return `${segments[0].substring(0, 5)}-${segments[1].substring(0, 5)}-${segments[2].substring(0, 5)}-${segments[3].substring(0, 5)}`;
  };

  const [transactionId] = useState(formatTransactionId(uuidv4())); // Create transaction ID

  const handlePayment = async () => {
    const parsedAmount = parseFloat(amount);
    
    // Validate input amount
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        Swal.fire({
            title: 'ผิดพลาด!',
            text: 'กรุณาระบุจำนวนเงินที่ถูกต้อง',
            icon: 'error',
            confirmButtonText: 'ตกลง',
        });
        return;
    }

    // Calculate change
    const calculatedChange = parsedAmount - totalWithVAT;

    // Ensure that the cash received is sufficient
    if (calculatedChange < 0) {
        Swal.fire({
            title: 'ผิดพลาด!',
            text: 'จำนวนเงินที่ให้ไม่เพียงพอ',
            icon: 'error',
            confirmButtonText: 'ตกลง',
        });
        return;
    }

    const data = {
        amount: parsedAmount,
        paymentMethod: 'เงินสด',
        change: calculatedChange, // Update to calculated change
        transactionId: transactionId,
        items: selectedProducts.map(product => ({
            name: product.product_name,
            price: Number(product.price) || 0,
            quantity: product.quantity
        })),
        totalBeforeVAT: totalPrice // Add total before VAT
    };

    // Log the payment data to check all fields
    console.log('Payment data:', data);

    // Send the payment data to the API
    const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      setChange(calculatedChange);
      setPaymentData(data); 
  
      setShowReceipt(true); 
  
      Swal.fire({
          icon: 'success',
          title: `ทอนเงินจำนวน: ฿${calculatedChange.toFixed(2)}`,
          // text: `ทอนเงินจำนวน: ฿${calculatedChange.toFixed(2)}`, 
          confirmButtonText: 'ตกลง',
      });
  } else {
      const errorData = await response.json();
      console.error('Payment error:', errorData);
      Swal.fire({
          title: 'ผิดพลาด!',
          text: 'เกิดข้อผิดพลาดในการบันทึกการชำระเงิน: ' + errorData.error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
      });
  }
  
  
};

const closeReceipt = () => {
  setShowReceipt(false);
  window.location.reload(); 
};


const closeModalWithBackground = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
      onClick={closeModalWithBackground}
    >
     <div 
        className={`bg-white p-4 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto relative 
          transform transition-transform duration-300 ${isClosing ? 'slide-out' : 'scale-100 animate-modal'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={closeModal} 
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">เลือกวิธีการชำระเงิน</h2>

        <div className="flex justify-between mb-4">
          <button variant="ghost" className="flex flex-col items-center">
            <CreditCard className="h-6 w-6 text-blue-500" />
            <span className="text-xs mt-1">เงินสด</span>
          </button>
        </div>

        <input 
          value={amount} 
          readOnly 
          className="text-right text-2xl font-bold mb-4 bg-white w-full rounded-lg p-2 border border-gray-300"
        />

        <div className="text-right text-xl font-bold text-orange-500 mb-4">
          ยอดรวมทั้งหมด: ฿{totalWithVAT.toFixed(2)}
        </div>

        <div className="grid grid-cols-3 gap-2">
  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
    <button 
      key={index} 
      onClick={() => handleNumberClick(num.toString())}
      className="h-12 text-xl bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    >
      {num}
    </button>
  ))}
  <button 
    onClick={handleClear} 
    className="h-12 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
  >
    C
  </button>
  <button 
    onClick={() => handleNumberClick('0')} 
    className="h-12 text-xl bg-gray-200 rounded-lg hover:bg-gray-300 transition"
  >
    0
  </button>
  <button 
    onClick={() => handleQuickAmount('1,000')} 
    className="h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
  >
    1,000
  </button>
  <button 
    onClick={() => handleQuickAmount('500')} 
    className="h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
  >
    500
  </button>
  <button 
    onClick={() => handleQuickAmount('100')} 
    className="h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
  >
    100
  </button>
  <button 
    onClick={() => handleQuickAmount('50')} 
    className="h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
  >
    50
  </button>
  <button 
    onClick={() => handleQuickAmount('20')} 
    className="h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
  >
    20
  </button>
  <button 
    onClick={handleFullPayment} 
    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition mr-2"
  >
    ชำระเต็มจำนวน
  </button>
</div>

<div className="flex justify-between mt-4">

  <button 
    onClick={handlePayment} 
    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition ml-2"
  >
    ตกลง
  </button>
</div>

      </div>

      {showReceipt && paymentData && ( // Check if paymentData is available
        <Receipt
    storeInfo={{
        name: "Testing Invoice",
        address: "Kasetsart University",
        phone: "123-456-789"
    }}
    transactionId={transactionId}
    date={date}
    items={paymentData.items}
    subtotal={totalPrice}
    tax={(totalPrice * 0.07).toFixed(2)} // Assuming a 7% tax
    total={(totalPrice + totalPrice * 0.07).toFixed(2)} // Total including tax
    paymentMethod={paymentMethod}
    change={change}
    amountGiven={amount}
    closeReceipt={closeReceipt}
/>

      )}
    </div>
  );
}

function Receipt({ 
  storeInfo, 
  transactionId, 
  date, 
  items, 
  subtotal, 
  tax, 
  total, 
  paymentMethod, 
  change,
  amountGiven,
  closeReceipt 
}) {

  const formattedDate = new Date(date).toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24 ชั่วโมง
  });
  
  const handlePrint = () => {
    window.print(); // This triggers the print dialog
  };

  const handleCloseReceipt = (e) => {
    // ปิดใบเสร็จถ้าคลิกที่พื้นหลัง
    if (e.target === e.currentTarget) {
      closeReceipt();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50" 
      onClick={handleCloseReceipt} // เพิ่ม listener ที่นี่
    >
      <div 
        className="w-full max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg relative receipt-print"
        onClick={(e) => e.stopPropagation()} // ป้องกันการปิดเมื่อคลิกภายในใบเสร็จ
      >
        <div className="flex justify-between mt-4">
          <div
              onClick={closeReceipt} 
              className="cursor-pointer text-blue-500 hover:text-blue-600 transition"
              aria-label="ปิดใบเสร็จ"          
          >
              <X className="h-5 w-5" />
          </div>
          
          <div 
              onClick={handlePrint} 
              className="cursor-pointer text-blue-500 hover:text-blue-600 transition"
              aria-label="พิมพ์ใบเสร็จ"
          >
              <Printer className="h-5 w-5" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-center">ใบเสร็จรับเงิน</h2>
        
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold">{storeInfo.name}</h2>
          <p className="text-sm text-gray-500">{storeInfo.address}</p>
          <p className="text-sm text-gray-500">โทร: {storeInfo.phone}</p>
          <p className="text-sm text-gray-500">วันที่: {formattedDate}</p>
        </div>

        <div className="my-4 border-t border-gray-300"></div>

        <h3 className="font-bold mb-2 text-center">รายการสินค้า</h3>
        <ul className="mb-4">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between mb-1">
              <span className="text-sm">
                <strong>{item.quantity}x</strong> {item.name}
              </span>
              <span className="text-sm">฿{item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="my-4 border-t border-gray-300"></div>

        <div className="flex justify-between font-bold">
          <span>ยอดรวมก่อน VAT</span>
          <span>฿{subtotal ? parseFloat(subtotal).toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT (7%)</span>
          <span>฿{tax ? parseFloat(tax).toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex justify-between">
          <span>ชำระเงินด้วย</span>
          <span>{paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span>จำนวนเงินที่ให้มา</span>
          <span>฿{amountGiven ? parseFloat(amountGiven).toFixed(2) : '0.00'}</span> {/* แสดงจำนวนเงินที่ให้มา */}
        </div>
        <div className="flex justify-between font-bold">
          <span>ยอดรวมทั้งหมด</span>
          <span>฿{total ? parseFloat(total).toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex justify-between">
          <span>เงินทอน</span>
          <span>฿{change ? parseFloat(change).toFixed(2) : '0.00'}</span>
        </div>

        <div className="my-4 border-t border-gray-300"></div>
        
        <div className="text-xs text-center text-gray-500 mb-2">
          <p>ขอบคุณที่ใช้บริการ!</p>
          <p>กรุณาตรวจสอบใบเสร็จให้เรียบร้อย</p>
          <p>ถ้าท่านมีข้อสงสัยโปรดติดต่อเรา</p>
        </div>
        <div className="text-xs text-center text-gray-500">
          <p className="text-sm text-gray-500">รหัสการทำรายการ: {transactionId}</p>
        </div>
      </div>
    </div>
  );
}



