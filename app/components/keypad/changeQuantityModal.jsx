import { X, Delete, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ChangeQuantityModal({
  quantity,
  isModalOpen,
  closeModal,
  handleChangeQuantity,
}) {
  const [showModal, setShowModal] = useState(isModalOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [inputQuantity, setInputQuantity] = useState(quantity);

  useEffect(() => {
    if (isModalOpen) {
      setShowModal(true);
      setIsClosing(false);
      setInputQuantity(quantity);
    } else {
      setIsClosing(true);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isModalOpen, quantity]);

  const formatNumber = (value) => {
    if (value == null) return ''; 
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputQuantity(value);
    }
  };

  const handleNumberClick = (num) => {
    setInputQuantity((prev) => {
      return prev === '0' || prev === 0 ? num.toString() : prev + num.toString();
    });
  };

  const handleDelete = () => {
    setInputQuantity((prev) => {
      if (typeof prev !== 'string') {
        prev = prev.toString();
      }

      if (prev.length === 1) return '0';

      return prev.slice(0, -1);
    });
  };

  const handleClear = () => {
    setInputQuantity('0'); // Clear input by setting it to '0'
  };

  const handleConfirm = () => {
    handleChangeQuantity(String(inputQuantity).replace(/,/g, ''));
    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white p-4 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto relative 
            transform transition-transform duration-300 ${isClosing ? 'slide-out' : 'scale-100 animate-modal'}`}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">จำนวนสินค้า</h2>

        <div className="flex justify-between items-center mb-4 bg-gray-100 w-full rounded-lg p-2">
          {inputQuantity && inputQuantity !== '0' && (
            <button
              onClick={handleClear}
              className="text-red-500 hover:text-red-600 w-10 h-10 flex items-center justify-center"
            >
              <CircleX className="h-6 w-6" /> 
            </button>
          )}
          <span className={`text-4xl font-bold ml-2 ${inputQuantity === '0' ? 'ml-auto' : ''}`}>
            {formatNumber(inputQuantity)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-16 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              {num}
            </button>
          ))}

          <button
            key={0}
            onClick={() => handleNumberClick(0)}
            className="h-16 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300 transition col-start-2 col-end-3"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="h-16 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <Delete className="h-6 w-6 mx-auto" />
          </button>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
}
