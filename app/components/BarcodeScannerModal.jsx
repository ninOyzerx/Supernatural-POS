import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import { BrowserMultiFormatReader } from '@zxing/library'; 
import { MdCameraswitch } from "react-icons/md";

const BarcodeScannerModal = ({ isBarcodeModalOpen, barcodeToggleModal, darkMode }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [scannedItems, setScannedItems] = useState([]);
  const [error, setError] = useState(null);
  const codeReader = new BrowserMultiFormatReader();

  const getSessionAndStoreData = () => {
    const sessionToken = localStorage.getItem('session'); 
    const storeId = localStorage.getItem('storeId');
  
    console.log('Session Token:', sessionToken);
    console.log('Store ID:', storeId);
  
    if (!sessionToken || !storeId) {
      setError('ไม่พบ session หรือ store ID');
      return { sessionToken: null, storeId: null };
    }
    return { sessionToken, storeId };
  };

  const checkBrowserCompatibility = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('เบราว์เซอร์นี้ไม่รองรับการใช้กล้อง กรุณาใช้ Chrome, Firefox, หรือ Safari');
      return false;
    }
    return true;
  };

  const listCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
      setVideoDevices(videoInputDevices);
      if (videoInputDevices.length > 0) {
        setSelectedDeviceId(videoInputDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error enumerating devices:', error);
      setError('ไม่สามารถเข้าถึงกล้องได้');
    }
  };

  useEffect(() => {
    if (isBarcodeModalOpen && selectedDeviceId) {
      startBarcodeScanner(selectedDeviceId);
    }
  }, [isBarcodeModalOpen, selectedDeviceId]);

  const startBarcodeScanner = (deviceId) => {
    const videoElement = document.getElementById('video');
    if (videoElement && videoElement instanceof HTMLVideoElement) {
      codeReader.decodeFromVideoDevice(deviceId, videoElement, async (result, err) => {
        if (result) {
          const barcodeText = result.getText();
          
          const { sessionToken, storeId } = getSessionAndStoreData();

          if (!sessionToken || !storeId) {
            setError('ไม่พบ session token หรือ store ID');
            return;
          }

          // เคลียร์ข้อผิดพลาดก่อนการสแกนใหม่
          setError(null);

          try {
            const response = await fetch(`/api/products?product_code=${barcodeText}&store_id=${storeId}`, {
              headers: {
                'Authorization': `Bearer ${sessionToken}`,  
              },
            });

            if (!response.ok) {
              if (response.status === 404) {
                throw new Error('ไม่พบสินค้า');
              } else {
                throw new Error('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
              }
            }

            const product = await response.json();
            const existingItem = scannedItems.find(item => item.barcode === barcodeText);
            if (existingItem) {
              const updatedItems = scannedItems.map(item => 
                item.barcode === barcodeText 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
              );
              setScannedItems(updatedItems);
            } else {
              setScannedItems([...scannedItems, { barcode: barcodeText, quantity: 1, name: product.product_name }]);
            }
          } catch (error) {
            setError(error.message);
          }
        }

        if (err && err.name !== 'NotFoundException') {
          console.error('Error scanning barcode:', err);
        }
      });
    }
  };

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  useEffect(() => {
    if (isBarcodeModalOpen && checkBrowserCompatibility()) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          listCameras();
        })
        .catch((err) => {
          console.error('การขอสิทธิ์เข้ากล้องถูกปฏิเสธ:', err);
          setError('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบสิทธิ์การใช้งาน');
        });
    }
  }, [isBarcodeModalOpen]);

  // รีเซ็ตข้อมูลเมื่อปิด Modal
  useEffect(() => {
    if (!isBarcodeModalOpen) {
      setScannedItems([]);
      setError(null);
    }
  }, [isBarcodeModalOpen]);

  if (!isBarcodeModalOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'}`}>
      <div className={`p-4 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <button onClick={barcodeToggleModal} className={`absolute top-4 right-4 ${darkMode ? 'text-red-300 hover:text-red-500' : 'text-red-500 hover:text-red-700'}`}>
          <X className="h-6 w-6" />
        </button>

        <h2 className={`text-xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-black'}`}>สแกนบาร์โค้ด</h2>

        {error && <p className="text-red-500">{error}</p>}
        {videoDevices.length > 0 && (
          <div className="mb-4 flex items-center">
            <label className={`flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
              <MdCameraswitch className="mr-2" size={24} />
            </label>
            <select 
              onChange={handleDeviceChange} 
              value={selectedDeviceId || ''} 
              className={`p-2 ml-2 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
            >
              {videoDevices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {index === 0 ? 'กล้องหลัง' : 'กล้องหน้า'}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-4">
          <video id="video" width="100%" height="400" className={`border ${darkMode ? 'border-gray-600' : 'border-black'}`}></video>
        </div>

        <div className="mt-4">
          <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>รายการสินค้า</h2>
          {scannedItems.length === 0 ? (
            <p className={darkMode ? 'text-white' : 'text-black'}>ยังไม่มีสินค้าที่สแกน</p>
          ) : (
            <ul>
              {scannedItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span className={darkMode ? 'text-white' : 'text-black'}>{item.barcode} - {item.name}</span>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    min="1"
                    className={`w-16 text-right border rounded px-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`} 
                    onChange={(e) => handleQuantityChange(item.barcode, parseInt(e.target.value))}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
