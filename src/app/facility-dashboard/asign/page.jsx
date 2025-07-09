'use client';
import { useState } from 'react';
import { Package } from 'lucide-react';

export default function EquipmentForm() {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    type: '',
    manufacturer: '',
    supplier: '',
    model: '',
    serial: '',
    assetTag: ''
  });

  const [errors, setErrors] = useState({});
  const [autoGenerateId, setAutoGenerateId] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Equipment name is required.';
    if (!formData.id) newErrors.id = 'Equipment ID is required.';
    if (!formData.type) newErrors.type = 'Equipment type is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    alert('Form submitted: ' + JSON.stringify(formData, null, 2));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      id: autoGenerateId ? generateId() : '',
      type: '',
      manufacturer: '',
      supplier: '',
      model: '',
      serial: '',
      assetTag: ''
    });
    setErrors({});
  };

  const generateId = () => `EQP-${Math.floor(1000 + Math.random() * 9000)}`;

  // Auto-generate ID on initial load or toggle
  useState(() => {
    if (autoGenerateId) {
      setFormData((prev) => ({ ...prev, id: generateId() }));
    }
  });

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
        <Package className="text-blue-600" />
        Equipment Information
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Name */}
          <div>
            <label className="block font-semibold mb-1">Equipment Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Granulator #1"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Equipment ID */}
          <div>
            <label className="block font-semibold mb-1">Equipment Code/ID *</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={autoGenerateId}
              className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <label className="flex items-center mt-2 text-sm gap-2">
              <input
                type="checkbox"
                checked={autoGenerateId}
                onChange={(e) => {
                  const auto = e.target.checked;
                  setAutoGenerateId(auto);
                  setFormData((prev) => ({
                    ...prev,
                    id: auto ? generateId() : ''
                  }));
                }}
              />
              Auto-generate ID
            </label>
            {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
          </div>

          {/* Equipment Type */}
          <div>
            <label className="block font-semibold mb-1">Equipment Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option>Granulator</option>
              <option>Tablet Press</option>
              <option>Blister Pack Machine</option>
              <option>Autoclave</option>
              <option>FBD</option>
              <option>Compression Machine</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block font-semibold mb-1">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              placeholder="ACME Pharma Systems"
              value={formData.manufacturer}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Supplier / OEM */}
          <div>
            <label className="block font-semibold mb-1">Supplier / OEM</label>
            <input
              type="text"
              name="supplier"
              placeholder="XYZ Engineering Ltd."
              value={formData.supplier}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Model Number */}
          <div>
            <label className="block font-semibold mb-1">Model Number</label>
            <input
              type="text"
              name="model"
              placeholder="Model XG-320"
              value={formData.model}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="block font-semibold mb-1">Serial Number</label>
            <input
              type="text"
              name="serial"
              placeholder="SN-100293842"
              value={formData.serial}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Asset Tag Number */}
          <div>
            <label className="block font-semibold mb-1">Asset Tag Number</label>
            <input
              type="text"
              name="assetTag"
              placeholder="AST-9876"
              value={formData.assetTag}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
