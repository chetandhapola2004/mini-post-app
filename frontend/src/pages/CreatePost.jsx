import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UploadIcon, ArrowLeftIcon, CloseIcon, CheckIcon, ImageIcon } from '../components/Icons';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      showToast('error', 'Please choose an image for your post.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('caption', caption);

    try {
      await axios.post('https://mern-feed-backend.onrender.com/create-post', formData);
      showToast('success', 'Post published successfully!');
      setTimeout(() => {
        navigate('/feed');
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to publish post. Please check backend status.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <Link to="/feed" className="back-link">
          <ArrowLeftIcon size={16} />
          <span>Back to Feed</span>
        </Link>
      </div>

      <div className="create-post-card">
        <div className="card-header">
          <h1 className="create-title">Create a Post</h1>
          <p className="create-subtitle">Share your perspective with high-quality media</p>
        </div>

        {toast && (
          <div className={`toast-banner toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckIcon size={16} /> : <CloseIcon size={16} />}
            <span>{toast.message}</span>
          </div>
        )}

        <form className="create-form" onSubmit={handleSubmit}>
          {/* Media Upload Area */}
          <div className="form-group">
            <label className="form-label">Media Upload</label>
            
            <div
              className={`dropzone-area ${isDragging ? 'dropzone-active' : ''} ${imagePreview ? 'dropzone-has-preview' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={onFileInputChange}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div className="preview-container">
                  <img src={imagePreview} alt="Selected preview" className="image-preview" />
                  <div className="preview-overlay">
                    <span className="change-hint">Click or drop to replace image</span>
                    <button type="button" className="btn-remove-preview" onClick={removeImage} title="Remove image">
                      <CloseIcon size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dropzone-empty">
                  <div className="dropzone-icon-box">
                    <UploadIcon size={26} />
                  </div>
                  <div className="dropzone-text">
                    <p className="dropzone-primary-text">
                      <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p className="dropzone-secondary-text">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption Input */}
          <div className="form-group">
            <div className="label-with-count">
              <label className="form-label" htmlFor="caption">Caption</label>
              <span className="character-count">{caption.length} / 250</span>
            </div>
            <textarea
              id="caption"
              className="caption-input"
              rows={4}
              maxLength={250}
              placeholder="What makes this shot memorable? Add a caption or context..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`btn-submit-post ${isSubmitting ? 'btn-submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                <span>Publishing Post...</span>
              </>
            ) : (
              <span>Publish Post</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;