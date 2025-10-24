import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBranch } from '../../../features/branches/BranchesSlice';
import type { Branch } from '../../../features/branches/BranchesSlice';

interface Props {
  branch: Branch;
  onClose: () => void;
}

const EditBranchModal: React.FC<Props> = ({ branch, onClose }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: branch.name,
    city: branch.city ?? '',
    country: branch.country ?? '',
    manager: branch.manager,
    email: branch.email,
    phone: branch.phone,
    address: branch.address,
    status: branch.status ?? true,
    groundMaintenance: branch.groundMaintenance ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: 'status' | 'groundMaintenance') => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateBranch({ id: branch.id, data: form })).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to update branch:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Branch</h2>
          <p className="text-sm text-gray-500">Edit Branch in system</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Form Section */}
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

      {/* Map Placeholder */}
      <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
        [Map Placeholder]
      </div>

      {/* Toggles */}
      <div className="flex gap-6 pt-4">
        <label className="flex items-center gap-2">
          <span>Status</span>
          <input
            type="checkbox"
            checked={form.status}
            onChange={() => handleToggle('status')}
            className="toggle toggle-success"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Ground Maintenance</span>
          <input
            type="checkbox"
            checked={form.groundMaintenance}
            onChange={() => handleToggle('groundMaintenance')}
            className="toggle toggle-success"
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={handleSubmit}
          className="bg-teal-600 text-white px-6 py-2 rounded-md text-sm hover:bg-teal-700"
        >
          Edit
        </button>
        <button
          onClick={onClose}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditBranchModal;
