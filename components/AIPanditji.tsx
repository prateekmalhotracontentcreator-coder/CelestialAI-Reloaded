import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decodeAudioData, createPcmBlob } from '../services/audioUtils';

const AIPanditji: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  
  // Refs for state management (Fixes stale closures in callbacks)
  const isConnectedRef = useRef(false);
  
  // Refs for audio context and resources
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sync ref with state
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // Session Timer
  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Cleanup function - SAFELY IMPLEMENTED
  const cleanup = () => {
    // 1. Stop Microphone Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 2. Close Input Context safely
    if (inputContextRef.current) {
      if (inputContextRef.current.state !== 'closed') {
        inputContextRef.current.close().catch(e => console.warn("Input context close error:", e));
      }
      inputContextRef.current = null;
    }

    // 3. Close Output Context safely
    if (outputContextRef.current) {
      if (outputContextRef.current.state !== 'closed') {
        outputContextRef.current.close().catch(e => console.warn("Output context close error:", e));
      }
      outputContextRef.current = null;
    }

    // 4. Cancel Visualizer
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // 5. Stop all playing audio sources
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) { /* Ignore if already stopped */ }
    });
    sourcesRef.current.clear();

    setIsConnected(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => cleanup();
  }, []);

  // --- VISUALIZATION ENGINE (Wave Methodology) ---
  useEffect(() => {
    const renderWave = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Resize canvas to match display size for sharpness
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
      }

      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Get Audio Data
      let amplitude = 0;
      if (analyserRef.current && isConnected) {
        try {
            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserRef.current.getByteTimeDomainData(dataArray);

            // Calculate Root Mean Square (RMS) for amplitude
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
            const v = (dataArray[i] - 128) / 128; // Normalize -1 to 1
            sum += v * v;
            }
            amplitude = Math.sqrt(sum / bufferLength);
        } catch (e) {
            // Ignore analyser errors if context is closing
        }
      } else {
        // Idle animation amplitude (gentle breathing)
        amplitude = 0.05 + Math.sin(Date.now() / 1500) * 0.02;
      }

      // Boost amplitude for visual impact during speech
      const visualAmp = Math.min(1, amplitude * 4); 

      // Draw "Cosmic Strings"
      // We draw 3 overlapping sine waves with different phases and colors
      const time = Date.now() / 1000;
      const lines = [
        { color: 'rgba(217, 119, 6, 0.8)', speed: 1, phase: 0, thickness: 2 }, // Divine Gold
        { color: 'rgba(251, 191, 36, 0.6)', speed: 1.5, phase: 2, thickness: 1.5 }, // Amber
        { color: 'rgba(255, 255, 255, 0.3)', speed: 0.8, phase: 4, thickness: 1 }, // White glow
      ];

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.thickness;
        
        const radius = 60; // Base radius around the OM
        // Wave height reacts to amplitude
        const maxWaveHeight = 30 * (visualAmp + 0.2); 

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
          // Circular sine wave equation
          // r = base + wave_height * sin(frequency * angle + time * speed)
          const waveR = radius + maxWaveHeight * Math.sin(6 * angle + time * line.speed + line.phase);
          
          const x = centerX + waveR * Math.cos(angle);
          const y = centerY + waveR * Math.sin(angle);

          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Draw Particles ("Stardust" Effect) when speaking
      if (isSpeaking && visualAmp > 0.1) {
         ctx.fillStyle = '#fbbf24';
         for(let i=0; i<3; i++) {
             // Random particles orbiting
             const angle = Math.random() * Math.PI * 2;
             const r = 70 + Math.random() * 50 * visualAmp;
             const x = centerX + r * Math.cos(angle);
             const y = centerY + r * Math.sin(angle);
             
             ctx.globalAlpha = Math.random() * 0.8;
             ctx.beginPath();
             ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
             ctx.fill();
             ctx.globalAlpha = 1.0;
         }
      }

      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isConnected, isSpeaking]);

  const connectToPanditji = async () => {
    setError(null);
    cleanup(); // Ensure clean state before starting
    setDuration(0);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Audio Setup
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // CRITICAL: Resume audio context on user interaction to prevent browser blocking
      if (outputContextRef.current.state === 'suspended') {
        await outputContextRef.current.resume();
      }

      // Analyser Setup for Visualization
      analyserRef.current = outputContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048; // High resolution for smooth waveform
      analyserRef.current.smoothingTimeConstant = 0.8;
      // Connect Analyser to Destination (Speakers)
      analyserRef.current.connect(outputContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log("Connection established");
            setIsConnected(true);
            
            // Setup Microphone Stream
            if (!inputContextRef.current) return;
            
            const source = inputContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
               // Fix: Check connection via REF, not state variable (which is stale here)
               if (!isConnectedRef.current) return; 
               
               const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
               const pcmBlob = createPcmBlob(inputData);
               
               sessionPromise.then((session: any) => {
                 try {
                    session.sendRealtimeInput({ media: pcmBlob });
                 } catch (e) {
                    console.error("Error sending input:", e);
                 }
               });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle audio output
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio && outputContextRef.current) {
               setIsSpeaking(true);
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContextRef.current.currentTime);
               
               const audioBuffer = await decodeAudioData(
                 new Uint8Array(Array.from(atob(base64Audio), c => c.charCodeAt(0))),
                 outputContextRef.current
               );
               
               const source = outputContextRef.current.createBufferSource();
               source.buffer = audioBuffer;
               
               // Connect Source -> Analyser -> Destination
               if (analyserRef.current) {
                   source.connect(analyserRef.current);
               } else {
                   source.connect(outputContextRef.current.destination);
               }
               
               source.addEventListener('ended', () => {
                 sourcesRef.current.delete(source);
                 if (sourcesRef.current.size === 0) setIsSpeaking(false);
               });
               
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               sourcesRef.current.add(source);
             }
             
             // Handle interruptions
             if (message.serverContent?.interrupted) {
               sourcesRef.current.forEach(s => s.stop());
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
               setIsSpeaking(false);
             }
          },
          onclose: () => {
            console.log("Connection closed");
            setIsConnected(false);
            setIsSpeaking(false);
          },
          onerror: (err) => {
            console.error(err);
            setError("Connection error. Please try again.");
            setIsConnected(false);
            setIsSpeaking(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } 
          },
          systemInstruction: "You are an ancient Vedic Sage named 'Arya'. You are wise, empathetic, and speak with a mix of modern understanding and ancient wisdom. Keep responses concise and spiritual. Start with 'Om Shanti'.",
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect.");
    }
  };

  const handleDisconnect = () => {
    cleanup();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Estimate Tokens: ~30 tokens per second of audio (combined in/out avg)
  const estimatedTokens = duration * 32;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-black via-space-dark to-divine-gold/10 pointer-events-none"></div>

      <div className="z-10 text-center space-y-8 max-w-lg w-full">
        <h2 className="font-serif text-3xl text-divine-gold mb-2">AI Panditji</h2>
        <p className="font-sans text-gray-400 text-sm">
          Experience real-time spiritual guidance. Speak your heart, and the sage will answer.
        </p>

        {/* Visualizer / Avatar */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
           {/* Canvas Layer for Wave Methodology */}
           <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
           ></canvas>
          
          {/* Core Orb */}
          <div className={`relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-divine-gold to-divine-amber flex items-center justify-center shadow-[0_0_50px_rgba(217,119,6,0.4)] transition-all duration-500 ${isSpeaking ? 'scale-110 shadow-[0_0_80px_rgba(217,119,6,0.8)]' : 'scale-100'}`}>
            <span className="font-serif text-5xl text-space-black font-bold animate-pulse-slow">ॐ</span>
          </div>
        </div>

        {/* Status Text & Metrics */}
        <div className="h-16 flex flex-col items-center justify-center gap-2">
           {error ? (
             <span className="text-red-400 font-sans text-sm"><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
           ) : isConnected ? (
             <>
               <span className="text-divine-glow font-sans font-medium animate-pulse">
                 {isSpeaking ? "Panditji is speaking..." : "Listening..."}
               </span>
               <div className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-divine-gold/20">
                  <span className="text-xs text-gray-300 font-mono">
                    <i className="fa-solid fa-stopwatch text-divine-gold mr-1"></i> {formatTime(duration)}
                  </span>
                  <div className="w-px h-3 bg-gray-600"></div>
                  <span className="text-xs text-gray-300 font-mono" title="Estimated based on ~32 tokens/sec">
                    <i className="fa-solid fa-bolt text-divine-amber mr-1"></i> ~{estimatedTokens.toLocaleString()} Tok
                  </span>
               </div>
             </>
           ) : (
             <span className="text-gray-500 font-sans text-sm">Tap microphone to begin</span>
           )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6">
          {!isConnected ? (
            <button
              onClick={connectToPanditji}
              className="group relative px-8 py-4 bg-transparent border border-divine-gold text-divine-gold rounded-full hover:bg-divine-gold hover:text-space-black transition-all duration-300 font-serif font-bold tracking-wider overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <i className="fa-solid fa-microphone"></i> CONNECT
              </span>
              <div className="absolute inset-0 bg-divine-gold/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-8 py-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 font-serif font-bold tracking-wider"
            >
              <i className="fa-solid fa-phone-slash mr-2"></i> END
            </button>
          )}
        </div>
        
        <p className="text-xs text-gray-600 font-sans mt-4">
          Powered by Gemini 2.5 Flash Native Audio
        </p>
      </div>
    </div>
  );
};

export default AIPanditji;