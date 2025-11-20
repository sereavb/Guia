import React, { useState, useRef } from 'react';
import { Video, Upload, Loader2, AlertCircle } from 'lucide-react';
import { generateVeoVideo } from '../services/geminiService';

export const VideoCreator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setVideoUrl(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    const aiStudio = (window as any).aistudio;

    try {
      // Check for API Key selection via aistudio (Veo Requirement)
      if (aiStudio) {
         const hasKey = await aiStudio.hasSelectedApiKey();
         if (!hasKey) {
             await aiStudio.openSelectKey();
         }
      }

      const url = await generateVeoVideo(selectedImage, prompt, aspectRatio);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found") && aiStudio) {
          // Reset key flow
          setError("API Key issue detected. Please select your key again.");
          await aiStudio.openSelectKey();
      } else {
          setError("Video generation failed. Ensure you have a paid project selected for Veo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Veo Video Creator</h2>
        <p className="text-slate-600">Bring images to life with Veo 3.1.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all"
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
                <img src={previewUrl} className="w-full h-32 object-cover rounded-md" alt="Source" />
            ) : (
                <div className="text-slate-500">
                    <Upload className="mx-auto mb-2" />
                    <span className="text-sm">Upload Source Image</span>
                </div>
            )}
          </div>

          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prompt (Optional)</label>
              <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={3}
                placeholder="e.g. Cinematic lighting, camera pans right..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
          </div>

          <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                  <button 
                    className={`p-2 text-sm rounded-md border ${aspectRatio === '16:9' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                    onClick={() => setAspectRatio('16:9')}
                  >
                    Landscape (16:9)
                  </button>
                  <button 
                    className={`p-2 text-sm rounded-md border ${aspectRatio === '9:16' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                    onClick={() => setAspectRatio('9:16')}
                  >
                    Portrait (9:16)
                  </button>
              </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedImage || loading}
            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${!selectedImage || loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Video />}
            {loading ? 'Generating...' : 'Generate Video'}
          </button>
          
          {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {error}
              </div>
          )}
          
          <p className="text-xs text-slate-400">
             Note: Video generation may take a minute. Paid project required.
          </p>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 bg-black rounded-2xl overflow-hidden flex items-center justify-center min-h-[400px] relative shadow-2xl">
            {loading ? (
                <div className="text-center text-white/80">
                    <Loader2 className="animate-spin mx-auto mb-4 h-12 w-12 text-indigo-500" />
                    <p className="text-lg font-light">Dreaming up your video...</p>
                    <p className="text-xs text-white/40 mt-2">Using Veo 3.1 Fast Preview</p>
                </div>
            ) : videoUrl ? (
                <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full max-h-[600px]" 
                />
            ) : (
                <div className="text-white/30 flex flex-col items-center">
                    <Video size={64} className="mb-4" />
                    <p>Generated video will play here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};