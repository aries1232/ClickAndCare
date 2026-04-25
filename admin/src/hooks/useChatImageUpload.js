import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadChatImage } from '../services/chatApi';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — chat upload cap

const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!file.type?.startsWith('image/')) return { valid: false, error: 'Please select an image file' };
  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return { valid: false, error: `Image is too large (${mb} MB). Max 5 MB.` };
  }
  return { valid: true };
};

export const useChatImageUpload = ({ onUploaded }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = () => fileInputRef.current?.click();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { valid, error } = validateImageFile(file);
    if (!valid) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const data = await uploadChatImage(file);
      if (data.success) {
        onUploaded({ fileUrl: data.fileUrl, fileName: data.fileName, fileSize: data.fileSize });
      } else {
        toast.error('Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return { fileInputRef, uploading, openPicker, handleFileSelect };
};
