// src/components/ui/AdminUploadPanel.jsx
import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function AdminUploadPanel({ onUploadSuccess }) {
  const [modelName, setModelName] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !modelName) return alert('Please provide both a model name and a GLB file.');

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('models')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('models')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('three_models')
        .insert([{ name: modelName, file_url: publicUrl }]);

      if (dbError) throw dbError;

      setModelName('');
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('Upload sequence faulted:', error.message);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-black border-2 border-white p-6 sm:p-8 mb-8 relative">
      <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Upload File</h3>
      
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white mb-2">Model Name</label>
          <input 
            type="text" 
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="e.g., ARCH-01" 
            className="w-full px-4 py-3 bg-black border-2 border-white focus:outline-none focus:bg-white focus:text-black transition-colors text-sm text-white rounded-none"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white mb-2">Binary Source (.glb)</label>
          <input 
            type="file" 
            accept=".glb"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-white file:mr-4 file:py-3 file:px-6 file:border-2 file:border-white file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-black file:text-white hover:file:bg-white hover:file:text-black file:transition-colors cursor-pointer rounded-none"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={uploading}
          className="w-full mt-4 py-4 bg-white text-black border-2 border-white font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50 rounded-none flex justify-center items-center gap-3"
        >
          {uploading ? 'Processing...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}