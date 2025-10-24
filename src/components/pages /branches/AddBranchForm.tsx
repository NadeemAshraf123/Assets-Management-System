import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBranch } from '../../../features/branches/BranchesSlice';




interface Props {
    onClose?: () => void;
}




const AddBranchForm: React.FC = ({ onClose }) => {

    const dispatch = useDispatch();
    const [form, setForm] = useState({
    name: '',
    manager: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
    await dispatch(addBranch(form)).unwrap();
    setForm({name:'',manager:'',email:'',phone:'',address:'',city:'',country:'',})
    } catch (err) {
        console.error('Failed to add branch:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[] shadow-md rounded-md p-6 space-y-6">

      <div className="flex items-center bg-[#0F766E33] justify-between border-b pb-4">
        <div className=''>
          <h2 className="text-2xl font-bold text-gray-800">Add New Branch</h2>
          <p className="text-sm text-gray-500">Add New Branch in system</p>
        </div>
        <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold">X</button>
      </div>

      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Branch Information</h3>

        
        <input
          type="text"
          name="name"
          placeholder="Branch Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md text-sm"
        />

        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md text-sm"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md text-sm"
          />
        </div>

        
        <input
          type="text"
          name="manager"
          placeholder="Branch Manager"
          value={form.manager}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md text-sm"
        />

    
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="Branch Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md text-sm"
          />
          <input
            type="text"
            name="phone"
            placeholder="Branch Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md text-sm"
          />
        </div>

        <input
          type="text"
          name="address"
          placeholder="Branch Address"
          value={form.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md text-sm"
        />
      </div>

      
      <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
        [Map Placeholder]
      </div>


      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={handleSubmit}
          className="bg-teal-600 cursor-pointer text-white px-6 py-2 rounded-md text-sm hover:bg-teal-700"
        >
          Add
        </button>
        <button 
            onClick={onClose}
            className="border border-gray-300 cursor-pointer text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddBranchForm;
