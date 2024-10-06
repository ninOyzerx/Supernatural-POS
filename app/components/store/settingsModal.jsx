import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Swal from 'sweetalert2';


const SettingsModal = ({ isVisible, onClose, storeId, onUpdateStore, darkMode }) => {
  const [storeName, setStoreName] = useState('');
  const [postalCode, setPostalCode] = useState(''); // รหัสไปรษณีย์
  const [province, setProvince] = useState(''); // จังหวัด
  const [district, setDistrict] = useState(''); // ตำบล
  const [amphoe, setAmphoe] = useState(''); // อำเภอ
  const [address, setAddress] = useState(''); // ที่อยู่หลัก
  const [storeImg, setStoreImg] = useState('');
  const [previewImg, setPreviewImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false); 

  useEffect(() => {
    if (isVisible && storeId) {
      fetchStoreDetails();
    }
  }, [isVisible, storeId]);

  const fetchStoreDetails = async () => {
    try {
      const sessionToken = localStorage.getItem('session');
      const response = await fetch(`/api/stores`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      const data = await response.json();
      setStoreName(data.store_name || '');
      setStoreImg(data.store_img || '');
      setPreviewImg(data.store_img || null);

      // ดึงข้อมูลที่อยู่จาก store_address ที่เก็บเป็น JSON
      if (data.store_address) {
        const addressData = JSON.parse(data.store_address);
        setPostalCode(addressData.postal_code || '');
        setProvince(addressData.province || '');
        setAmphoe(addressData.amphoe || '');
        setDistrict(addressData.district || '');
        setAddress(addressData.address || '');
      }
    } catch (error) {
      console.error('Error fetching store details:', error);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewImg(fileUrl);
      setImageFile(file);
    }
  };

  const handlePostalCodeChange = async (e) => {
    const postalCode = e.target.value;
    setPostalCode(postalCode);
  
    if (postalCode.length === 5) {
      try {
        const response = await fetch(`/api/postal-code/${postalCode}`);
        const data = await response.json();
  
        if (data.province && data.amphoe && data.district) {
          setProvince(data.province);
          setAmphoe(data.amphoe);
          setDistrict(data.district);
        } else {
          setProvince('');
          setAmphoe('');
          setDistrict('');
        }
      } catch (error) {
        console.error('Error fetching postal code data:', error);
      }
    } else {
      setProvince('');
      setAmphoe('');
      setDistrict('');
    }
  };
  

  const handleSave = async () => {
    const sessionToken = localStorage.getItem('session');
    if (!sessionToken) {
      console.error('Session Token not found');
      return;
    }
  
    const storeAddress = {
      postal_code: postalCode,
      province: province,
      amphoe: amphoe,
      district: district,
      address: address,
    };
  
    const formData = new FormData();
    formData.append('store_name', storeName);
    formData.append('store_address', JSON.stringify(storeAddress));
    if (imageFile) {
      formData.append('store_img', imageFile);
    }
  
    try {
      const response = await fetch('/api/stores/update', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        onUpdateStore(updatedData);
        onClose();
        
        // แสดง Swal เมื่อบันทึกข้อมูลสำเร็จ
        Swal.fire({
          title: 'สำเร็จ!',
          text: 'เปลี่ยนแปลงข้อมูลสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });
      } else {
        console.error('Error updating store');
      }
    } catch (error) {
      console.error('Error:', error);
      
      // แสดง Swal เมื่อเกิดข้อผิดพลาด
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };
  

  const toggleFullScreenImage = () => {
    setIsImageFullScreen(!isImageFullScreen);
  };

  if (!isVisible) return null;

  return (
    <div className="font-thai fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-out">
      <div 
        className={`p-4 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg relative transform transition-transform duration-300 ease-out 
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} overflow-hidden`} 
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${darkMode ? 'text-gray-300 hover:text-gray-500' : 'text-gray-500 hover:text-gray-700'} transition-transform transform hover:scale-110`}
        >
          <X className="w-6 h-6" />
        </button>
    
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 animate-fadeIn">การตั้งค่าร้านค้า</h2>
    
        <div className="grid grid-cols-2 gap-4">
          {/* Input สำหรับชื่อร้านค้า */}
          <div className="col-span-2">
            <label className="text-2xl font-medium animate-fadeIn">ชื่อร้านค้า</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className={`text-xl input input-bordered w-full px-4 py-2 rounded-md transition-colors focus:ring-2 focus:ring-indigo-500 
                ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-gray-200 text-black border-gray-300 focus:border-blue-500'}`}
            />
          </div>
    
          {/* Input สำหรับรหัสไปรษณีย์ */}
          <div className="col-span-1">
            <label className="text-2xl font-medium animate-fadeIn">รหัสไปรษณีย์</label>
            <input
              type="text"
              value={postalCode}
              onChange={handlePostalCodeChange}
              className={`text-xl input input-bordered w-full px-2 py-1 rounded-md transition-colors focus:ring-2 focus:ring-indigo-500 
                ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-gray-200 text-black border-gray-300 focus:border-blue-500'}`}
            required
            />
          </div>
    
          {/* แสดงจังหวัดและอำเภอ */}
          <div className="col-span-1">
            <label className="text-2xl font-medium animate-fadeIn">จังหวัด</label>
            <input
              type="text"
              value={province}
              readOnly
              className={`text-xl input input-bordered w-full px-4 py-2 rounded-md 
                ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'}`}
            />
          </div>
          <div className="col-span-1">
            <label className="text-2xl font-medium animate-fadeIn">อำเภอ</label>
            <input
              type="text"
              value={amphoe}
              readOnly
              className={`text-xl input input-bordered w-full px-4 py-2 rounded-md 
                ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'}`}
            />
          </div>
    
          {/* Input สำหรับที่อยู่หลัก */}
          <div className="col-span-2">
            <label className="text-2xl font-medium animate-fadeIn">ที่อยู่</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`text-xl input input-bordered w-full px-4 py-2 rounded-md transition-colors focus:ring-2 focus:ring-indigo-500 
                ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' : 'bg-gray-200 text-black border-gray-300 focus:border-blue-500'}`}
            />
          </div>
    
          {/* การอัปโหลดโลโก้ */}
          <div className="col-span-2 flex items-center justify-between">
            <div className="w-1/2 pr-4">
              <label className="text-lg sm:text-xl font-medium animate-fadeIn">อัพโหลดรูปภาพร้านค้า</label>
              <input 
                type="file" 
                onChange={handleUpload} 
                className={`file-input w-full px-4 py-2 border rounded-md transition-colors duration-300 
                  ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'}`} 
              />
            </div>
  
            {/* แสดงรูปภาพร้านค้า */}
            {previewImg && (
              <div className="w-1/2 mt-4 animate-scaleIn flex justify-end">
                <img
                  src={previewImg}
                  alt="Current Store"
                  className="w-24 h-24 object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                  onClick={toggleFullScreenImage}
                />
              </div>
            )}
          </div>
        </div>
    
        {/* ปุ่มบันทึกและยกเลิก */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className={`text-lg sm:text-xl font-bold flex items-center gap-2 px-4 py-2 rounded-md transition-all transform hover:scale-105 hover:bg-opacity-80
              ${darkMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            <X className="w-5 h-5" />
            ยกเลิก
          </button>
  
          <button
            onClick={handleSave}
            className={`text-lg sm:text-xl font-bold flex items-center gap-2 px-4 py-2 rounded-md transition-all transform hover:scale-105 hover:bg-opacity-80 
              ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            <Save className="w-5 h-5" />
            บันทึก
          </button>
        </div>
    
        {/* แสดงรูปภาพเต็มจอ */}
        {isImageFullScreen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 cursor-pointer"
            onClick={toggleFullScreenImage}
          >
            <img src={previewImg} alt="Current Store" className="w-auto max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
