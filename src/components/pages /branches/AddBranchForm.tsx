import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBranch } from '../../../features/branches/BranchesSlice';

interface Props {
    onClose?: () => void;
}

const AddBranchForm: React.FC<Props> = ({ onClose }) => {
    const dispatch = useDispatch();
    
    
    const [form, setForm] = useState({
        name: '',
        manager: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
    });


    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const validationRules = {
        name: { required: true, minLength: 2 },
        manager: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        phone: { required: true, pattern: /^[+]?[\d\s-()]{10,}$/ },
        address: { required: true, minLength: 5 },
        city: { required: true, minLength: 2 },
        country: { required: true, minLength: 2 },
    };

    
    const validateField = (name: string, value: string): string => {
        const rules = validationRules[name as keyof typeof validationRules];
        
        if (rules.required && !value.trim()) {
            return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
        
        if (rules.minLength && value.length < rules.minLength) {
            return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
            if (name === 'email') return 'Please enter a valid email address';
            if (name === 'phone') return 'Please enter a valid phone number';
        }
        
        return '';
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        Object.keys(validationRules).forEach(field => {
            const error = validateField(field, form[field as keyof typeof form]);
            if (error) {
                newErrors[field] = error;
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setForm({ ...form, [name]: value });
        
    
        if (errors[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    
    const handleSubmit = async () => {
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await dispatch(addBranch(form)).unwrap();
            
            setForm({
                name: '',
                manager: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                country: '',
            });
            setErrors({});
            onClose?.(); 
        } catch (err) {
            console.error('Failed to add branch:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 space-y-6">
        
            <div className="flex items-center bg-[#0F766E33] justify-between border-b pb-4">
                <div className=''>
                    <h2 className="text-2xl font-bold text-gray-800">Add New Branch</h2>
                    <p className="text-sm text-gray-500">Add New Branch in system</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                    X
                </button>
            </div>

            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Branch Information</h3>

                
                <div>
                     <label className="block text-xs">Branch Name </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Branch Name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 border rounded-md text-sm ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name}</p>
                    )}
                </div>

            
                <div className="grid grid-cols-2 gap-4">
                    <div>

                     <label className="block text-xs">City </label>

                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-md text-sm ${
                                errors.city ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.city && (
                            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                        )}
                    </div>
                    <div>
                     <label className="block text-xs">Country </label>

                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={form.country}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-md text-sm ${
                                errors.country ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.country && (
                            <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                        )}
                    </div>
                </div>

                
                <div>
                     <label className="block text-xs">Branch Manager </label>

                    <input
                        type="text"
                        name="manager"
                        placeholder="Branch Manager"
                        value={form.manager}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 border rounded-md text-sm ${
                            errors.manager ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.manager && (
                        <p className="text-red-500 text-xs mt-1">{errors.manager}</p>
                    )}
                </div>

                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                     <label className="block text-xs">Branch Email </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Branch Email"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-md text-sm ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                     <label className="block text-xs">Branch Phone Number </label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Branch Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-md text-sm ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>

                
                <div>
                     <label className="block text-xs"> Branch Address </label>

                    <input
                        type="text"
                        name="address"
                        placeholder="Branch Address"
                        value={form.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 border rounded-md text-sm ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
                [Map Placeholder]
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-teal-600 text-white px-6 py-2 rounded-md text-sm hover:bg-teal-700 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                >
                    {isSubmitting ? 'Adding...' : 'Add'}
                </button>
                <button 
                    onClick={onClose}
                    disabled={isSubmitting}
                    className={`border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddBranchForm;