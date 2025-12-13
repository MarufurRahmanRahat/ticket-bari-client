import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ticketService } from '../../../services/ticketService';
import { imageService } from '../../../services/imageService';
import toast from 'react-hot-toast';
import {
  Loader2,
  Upload,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckSquare,
} from 'lucide-react';

const AddTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    fromLocation: '',
    toLocation: '',
    transportType: 'Bus',
    price: '',
    quantity: '',
    departureDate: '',
    departureTime: '',
    perks: [],
  });

  const [errors, setErrors] = useState({});

  const perkOptions = [
    'AC',
    'WiFi',
    'Refreshments',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Blanket',
    'TV',
    'Recliner Seat',
    'Charging Port',
    'Reading Light',
    'Sleeper',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePerkToggle = (perk) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter((p) => p !== perk)
        : [...prev.perks, perk],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await imageService.uploadImage(file);
      setFormData({ ...formData, image: imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.image.trim()) newErrors.image = 'Image is required';
    if (!formData.fromLocation.trim()) newErrors.fromLocation = 'From location is required';
    if (!formData.toLocation.trim()) newErrors.toLocation = 'To location is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = 'Valid quantity is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';

    // Check if departure date is in the future
    const selectedDate = new Date(formData.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      newErrors.departureDate = 'Departure date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const ticketData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      const response = await ticketService.createTicket(ticketData);
      toast.success(response.message);
      navigate('/dashboard/vendor/my-tickets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Ticket</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Dhaka to Chittagong - Premium Bus"
            className={`w-full px-4 py-3 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Upload className="w-4 h-4 inline mr-1" />
            Ticket Image *
          </label>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {uploadingImage && <Loader2 className="w-6 h-6 animate-spin text-blue-600" />}
          </div>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Or paste image URL"
            className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 h-32 rounded-lg object-cover"
            />
          )}
        </div>

        {/* From & To Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              From Location *
            </label>
            <input
              type="text"
              name="fromLocation"
              value={formData.fromLocation}
              onChange={handleChange}
              placeholder="e.g., Dhaka"
              className={`w-full px-4 py-3 border ${
                errors.fromLocation ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.fromLocation && (
              <p className="mt-1 text-sm text-red-500">{errors.fromLocation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              To Location *
            </label>
            <input
              type="text"
              name="toLocation"
              value={formData.toLocation}
              onChange={handleChange}
              placeholder="e.g., Chittagong"
              className={`w-full px-4 py-3 border ${
                errors.toLocation ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.toLocation && (
              <p className="mt-1 text-sm text-red-500">{errors.toLocation}</p>
            )}
          </div>
        </div>

        {/* Transport Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transport Type *
          </label>
          <select
            name="transportType"
            value={formData.transportType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Launch">Launch</option>
            <option value="Plane">Plane</option>
          </select>
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price (per unit) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="850"
              className={`w-full px-4 py-3 border ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Ticket Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              placeholder="40"
              className={`w-full px-4 py-3 border ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
          </div>
        </div>

        {/* Departure Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Departure Date *
            </label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border ${
                errors.departureDate ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.departureDate && (
              <p className="mt-1 text-sm text-red-500">{errors.departureDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Departure Time *
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.departureTime ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.departureTime && (
              <p className="mt-1 text-sm text-red-500">{errors.departureTime}</p>
            )}
          </div>
        </div>

        {/* Perks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <CheckSquare className="w-4 h-4 inline mr-1" />
            Perks & Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {perkOptions.map((perk) => (
              <label
                key={perk}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={formData.perks.includes(perk)}
                  onChange={() => handlePerkToggle(perk)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{perk}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Vendor Info (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Vendor Name</label>
            <p className="font-semibold text-gray-800">{user?.displayName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Vendor Email</label>
            <p className="font-semibold text-gray-800">{user?.email}</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/vendor/my-tickets')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Adding Ticket...
              </>
            ) : (
              'Add Ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTicket;