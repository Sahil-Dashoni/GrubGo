import axios from 'axios';
import React, { useState } from 'react';
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

import { updateItemStock } from '../redux/ownerSlice';
import { toast } from 'react-hot-toast';

function OwnerItemCard({ data }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showFullDesc, setShowFullDesc] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true })
      dispatch(setMyShopData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  const handleStockToggle = async () => {
    try {
      const newStatus = !data.isAvailable; // Calculate intended new status

      const result = await axios.patch(
        `${serverUrl}/api/item/toggle-stock/${data._id}`,
        {},
        { withCredentials: true }
      );

      if (result.status === 200) {
        // Update Redux state immediately
        dispatch(updateItemStock({
          itemId: data._id,
          isAvailable: newStatus
        }));
        toast.success(`Item is now ${newStatus ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock");
    }
  }


  return (
    <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl'>
      <div className='w-36 flex-shrink-0 bg-gray-50 relative'>
        <img src={data.image} alt="" className={`w-full h-full object-cover ${!data.isAvailable ? 'grayscale opacity-50' : ''}`} />
        {!data.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">OUT</span>
          </div>
        )}
      </div>
      <div className='flex flex-col justify-between p-3 flex-1'>
        <div>
          <div className='flex justify-between items-start'>
            <h2 className='text-base font-semibold text-[#ff4d2d]'>{data.name}</h2>
            {/* Toggle Switch UI */}
            <div className='flex items-center gap-2'>
              <span className='text-[10px] font-bold text-gray-400 uppercase'>Stock</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={data.isAvailable !== false}
                  onChange={handleStockToggle}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <p className='text-sm'><span className='font-medium text-gray-700'>Category:</span> {data.category}</p>
          <p className='text-sm'><span className='font-medium text-gray-700'>Type:</span> {data.foodType}</p>
          
          <div className='mt-1'>
            <p className={`text-xs text-gray-500 italic ${!showFullDesc ? 'line-clamp-2' : ''}`}>
              {data.description || "No description provided."}
            </p>
            {data.description?.length > 50 && (
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className='text-[#ff4d2d] text-[10px] font-bold mt-1 hover:underline tracking-tighter'
              >
                {showFullDesc ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

        </div>
        <div className='flex items-center justify-between'>
          <div className='text-[#ff4d2d] font-bold'>₹{data.price}</div>
          <div className='flex items-center gap-2'>
            <div className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10  text-[#ff4d2d]' onClick={() => navigate(`/edit-item/${data._id}`)}>
              <FaPen size={16} />
            </div>
            <div className='p-2 cursor-pointer rounded-full hover:bg-[#ff4d2d]/10  text-[#ff4d2d]' onClick={handleDelete}>
              <FaTrashAlt size={16} />
            </div>
          </div>

        </div>
      </div>
    </div >
  )
}

export default OwnerItemCard
