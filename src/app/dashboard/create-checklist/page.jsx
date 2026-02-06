

"use client"
import { useEffect, useState, useRef } from "react"
import {
  Plus,
  Sparkles,
  Trash2, User,
  CheckCircle,
  Table,
  Activity,
  Search,
  AlertCircle,
  Zap,
  TrendingUp,
  Target,
  Layers,
  Workflow,
  Star,
  Eye,
  Heart,
  Bookmark,
  FileText,
  Clock,
  Users,
  Edit,
  X,
  ChevronDown,
  ChevronRight,
  Hash, Info, Layers2, Minus,
  Calendar,
  Camera,
  Timer,
  ImageIcon, ListChecks,
  Check,
  Circle,
} from "lucide-react"
import { SendHorizontal } from 'lucide-react';
import { useRouter } from "next/navigation";
import Image from "next/image";

const SOPDashboard = () => {
  const router = useRouter()
  const [activeDurationPath, setActiveDurationPath] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImagePath, setActiveImagePath] = useState('');
  const [sopData, setSopData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(true)
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false);
  const [sopToApprove, setSopToApprove] = useState(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [navigatingToCreate, setNavigatingToCreate] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [selectedSop, setSelectedSop] = useState(null)
  const [reviewSop, setReviewSop] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({})
  const [modalActionType, setModalActionType] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sopToDelete, setSopToDelete] = useState(null);
  const [editingSop, setEditingSop] = useState({
    name: '',
    description: '',
    stages: [],
    createdAt: new Date(),
    status: 'pending'
  })
  const [showApproversReviewersTable, setShowApproversReviewersTable] = useState(false);

  const ImageAttachmentModal = ({
    onClose,
    onSave,
    initialTitle = '',
    initialDescription = '',
    initialPhotos = []
  }) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [photos, setPhotos] = useState(initialPhotos);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const uploadImageToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        return await response.json();
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    };

    const handleFileChange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      setIsUploading(true);

      try {
        const uploadPromises = files.map(async (file) => {
          const tempPhoto = {
            file,
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            public_id: null,
            isUploading: true
          };

          setPhotos(prev => [...prev, tempPhoto]);

          const cloudinaryResult = await uploadImageToCloudinary(file);
          return {
            file,
            name: file.name,
            size: file.size,
            url: cloudinaryResult.url,
            public_id: cloudinaryResult.public_id,
            isUploading: false
          };
        });

        const newPhotos = await Promise.all(uploadPromises);
        setPhotos(prev => [
          ...prev.filter(p => !p.isUploading),
          ...newPhotos
        ]);
      } catch (error) {
        alert('Error uploading images. Please try again.');
        setPhotos(prev => prev.filter(p => !p.isUploading));
      } finally {
        setIsUploading(false);
      }
    };

    const removePhoto = (index) => {
      const photoToRemove = photos[index];
      if (photoToRemove.url && photoToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
      if (photos.length === 0) {
        alert('Please add at least one photo');
        return;
      }

      const uploadedPhotos = photos.filter(photo => photo.public_id);

      onSave({
        title,
        description,
        photos: uploadedPhotos
      });
      onClose();
    };

    useEffect(() => {
      return () => {
        photos.forEach(photo => {
          if (photo.url && photo.url.startsWith('blob:')) {
            URL.revokeObjectURL(photo.url);
          }
        });
      };
    }, [photos]);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Attach Photos</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              disabled={isUploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setTitle(onlyLetters);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Photo title"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Photo description"
                disabled={isUploading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Photos</label>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  disabled={isUploading}
                >
                  <Plus className="w-4 h-4" />
                  Add Photos
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={photo.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {photo.isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                  <Camera className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">No photos selected</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isUploading || photos.length === 0 || photos.every(p => !p.public_id)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleImageSave = (imageData) => {
    setEditingSop(prev => {
      const newValue = { ...prev };
      let current = newValue;

      for (const part of activeImagePath.split('.')) {
        current = current[part];
      }

      current.attachedImages = [...(current.attachedImages || []), ...imageData.photos];

      return newValue;
    });
    setShowImageModal(false);
  };

  const icons = [
    CheckCircle,
    Activity,
    AlertCircle,
    Zap,
    TrendingUp,
    Target,
    Layers, Info,
    Workflow,
    Star,
    Eye,

    Heart,
    Bookmark,
    FileText,
    Clock,
    Users,
    Edit,
    X,
    SendHorizontal,
  ]

  const colors = [
    { bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-500", text: "text-emerald-600" },
    { bg: "bg-blue-50", gradient: "from-blue-500 to-purple-500", text: "text-blue-600" },
    { bg: "bg-orange-50", gradient: "from-orange-500 to-red-500", text: "text-orange-600" },
    { bg: "bg-purple-50", gradient: "from-purple-500 to-indigo-500", text: "text-purple-600" },
    { bg: "bg-pink-50", gradient: "from-pink-500 to-rose-500", text: "text-pink-600" },
    { bg: "bg-amber-50", gradient: "from-amber-500 to-yellow-500", text: "text-amber-600" },
  ]

  const DurationModal = ({
    onClose,
    onSave,
    initialMinTime = { hours: 0, minutes: 0, seconds: 0 },
    initialMaxTime = { hours: 0, minutes: 0, seconds: 0 }
  }) => {
    const [minTime, setMinTime] = useState(initialMinTime);
    const [maxTime, setMaxTime] = useState(initialMaxTime);
    const [activeInput, setActiveInput] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [hasUserModified, setHasUserModified] = useState(false);

    const validateAndSetTime = (type, field, value) => {
      setHasUserModified(true);
      const digitsOnly = value.replace(/\D/g, '').slice(0, 2);
      let numValue = parseInt(digitsOnly, 10) || 0;

      if (field === 'minutes' || field === 'seconds') {
        numValue = Math.min(59, numValue);
      }

      const setter = type === 'min' ? setMinTime : setMaxTime;
      const otherTime = type === 'min' ? maxTime : minTime;

      setter(prev => {
        const newTime = { ...prev, [field]: numValue };
        const newTotal = newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds;
        const otherTotal = otherTime.hours * 3600 + otherTime.minutes * 60 + otherTime.seconds;

        if (type === 'min' && newTotal > otherTotal) {
          setMaxTime(newTime);
        }

        return newTime;
      });
    };

    const adjustTime = (type, field, increment) => {
      setHasUserModified(true);
      const current = type === 'min' ? minTime : maxTime;
      const newValue = Math.max(0, current[field] + increment);
      validateAndSetTime(type, field, newValue.toString());
    };

    const handleInputChange = (type, field, e) => {
      validateAndSetTime(type, field, e.target.value);
    };

    const handleFocus = (type, field, e) => {
      setActiveInput(`${type}-${field}`);
      e.target.select();
    };

    const formatDisplayValue = (value) => {
      return String(value).padStart(2, '0');
    };

    const handleSave = () => {
      const minTotal = minTime.hours * 3600 + minTime.minutes * 60 + minTime.seconds;
      const maxTotal = maxTime.hours * 3600 + maxTime.minutes * 60 + maxTime.seconds;

      if (maxTotal < minTotal) {
        setAlertMessage('Maximum duration must be ≥ minimum duration');
        setShowAlert(true);
        return;
      }

      const minTotalMinutes = minTime.hours * 60 + minTime.minutes;
      const maxTotalMinutes = maxTime.hours * 60 + maxTime.minutes;

      onSave({
        minDuration: minTotalMinutes,
        maxDuration: maxTotalMinutes,
        minTime,
        maxTime,
        wasModified: hasUserModified
      });
      onClose();
    };

    const renderTimeField = (type, field) => {
      const currentTime = type === 'min' ? minTime : maxTime;
      const isActive = activeInput === `${type}-${field}`;
      const colorClass = type === 'min' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600';
      const ringColor = type === 'min' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500';

      return (
        <div className="flex flex-col items-center">
          <div className="relative">
            <button
              onClick={() => adjustTime(type, field, 1)}
              className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 ${colorClass} text-white rounded-full flex items-center justify-center shadow hover:shadow-md active:scale-95`}
            >
              <Plus className="w-2.5 h-2.5" />
            </button>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={isActive ? currentTime[field] : formatDisplayValue(currentTime[field])}
              onChange={(e) => handleInputChange(type, field, e)}
              onFocus={(e) => handleFocus(type, field, e)}
              onBlur={() => setActiveInput(null)}
              className={`w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 ${ringColor}`}
            />

            <button
              onClick={() => adjustTime(type, field, -1)}
              className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 ${colorClass} text-white rounded-full flex items-center justify-center shadow hover:shadow-md active:scale-95`}
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
          </div>
          <span className="text-xs font-medium text-gray-500 mt-1 uppercase">
            {field.slice(0, 3)}
          </span>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 pb-20">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Set Duration</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {showAlert && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {alertMessage}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h3 className="text-sm font-medium text-gray-700">Minimum Duration</h3>
              </div>

              <div className="flex justify-center gap-3">
                {['hours', 'minutes', 'seconds'].map((field) => (
                  <div key={`min-${field}`}>
                    {renderTimeField('min', field)}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-xs text-gray-500">to</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="text-sm font-medium text-gray-700">Maximum Duration</h3>
              </div>

              <div className="flex justify-center gap-3">
                {['hours', 'minutes', 'seconds'].map((field) => (
                  <div key={`max-${field}`}>
                    {renderTimeField('max', field)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fetchWorkers = async (param) => {
    setLoadingWorkers(true);
    try {
      const res = await fetch(`/api/fetch-worker/${param}?companyId=${companyData?.companyId}`, {
        method: "GET",
      });
      const data = await res.json();
      const dd = data.data.filter((i) => i._id !== companyData.id);
      setWorkersList(dd);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const ReviewApprovalModal = ({
    onClose,
    onSend,
    workers,
    loading,
    selectedWorkers,
    setSelectedWorkers,
    sopStatus,
    actionLoading,
    existingReviews = [],
    actionType = 'review'
  }) => {
    const isUnderReview = sopStatus === "Under Review" || sopStatus === "Approved Review" || sopStatus === "Rejected Review";
    const isPendingApproval = sopStatus === "Pending Approval" || sopStatus === "Approved" || sopStatus === "Rejected";
    const [searchTerm, setSearchTerm] = useState("");

    const toggleWorkerSelection = (workerId) => {
      setSelectedWorkers(prev =>
        prev.includes(workerId)
          ? prev.filter(id => id !== workerId)
          : [...prev, workerId]
      );
    };

    const filteredWorkers = workers.filter(worker =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getModalTitle = () => {
      if (actionType === 'review') {
        return isUnderReview ? "Review Status" : "Assign Reviewers";
      } else {
        return isPendingApproval ? "Approval Status" : "Assign Approvers";
      }
    };

    const getModalDescription = () => {
      if (actionType === 'review') {
        return isUnderReview ? "Current review progress" : "Select team members to review";
      } else {
        return isPendingApproval ? "Current approval progress" : "Select team members to approve";
      }
    };

    const getButtonText = () => {
      if (actionType === 'review') {
        return isUnderReview ? 'View Reviewers' : 'Send for Review';
      } else {
        return isPendingApproval ? 'View Approvers' : 'Send for Approval';
      }
    };

    const getStatusLabel = () => {
      if (actionType === 'review') {
        return isUnderReview ? "Assigned Reviewers" : "Select Reviewers";
      } else {
        return isPendingApproval ? "Assigned Approvers" : "Select Approvers";
      }
    };

    return (
      <div className="fixed pl-64 inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {getModalTitle()}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {getModalDescription()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {(actionType === 'review' && isUnderReview) || (actionType === 'approval' && isPendingApproval) ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {getStatusLabel()}
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {existingReviews.length > 0 ? (
                    existingReviews.map((review, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                              <span className="text-lg font-medium text-blue-600">
                                {(actionType === 'review' ? review.reviewerName : review.approverName)?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {actionType === 'review' ? review.reviewerName : review.approverName}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {actionType === 'review' ? review.reviewerRole : review.approverRole}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${review.status === 'Approved' ? 'bg-green-50 text-green-700' :
                            review.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                              'bg-yellow-50 text-yellow-700'
                            }`}>
                            {review.status === 'Approved' ? (
                              <Check className="w-3 h-3 mr-1.5" />
                            ) : review.status === 'Rejected' ? (
                              <X className="w-3 h-3 mr-1.5" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1.5" />
                            )}
                            {review.status}
                          </span>
                        </div>

                        {review.comments && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 mb-1">Rejection Reason</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {review.comments}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <Users className="w-full h-full" />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {actionType === 'review' ? "No reviewers assigned" : "No approvers assigned"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {actionType === 'review'
                          ? "Assign team members to review this document"
                          : "Assign team members to approve this document"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {getStatusLabel()}
                    </label>
                    <span className="text-xs text-gray-500">
                      {selectedWorkers.length} selected
                    </span>
                  </div>

                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name or role..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {filteredWorkers.length > 0 ? (
                        filteredWorkers.map(worker => (
                          <div
                            key={worker._id}
                            className={`p-3 rounded-lg flex items-center cursor-pointer transition-all ${selectedWorkers.includes(worker._id)
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-white border border-gray-100 hover:border-blue-100'
                              }`}
                            onClick={() => toggleWorkerSelection(worker._id)}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${selectedWorkers.includes(worker._id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                              }`}>
                              {selectedWorkers.includes(worker._id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {worker.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{worker.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{worker.role}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center">
                          <div className="mx-auto h-10 w-10 text-gray-400">
                            <Search className="w-full h-full" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No matching {actionType === 'review' ? 'reviewers' : 'approvers'}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSend(selectedWorkers)}
                    disabled={selectedWorkers.length === 0 || actionLoading}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-colors flex items-center justify-center ${selectedWorkers.length === 0 || actionLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      }`}
                  >
                    {actionLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      getButtonText()
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleSendForReview = (id) => {
    setSopToApprove(id);
    setModalActionType('review');
    const sop = sopData.find(item => item._id === id);
    setReviewSop(sop);
    setShowReviewModal(true);
    fetchWorkers("Review Access");
  };

  const handleSendForApproval = (id) => {
    setSopToApprove(id);
    setModalActionType('approval');
    const sop = sopData.find(item => item._id === id);
    setReviewSop(sop);
    setShowReviewModal(true);
    fetchWorkers("Approve Checklist");
  };

  const confirmAction = async (selectedWorkerIds) => {
    if (!sopToApprove || selectedWorkerIds.length === 0) return;

    if (modalActionType === 'review') {
      setReviewLoading(true);
      try {
        const reviews = selectedWorkerIds.map(workerId => {
          const worker = workersList.find(w => w._id === workerId);
          return {
            reviewerId: workerId,
            reviewerName: worker ? worker.name : 'Unknown',
            reviewerRole: worker ? worker.role : 'undefined',
            status: 'Pending Review',
            reviewDate: new Date().toISOString(),
          };
        });

        const res = await fetch(`/api/checklistapi/update-status/${sopToApprove}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Under Review",
            reviews
          }),
        });

        if (res.ok) {
          setSopData(sopData.map(item =>
            item._id === sopToApprove ? {
              ...item,
              status: "Under Review",
              approvalSent: true,
              reviews
            } : item
          ));
          setShowReviewModal(false);
          setSopToApprove(null);
          setSelectedWorkers([]);
        }
      } catch (err) {
        console.error("Failed to send for review:", err);
      } finally {
        setReviewLoading(false);
      }
    } else if (modalActionType === 'approval') {
      setApprovalLoading(true);
      try {
        const approvers = selectedWorkerIds.map(workerId => {
          const worker = workersList.find(w => w._id === workerId);
          return {
            approverId: workerId,
            approverName: worker ? worker.name : 'Unknown',
            approverRole: worker ? worker.role : 'undefined',
            status: 'Pending Approval',
            approvalDate: new Date().toISOString(),
          };
        });

        const res = await fetch(`/api/checklistapi/update-status/${sopToApprove}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Pending Approval",
            approvers
          }),
        });

        if (res.ok) {
          setSopData(sopData.map(item =>
            item._id === sopToApprove ? {
              ...item,
              status: "Pending Approval",
              approvalSent: true,
              approvers
            } : item
          ));
          setShowReviewModal(false);
          setSopToApprove(null);
          setSelectedWorkers([]);
        }
      } catch (err) {
        console.error("Failed to send for approval:", err);
      } finally {
        setApprovalLoading(false);
      }
    }
  };

  const SkeletonTableRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-200"></div>
          <div className="ml-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="h-8 bg-gray-200 rounded-full w-16 mx-auto"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
      </td>
    </tr>
  )

  const handleCreate = () => {
    setNavigatingToCreate(true);
    router.push("/dashboard/create-checklist/creation")
  }

  const handleApprove = async (id) => {
    setSopToApprove(id);
    setShowApprovalConfirm(true);
  }

  const confirmApproval = async () => {
    if (sopToApprove) {
      setApprovalLoading(true);
      try {
        const res = await fetch(`/api/checklistapi/update-status/${sopToApprove}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Pending Approval" }),
        });

        if (res.ok) {
          setSopData(sopData.map(item =>
            item._id === sopToApprove ? { ...item, status: "Pending Approval", approvalSent: true } : item
          ));
          setShowApprovalConfirm(false);
          setSopToApprove(null);
        }
      } catch (err) {
        console.error("Failed to send approval request:", err);
        setApprovalLoading(false);
        setShowApprovalConfirm(false);
        setSopToApprove(null);
      }
    }
  }

  const cancelApproval = () => {
    setShowApprovalConfirm(false);
    setSopToApprove(null);
  }

  const handleEdit = (sop) => {
    router.push(`/dashboard/create-checklist/edit-checklist/${sop._id}`)
  }

  const handleDelete = (id) => {
    setSopToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (sopToDelete) {
      setDeleteLoading(true);
      try {
        await fetch(`/api/checklistapi/delete/${sopToDelete}`, {
          method: "DELETE",
        });
        setSopData(sopData.filter((item) => item._id !== sopToDelete));
        setShowDeleteConfirm(false);
        setDeleteLoading(false)
        setSopToDelete(null);
      } catch (err) {
        console.error("Failed to delete SOP:", err);
        setDeleteLoading(false);
        setShowDeleteConfirm(false);
        setSopToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSopToDelete(null);
  };

  const handleView = (sop) => {
    setSelectedSop(sop)
  }

  const closeModal = () => {
    setSelectedSop(null)
  }

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDuration = (minutes) => {
    if (!minutes) return "Not set"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatTimeObject = (timeObj) => {
    if (!timeObj) return "Not set"
    const { hours = 0, minutes = 0, seconds = 0 } = timeObj
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    if (minutes > 0) return `${minutes}m ${seconds}s`
    return `${seconds}s`
  }

  const handleFormChange = (path, value) => {
    if (path === 'stages') {
      setEditingSop(prev => ({ ...prev, stages: value }))
    } else {
      const pathParts = path.split('.')
      setEditingSop(prev => {
        const newValue = { ...prev }
        let current = newValue

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i]
          if (!current[part]) current[part] = {}
          current = current[part]
        }

        current[pathParts[pathParts.length - 1]] = value
        return newValue
      })
    }
  }

  const renderTask = (task, level = 0, taskNumber = "1") => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isExpanded = expandedTasks[task.id || task._id] || false
    const taskId = task.id || task._id
    const isZeroTime = (time) =>
      time &&
      time.hours === 0 &&
      time.minutes === 0 &&
      time.seconds === 0;

    const shouldShowDurationInfo =
      (task.minDuration && task.minDuration > 0) ||
      (task.maxDuration && task.maxDuration > 0) ||
      (task.minTime && !isZeroTime(task.minTime)) ||
      (task.maxTime && !isZeroTime(task.maxTime));

    return (
      <div
        key={taskId}
        className={`border-2 ${level % 2 === 0 ? "border-blue-200 bg-blue-50 rounded-xl m-2" : "border-purple-200 rounded-xl bg-purple-50"} p-4 mb-3`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {hasSubtasks && (
              <button onClick={() => toggleTaskExpansion(taskId)} className="text-gray-600 hover:text-gray-800">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <span className="font-medium text-gray-900">
              {taskNumber}. {task.title || "Untitled Task"}
            </span>
          </div>
        </div>

        <div className="space-y-3 ml-6">
          {task.description && (
            <div>
              <div className="flex items-center gap-2 text-sm mb-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Description:</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">{task.description}</p>
            </div>
          )}

          {shouldShowDurationInfo && (
            <div className="bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Timer className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Duration Information:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
                {(task.minTime || task.maxTime) && (
                  <div>
                    <span className="text-gray-600">Minimum Duration: </span>
                    <span className="font-medium">
                      {task.minTime}
                    </span>
                  </div>
                )}
                {(task.minTime || task.maxTime) && (
                  <div>
                    <span className="text-gray-600">Maximum Duration: </span>
                    <span className="font-medium">
                      {task.maxTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(task.galleryTitle || task.galleryDescription || task.imagePublicId) && (
            <div className="bg-slate-200 p-3 rounded-lg border">
              <div className="flex items-center gap-2 text-sm mb-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Image Metadata:</span>
              </div>
              <div className="space-y-1 text-sm ml-6">
                {task.imageTitle && (
                  <div>
                    <span className="text-gray-600">Title: </span>
                    <span className="font-medium">{task.galleryTitle}</span>
                  </div>
                )}
                {task.galleryDescription && (
                  <div>
                    <span className="text-gray-600">Description: </span>
                    <span className="font-medium">{task.galleryDescription}</span>
                  </div>
                )}
              </div>
              {task.images?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span className="font-base">Attached Images ({task.images.length}):</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6">
                    {task.images.map((image, idx) =>
                      image?.url ? (
                        <div key={idx} className="border rounded-lg overflow-hidden bg-white">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={image.name || `Image ${idx + 1}`}
                            width={200}
                            height={120}
                            className="w-full h-24 object-cover"
                          />
                          {image.name && (
                            <div className="p-2">
                              <p className="text-xs text-gray-600 truncate">{image.name}</p>
                            </div>
                          )}
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {hasSubtasks && isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ChevronDown className="w-4 h-4" />
              <span>Subtasks ({task.subtasks.length}):</span>
            </div>
            {task.subtasks.map((subtask, index) => renderTask(subtask, level + 1, `${taskNumber}.${index + 1}`))}
          </div>
        )}
      </div>
    )
  }

  const [companyData, setCompanyData] = useState();


  useEffect(() => {
    const userData = localStorage.getItem('user')
    const data = JSON.parse(userData)
    setCompanyData(data)
  }, [])

  useEffect(() => {
    const fetchSops = async () => {
      try {
        setLoading(true)
        setFiltering(true)
        const res = await fetch("/api/checklistapi/fetchAll")
        const data = await res.json()
        setTimeout(() => {
          const filtered = data.data.filter(item => item.companyId === companyData?.companyId && item.userId == companyData?.id)
          setSopData(filtered)
          setFiltering(false)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error("Failed to fetch SOPs:", err)
        setLoading(false)
        setFiltering(false)
      }
    }

    if (companyData) {
      fetchSops()
    }
  }, [companyData])

  const enhancedSopData = sopData.map((item, index) => {
    const Icon = icons[index % icons.length]
    const color = colors[index % colors.length]
    return {
      ...item,
      id: item._id,
      icon: <Icon className={`w-5 h-5 ${color.text}`} />,
      bgColor: color.bg,
      gradient: color.gradient,
      formattedDate: formatDate(item.createdAt),
      status: item.status || "Pending Approval",
    }
  })

  const getStatusBadge = (status) => {
    const statusMap = {
      InProgress: {
        color: "bg-blue-100 text-green-800",
        icon: <Check className="w-3 h-3" />,
        text: "InProgress"
      },
      'Approved Review': {
        color: "bg-green-100 text-green-800",
        icon: <Check className="w-3 h-3" />,
        text: "Approved Review"
      },
      Approved: {
        color: "bg-green-100 text-green-800",
        icon: <Check className="w-3 h-3" />,
        text: "Approved"
      },
      'Pending Approval': {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Circle className="w-3 h-3" />,
        text: "Pending Approval"
      },
      'Under Review': {
        color: "bg-yellow-100 text-orange-800",
        icon: <Circle className="w-3 h-3" />,
        text: "Under Review"
      },
      'Rejected Review': {
        color: "bg-red-100 text-red-800",
        icon: <X className="w-3 h-3" />,
        text: "Rejected Review"
      },
      Rejected: {
        color: "bg-red-100 text-red-800",
        icon: <X className="w-3 h-3" />,
        text: "Rejected"
      }
    }

    const statusConfig = statusMap[status] || statusMap.pending

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.icon}
        <span className="ml-1">{statusConfig.text}</span>
      </span>
    )
  }
  useEffect(() => {

    fetchUserById(selectedSop?.userId);

  }, [selectedSop]);
  const [name, setNAme] = useState();
  const fetchUserById = async (id) => {
    const res = await fetch(`/api/users/fetch-by-id/${id}`);
    const data = await res.json();
    console.log("asdfasdf", data?.user?.name);
    setNAme(data?.user?.name);

  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative ">
      <div className="bg-white border-b border-gray-200 rounded-xl mx-2 mt-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checklist Workspace</h1>
              <p className="text-gray-600 mt-2 text-md">Manage and track your development processes</p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={navigatingToCreate}
            className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center space-x-3 shadow hover:bg-blue-700 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {navigatingToCreate ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create New</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-4">
        <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search checklists..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by:
              </label>
              <select
                id="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                defaultValue="all"
              >
                <option value="all">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Approval">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {loading || filtering ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checklist
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stages
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval / Review
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonTableRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : enhancedSopData.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Checklist
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stages
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval / Review
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enhancedSopData.map((sop) => (
                    <tr key={sop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${sop.bgColor}`}>
                            {sop.icon}
                          </div> */}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[180px] capitalize" title={sop.name} >{sop.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{sop.stages?.length || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sop.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 uppercase"> {new Date(sop.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {sop.status === "InProgress" || sop.status === "Under Review" || sop.status === "Rejected Review" ?
                          (<div className=" py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleSendForReview(sop.id)}
                              className={`px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white  hover:bg-[#2791b8] ${sop.status === "Under Review" ? "bg-orange-400" : sop.status === "Rejected Review" ? "bg-red-400" : "bg-green-500"}`}
                              title="Send for Review"
                            >
                              {sop.status === "Under Review" || sop.status === "Rejected Review" ? "View Reviewer's" : "Send for Review"}
                            </button>
                          </div>
                          ) : sop.status === "Approved Review" || sop.status == "Pending Approval" || sop.status == "Rejected" ? (
                            <div className=" py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleSendForApproval(sop.id)}
                                className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-[#2791b8]"
                                title="Send for Approval"
                              >
                                {sop.status == "Pending Approval" || sop.status == "Rejected" ? "View Approver's" : " Send for Approval"}
                              </button>
                            </div>
                          ) : (<></>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex h-8 items-center justify-end gap-6">
                          <div className="flex justify-end space-x-2">
                            {sop.status == 'InProgress' || sop.status == 'Rejected' || sop.status == 'Rejected Review' ?
                             <button
                              onClick={() => handleEdit(sop)}
                              className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button> : <></>}

                            <button
                              onClick={() => handleView(sop)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(sop.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No checklists available</h3>
              <p className="text-gray-500 max-w-md">
                You haven't created any checklists yet. Get started by creating your first checklist.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedSop && (
        <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative  rounded-xl bg-white shadow-xl w-full max-w-5xl h-[85vh] flex flex-col mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white rounded-t-xl p-4  pb-4 border-b flex items-start justify-between z-20">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{selectedSop.name}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                  {selectedSop.stages && (
                    <span className="flex items-center">
                      <Layers className="w-4 h-4 mr-1.5" />
                      {selectedSop.stages.length} Stages
                    </span>
                  )}
                  <span className="flex items-center">
                    {getStatusBadge(selectedSop.status)}
                  </span>
                  {selectedSop.rejectionReason && (
                    <div className="font-semibold capitalize">
                      reason: {selectedSop.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-8 overflow-y-auto flex-1 hide-scrollbar">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Checklist Information
                  </h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Checklist Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Checklist Name
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedSop.name || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedSop.department || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Document Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Number
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedSop.documentNumber || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Version */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Version
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedSop.version || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* QMS Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        QMS Number
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedSop.qms_number || 'Not specified'}
                        </p>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {/* ---- Stages ---- */}
                {[...selectedSop.stages || []]
                  .sort((a, b) => {
                    if (a.title === "Default Stage") return 1;
                    if (b.title === "Default Stage") return -1;
                    return 0;
                  })
                  .map((stage, stageIndex) => (
                  <div
                    key={stage._id}
                    className="border border-gray-300 overflow-hidden rounded-xl"
                  >
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg text-gray-800">{stage.title}</h3>
                        <span className="ml-auto text-sm text-gray-500">
                          {stage.tasks?.length || 0} tasks
                        </span>
                      </div>
                      {stage.description && (
                        <p className="mt-2 text-sm text-gray-600 ml-9">
                          {stage.description}
                        </p>
                      )}
                    </div>

                    <div className="divide-y divide-gray-100">
                      {stage.tasks?.length > 0 ? (
                        stage.tasks.map((task, taskIndex) =>
                          renderTask(task, 0, `${stageIndex + 1}.${taskIndex + 1}`)
                        )
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No tasks in this stage</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}


                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Table className="w-4 h-4 text-blue-600" />
                      Visual Representation
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check Point
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Production
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            QA
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedSop.visualRepresntation?.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            {/* Check Point Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">

                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 capitalize">
                                    {item.checkPoint?.title || 'No Title'}
                                  </div>
                                  {/* Images */}
                                  {item.checkPoint?.images && item.checkPoint.images.length > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                      {item.checkPoint.images.map((image, imgIndex) => (
                                        <img
                                          key={imgIndex}
                                          src={image.url}
                                          alt={`Checkpoint ${index + 1} - Image ${imgIndex + 1}`}
                                          className="h-8 w-8 rounded border border-gray-200 object-cover hover:scale-110 transition-transform cursor-pointer"
                                          onClick={() => window.open(image.url, '_blank')}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>

                                {item.cleaningStatus === 'Visually Clean' ? 'Clean' : (item.cleaningStatus || 'Clean')}
                              </span>
                            </td>

                            {/* Production Column */}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium `}>

                                {item.production || 'Not Set'}
                              </span>
                            </td>

                            {/* QA Column */}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ">

                                {item.qa || 'Not Set'}
                              </span>
                            </td>
                          </tr>
                        ))}

                      </tbody>
                    </table>

                    {/* Empty State */}
                    {(!selectedSop.visualRepresntation || selectedSop.visualRepresntation.length === 0) && (
                      <div className="text-center py-12 bg-gray-50">
                        <Table className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No Visual Data</h4>
                        <p className="text-gray-500 text-sm">
                          No visual representation data available for this SOP.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

{/* Default Stage (below Visual Representation) */}
{selectedSop?.defaultStage && (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <ListChecks className="w-4 h-4 text-blue-600" />
        {/* Default Stage{selectedSop.defaultStage.title ? `: ${selectedSop.defaultStage.title}` : ""} */}
        Default Stage
      </h3>
    </div>

    <div className="divide-y divide-gray-100">
      {Array.isArray(selectedSop.defaultStage.tasks) && selectedSop.defaultStage.tasks.length > 0 ? (
        selectedSop.defaultStage.tasks.map((task, taskIndex) =>
          // Reuse your existing task renderer
          renderTask(task, 0, `D.${taskIndex + 1}`)
        )
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50">
          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No tasks in the default stage</p>
        </div>
      )}
    </div>
  </div>
)}
                


                {/* ---- Contributors Section ---- */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    Contributors
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Created By */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Created By</h4>
                          <p className="text-sm text-gray-500 uppercase">

                            {selectedSop.createdAt ? new Date(selectedSop.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }) : 'Not reviewed'}
                          </p>

                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-md">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {companyData.name?.charAt(0) || 'C'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">

                          {name}
                        </span>
                      </div>
                    </div>

                    {/* Reviewers */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Reviewers</h4>
                            <p className="text-sm text-gray-500">
                              {selectedSop.reviews?.length || 0} assigned
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedSop.reviews && selectedSop.reviews.length > 0 ? (
                          selectedSop.reviews.map((review, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-medium text-yellow-800">
                                  {review.reviewerName?.charAt(0) || 'R'}
                                </div>
                                <span className="text-sm text-gray-700 truncate max-w-20">
                                  {review.reviewerName || 'Unknown'}
                                </span>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${review.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : review.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {review.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-2 text-gray-500 text-sm">
                            No reviewers assigned
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Approvers */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Approvers</h4>
                            <p className="text-sm text-gray-500">
                              {selectedSop.approvers?.length || 0} assigned
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedSop.approvers && selectedSop.approvers.length > 0 ? (
                          selectedSop.approvers.map((approver, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-800">
                                  {approver.approverName?.charAt(0) || 'A'}
                                </div>
                                <span className="text-sm text-gray-700 truncate max-w-20">
                                  {approver.approverName || 'Unknown'}
                                </span>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${approver.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : approver.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {approver.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-2 text-gray-500 text-sm">
                            No approvers assigned
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Tables (Collapsible) */}
                  {(selectedSop.reviews && selectedSop.reviews.length > 0) ||
                    (selectedSop.approvers && selectedSop.approvers.length > 0) ? (
                    <div className="mt-6 space-y-4">
                      {/* Reviewers Table */}
                      {selectedSop.reviews && selectedSop.reviews.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <Users className="w-4 h-4 text-yellow-600" />
                              Reviewers Details
                            </h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reviewer
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Comments
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedSop.reviews.map((review, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                          <span className="text-sm font-medium text-yellow-800">
                                            {review.reviewerName?.charAt(0) || 'R'}
                                          </span>
                                        </div>
                                        <div className="ml-3">
                                          <div className="text-sm font-medium text-gray-900">
                                            {review.reviewerName || 'Unknown'}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                                      {review.reviewerRole || 'Not specified'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${review.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : review.status === 'Rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {review.status === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                                        {review.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                                        {review.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {review.reviewDate ? new Date(review.reviewDate).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      }) : 'Not reviewed'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                      {review.comments || 'No comments'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Approvers Table */}
                      {selectedSop.approvers && selectedSop.approvers.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Approvers Details
                            </h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Approver
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Comments
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedSop.approvers.map((approver, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                          <span className="text-sm font-medium text-green-800">
                                            {approver.approverName?.charAt(0) || 'A'}
                                          </span>
                                        </div>
                                        <div className="ml-3">
                                          <div className="text-sm font-medium text-gray-900">
                                            {approver.approverName || 'Unknown'}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                                      {approver.approverRole || 'Not specified'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${approver.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : approver.status === 'Rejected'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {approver.status === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                                        {approver.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                                        {approver.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {approver.approvalDate ? new Date(approver.approvalDate).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      }) : 'Not approved'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                      {approver.comments || 'No comments'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border border-gray-200 mt-4">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-1">No Contributors Assigned</h4>
                      <p className="text-gray-500 text-sm">
                        This checklist hasn't been sent for review or approval yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Approvers/Reviewers Table Modal */}
      {showApproversReviewersTable && selectedSop && (
        <div className="fixed pl-64 inset-0 z-50 overflow-auto bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between z-20">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Approvers & Reviewers</h2>
                <p className="text-gray-600 mt-1">For: {selectedSop.name}</p>
                created By : {companyData.name}
              </div>
              <button
                onClick={() => setShowApproversReviewersTable(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {/* Reviewers Table */}
              {selectedSop.reviews && selectedSop.reviews.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Reviewers ({selectedSop.reviews.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Review Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Comments
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedSop.reviews.map((review, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {review.reviewerName?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {review.reviewerName || 'Unknown'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {review.reviewerRole || 'Not specified'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${review.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : review.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {review.status === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                                {review.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                                {review.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {review.reviewDate ? new Date(review.reviewDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }) : 'Not reviewed'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {review.comments || 'No comments'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Approvers Table */}
              {selectedSop.approvers && selectedSop.approvers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Approvers ({selectedSop.approvers.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Approval Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Comments
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedSop.approvers.map((approver, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-green-600">
                                    {approver.approverName?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {approver.approverName || 'Unknown'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {approver.approverRole || 'Not specified'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${approver.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : approver.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {approver.status === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                                {approver.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                                {approver.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {approver.approvalDate ? new Date(approver.approvalDate).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }) : 'Not approved'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {approver.comments || 'No comments'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {(!selectedSop.reviews || selectedSop.reviews.length === 0) &&
                (!selectedSop.approvers || selectedSop.approvers.length === 0) && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Approvers or Reviewers</h3>
                    <p className="text-gray-500">
                      This checklist hasn't been sent for review or approval yet.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Other Modals */}
      {showDurationModal && (
        <DurationModal
          onClose={() => setShowDurationModal(false)}
          onSave={(durationData) => {
            setEditingSop(prev => {
              const newValue = { ...prev }
              let current = newValue

              for (const part of activeDurationPath.split('.')) {
                current = current[part]
              }

              current.minTime = durationData.minTime
              current.maxTime = durationData.maxTime

              return newValue
            })
            setShowDurationModal(false)
          }}
          initialMinTime={
            (() => {
              let current = { ...editingSop }
              for (const part of activeDurationPath.split('.')) {
                current = current[part]
              }
              return current.minTime || { hours: 0, minutes: 0, seconds: 0 }
            })()
          }
          initialMaxTime={
            (() => {
              let current = { ...editingSop }
              for (const part of activeDurationPath.split('.')) {
                current = current[part]
              }
              return current.maxTime || { hours: 0, minutes: 0, seconds: 0 }
            })()
          }
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Checklist</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this checklist? This action cannot be undone.</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                >
                  {deleteLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApprovalConfirm && (
        <div className="fixed pl-64 inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Send for Approval</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to send this checklist for approval?</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelApproval}
                  disabled={approvalLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  disabled={approvalLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                >
                  {approvalLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send for Approval"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <ImageAttachmentModal
          onClose={() => setShowImageModal(false)}
          onSave={handleImageSave}
          initialDescription={(() => {
            let current = { ...editingSop };
            for (const part of activeImagePath.split('.')) {
              current = current[part];
            }
            return current.imageDescription || '';
          })()}
          initialTitle={(() => {
            let current = { ...editingSop };
            for (const part of activeImagePath.split('.')) {
              current = current[part];
            }
            return current.imageTitle || '';
          })()}
          initialPhotos={(() => {
            let current = { ...editingSop };
            for (const part of activeImagePath.split('.')) {
              current = current[part];
            }
            return current.attachedImages || [];
          })()}
        />
      )}

      {showReviewModal && (
        <ReviewApprovalModal
          onClose={() => {
            setShowReviewModal(false);
            setSelectedWorkers([]);
          }}
          onSend={confirmAction}
          workers={workersList}
          loading={loadingWorkers}
          selectedWorkers={selectedWorkers}
          setSelectedWorkers={setSelectedWorkers}
          sopStatus={reviewSop?.status}
          actionLoading={modalActionType === 'review' ? reviewLoading : approvalLoading}
          existingReviews={modalActionType === 'review' ? reviewSop?.reviews || [] : reviewSop?.approvers || []}
          actionType={modalActionType}
        />
      )}
    </div>
  )
}

export default SOPDashboard