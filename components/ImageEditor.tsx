import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Download, Loader2 } from 'lucide-react';
import { editImage } from '../services/geminiService';

export const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;
    
    setLoading(true);
    try {
      const result = await editImage(selectedImage, prompt);
      setResultUrl(result);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to edit image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Image Editor</h2>
        <p className="text-slate-600">Upload a photo and use natural language to edit it. e.g., "Add a retro filter" or "Remove the background person".</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${previewUrl ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*"
            />
            
            {previewUrl ? (
              <img src={previewUrl} alt="Original" className="max-h-64 mx-auto rounded-lg shadow-sm object-contain" />
            ) : (
              <div className="py-10">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-indigo-600" size={24} />
                </div>
                <p className="font-medium text-slate-700">Click to upload an image</p>
                <p className="text-xs text-slate-400 mt-2">JPG, PNG supported</p>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Editing Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to change the image..."
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 text-slate-700"
            />
            <button
              onClick={handleGenerate}
              disabled={!selectedImage || !prompt || loading}
              className={`w-full mt-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                !selectedImage || !prompt || loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
              }`}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Processing...</>
              ) : (
                <><Sparkles size={20} /> Generate Edit</>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-100 rounded-2xl p-1 border border-slate-200 flex flex-col">
          <div className="flex-grow flex items-center justify-center p-6 bg-slate-50/50 rounded-xl min-h-[400px]">
            {resultUrl ? (
              <img src={resultUrl} alt="Edited result" className="max-w-full max-h-[500px] rounded-lg shadow-lg object-contain" />
            ) : (
              <div className="text-center text-slate-400">
                <Sparkles className="mx-auto mb-3 opacity-20" size={48} />
                <p>Edited image will appear here</p>
              </div>
            )}
          </div>
          {resultUrl && (
            <div className="p-4 flex justify-end">
              <a 
                href={resultUrl} 
                download="edited-image.png"
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Download size={16} /> Save Image
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
