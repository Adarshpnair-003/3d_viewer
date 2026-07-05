// src/App.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import ModelViewer from './components/three/ModelViewer';
import AdminUploadPanel from './components/ui/AdminUploadPanel';

export default function App() {
  const [models, setModels] = useState([]);
  const [selectedModelUrl, setSelectedModelUrl] = useState('/test-model.glb');
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('three_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels(data || []);
      
      if (data && data.length > 0) {
        setSelectedModelUrl(data[0].file_url);
      }
    } catch (error) {
      console.error('Error fetching database catalog:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black">
      <div className="p-6 lg:p-12 max-w-[1600px] mx-auto min-h-screen flex flex-col">
        
        {/* Header Banner */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b-4 border-white pb-8 gap-4">
          <div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase text-white">
              3D Viewer.
            </h1>
          </div>
        </header>

        {/* Main Grid View */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-grow">
          
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col">
            <AdminUploadPanel onUploadSuccess={fetchModels} />

            {/* Inventory List */}
            <div className="flex-grow flex flex-col bg-black border-2 border-white p-6">
              <div className="flex justify-between items-end mb-8 border-b-2 border-white pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  Directory
                </h3>
                <span className="bg-white text-black text-xs py-1 px-2 font-bold">
                  {models.length}
                </span>
              </div>
              
              {loading ? (
                <div className="py-10 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest animate-pulse text-white">Syncing...</p>
                </div>
              ) : models.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Empty Directory</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto pr-4 custom-scrollbar">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelUrl(model.file_url)}
                      className={`w-full text-left px-5 py-4 border-2 text-xs font-bold uppercase tracking-wider transition-colors flex justify-between items-center group rounded-none ${
                        selectedModelUrl === model.file_url
                          ? 'border-white bg-white text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                          : 'border-zinc-800 bg-black text-white hover:border-white hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
                      }`}
                    >
                      <span className="truncate pr-4">{model.name}</span>
                      <span className={`text-[10px] px-2 py-1 ${
                        selectedModelUrl === model.file_url ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        GLB
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 3D Canvas */}
          <div className="lg:col-span-8 flex flex-col bg-black border-2 border-white p-2 relative min-h-[600px] lg:h-auto">
            {/* Top Canvas Bar */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 pointer-events-none">
              <h2 className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-2 border-2 border-white">
                Viewport
              </h2>
              <div className="bg-black text-white border-2 border-white px-3 py-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px] block">
                  {selectedModelUrl.split('/').pop()}
                </span>
              </div>
            </div>

            {/* The 3D Engine Wrapper */}
            <div className="w-full h-full bg-neutral-900 border-2 border-white">
               <ModelViewer modelUrl={selectedModelUrl} />
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}