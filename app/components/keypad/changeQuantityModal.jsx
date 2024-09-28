import { X, Delete, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ChangeQuantityModal({
  quantity,
  isModalOpen,
  closeModal,
  handleChangeQuantity,
  darkMode
}) {
  const [showModal, setShowModal] = useState(isModalOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [inputQuantity, setInputQuantity] = useState(quantity);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  useEffect(() => {
    if (isModalOpen) {
      setShowModal(true);
      setIsClosing(false);
      setInputQuantity(quantity);
      setErrorMessage(''); // Clear error message when modal opens
    } else {
      setIsClosing(true);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isModalOpen, quantity]);

  const formatNumber = (value) => {
    if (value == null) return ''; 
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
  };

  const handleNumberClick = (num) => {
    setInputQuantity((prev) => {
      // If the previous value is '0', replace it with the clicked number, including '0'
      if (prev === '0') {
        return num.toString();
      }
      // Otherwise, append the number as a string
      return prev + num.toString();
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
    // If the quantity is 0, set an error message
    if (parseInt(inputQuantity, 10) === 0) {
      setErrorMessage('จำนวนสินค้าไม่สามารถเป็น 0 ได้'); // Show error message
      return;
    }
    handleChangeQuantity(String(inputQuantity).replace(/,/g, ''));
    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-4 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto relative 
          transform transition-transform duration-300 ${isClosing ? 'slide-out' : 'scale-100 animate-modal'}
          ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`} // Dark mode condition
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className={`absolute top-4 right-4 ${darkMode ? 'text-red-400 hover:text-red-500' : 'text-red-500 hover:text-red-700'}`}
        >
          <X className="h-6 w-6" />
        </button>
  
        {/* Modal Title */}
        <h2 className={`text-xl font-bold mb-4 text-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          จำนวนสินค้า
        </h2>
  
        {/* Input Quantity Display */}
        <div className={`flex justify-between items-center mb-4 w-full rounded-lg p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
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

        {/* Error Message */}
        {errorMessage && (
          <div className={`mb-4 text-center ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
            {errorMessage}
          </div>
        )}
  
        {/* Number Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={`h-16 text-2xl rounded-lg transition ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {num}
            </button>
          ))}
  
          {/* 0 Button */}
          <button
            key={0}
            onClick={() => handleNumberClick(0)}
            className={`h-16 text-2xl rounded-lg transition col-start-2 col-end-3 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            0
          </button>
  
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className={`h-16 text-2xl rounded-lg transition ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            <Delete className="h-6 w-6 mx-auto" />
          </button>
        </div>
  
        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className={`w-full mt-4 py-2 rounded-lg transition ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          ตกลง
        </button>
      </div>
    </div>
  );
}
