import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadChatImage } from '../services/chatApi';
import { validateImageFile } from '../utils/validators';

export const useChatImageUpload = ({ onUploaded }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = () => fileInputRef.current?.click();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
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
