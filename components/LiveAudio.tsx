import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Volume2 } from 'lucide-react';
import { ai } from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

export const LiveAudio: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const stopAudio = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    // Stop all playing sources
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    setIsConnected(false);
    setIsSpeaking(false);
  };

  const startSession = async () => {
    try {
      addLog("Initializing audio context...");
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      addLog("Requesting mic access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      addLog("Connecting to Gemini Live API...");
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            addLog("Connection established!");
            setIsConnected(true);
            
            if (!inputAudioContextRef.current) return;

            // Setup Input Stream
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            if (base64Audio && outputAudioContextRef.current) {
                setIsSpeaking(true);
                const ctx = outputAudioContextRef.current;
                
                // Sync time
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                    decode(base64Audio),
                    ctx,
                    24000,
                    1
                );
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                
                source.addEventListener('ended', () => {
                    sourcesRef.current.delete(source);
                    if (sourcesRef.current.size === 0) setIsSpeaking(false);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
            }

            // Handle interruption
            if (message.serverContent?.interrupted) {
                addLog("Interrupted by user");
                sourcesRef.current.forEach(src => {
                    try { src.stop(); } catch (e) {}
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
            }
          },
          onclose: () => {
            addLog("Session closed");
            stopAudio();
          },
          onerror: (e) => {
            console.error(e);
            addLog("Error occurred");
            stopAudio();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: "You are a helpful, witty AI assistant. Keep responses concise and conversational."
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start session", err);
      addLog("Failed to start: " + (err as Error).message);
      stopAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Live Voice Conversation</h2>
        <p className="text-slate-600">Talk naturally with Gemini 2.5 using the Live API.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
        {/* Visualizer Background Effect */}
        {isConnected && (
          <div className={`absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white transition-opacity duration-500 ${isSpeaking ? 'opacity-100' : 'opacity-20'}`} />
        )}

        {/* Status Indicator */}
        <div className="z-10 mb-8">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isConnected ? 'bg-indigo-100 shadow-indigo-200 shadow-lg' : 'bg-slate-100'}`}>
             {isConnected ? (
                 <div className={`relative`}>
                     <Volume2 size={48} className={`text-indigo-600 ${isSpeaking ? 'animate-pulse' : ''}`} />
                     {isSpeaking && (
                         <span className="absolute -top-1 -right-1 flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                         </span>
                     )}
                 </div>
             ) : (
                 <MicOff size={48} className="text-slate-400" />
             )}
          </div>
        </div>

        <div className="z-10 w-full max-w-xs space-y-4">
            {!isConnected ? (
                <button 
                    onClick={startSession}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                    <Mic size={24} /> Start Conversation
                </button>
            ) : (
                <button 
                    onClick={stopAudio}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-lg shadow-lg shadow-red-200 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                    <MicOff size={24} /> End Session
                </button>
            )}
        </div>
        
        {/* Logs / Status Text */}
        <div className="mt-8 z-10 h-20 w-full text-center">
           {logs.length > 0 && (
               <p className="text-slate-400 text-sm font-mono animate-pulse">
                   <Activity size={12} className="inline mr-1" /> {logs[0]}
               </p>
           )}
        </div>
      </div>
    </div>
  );
};
