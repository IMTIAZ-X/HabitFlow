/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { GoogleGenAI } from "@google/genai";
import { Upload, Sparkles, Image as ImageIcon, Loader2, Download, RefreshCcw, Wand2, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StyleType = 'ghibli' | 'cartoon' | 'anime' | 'watercolor';

interface StyleOption {
  id: StyleType;
  name: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'ghibli',
    name: 'Studio Ghibli',
    description: 'Soft, hand-painted aesthetic with lush backgrounds and expressive characters.',
    prompt: 'Transform this person into a Studio Ghibli anime character. Use soft, hand-painted textures, lush natural backgrounds, expressive eyes, and the iconic warm color palette of Hayao Miyazaki films. Maintain the original person\'s key features but in a beautiful Ghibli art style.',
    icon: <Palette className="w-5 h-5" />
  },
  {
    id: 'cartoon',
    name: 'Classic Cartoon',
    description: 'Bold lines, vibrant colors, and stylized features for a fun animated look.',
    prompt: 'Convert this person into a high-quality 3D modern animated movie character (like Pixar or Disney style). Vibrant colors, clean lines, expressive stylized features, and professional lighting. Keep the person\'s identity recognizable.',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'anime',
    name: 'Modern Anime',
    description: 'Sharp lines, dramatic lighting, and detailed cel-shading.',
    prompt: 'Redraw this person in a modern high-quality anime style (Makoto Shinkai inspired). Detailed cel-shading, dramatic atmospheric lighting, sharp line art, and beautiful aesthetic details. Maintain the person\'s likeness.',
    icon: <Wand2 className="w-5 h-5" />
  }
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('ghibli');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  const handleTransform = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(selectedFile);
      const base64Data = await base64Promise;

      const style = STYLE_OPTIONS.find(s => s.id === selectedStyle);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: selectedFile.type,
              },
            },
            {
              text: style?.prompt || STYLE_OPTIONS[0].prompt,
            },
          ],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          setResultUrl(imageUrl);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("The AI didn't return an image. Please try again.");
      }

    } catch (err: any) {
      console.error("Transformation error:", err);
      setError(err.message || "Something went wrong during transformation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `transformed-${selectedStyle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen px-4 py-12 md:px-8 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-olive/60 mb-3 block">
            AI Art Studio
          </span>
          <h1 className="text-5xl md:text-7xl serif-title font-medium text-gray-900 mb-6 tracking-tight">
            Ghibliify Your <span className="italic text-accent-clay">World</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Transform your everyday moments into cinematic masterpieces. 
            Upload a photo and let our AI recreate it in iconic animation styles.
          </p>
        </motion.div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Controls & Styles */}
        <div className="lg:col-span-4 space-y-8">
          <section className="ghibli-card p-8">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent-olive" />
              Choose Your Style
            </h2>
            <div className="space-y-4">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all duration-300 border-2",
                    selectedStyle === style.id
                      ? "border-accent-olive bg-accent-olive/5 shadow-sm"
                      : "border-transparent hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={cn(
                      "p-2 rounded-lg",
                      selectedStyle === style.id ? "bg-accent-olive text-white" : "bg-gray-100 text-gray-500"
                    )}>
                      {style.icon}
                    </div>
                    <span className="font-medium text-gray-900">{style.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-light leading-snug ml-11">
                    {style.description}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ghibli-card p-8 flex flex-col items-center gap-4"
            >
              <button
                onClick={handleTransform}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-accent-olive text-white rounded-full font-medium flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-olive/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Painting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Transform Now
                  </>
                )}
              </button>
              <button
                onClick={reset}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" />
                Start Over
              </button>
            </motion.div>
          )}
        </div>

        {/* Upload & Results */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!previewUrl ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                {...getRootProps()}
                className={cn(
                  "ghibli-card border-2 border-dashed h-[500px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group",
                  isDragActive ? "border-accent-olive bg-accent-olive/5" : "border-gray-200 hover:border-accent-olive/40"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-accent-olive/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-8 h-8 text-accent-olive" />
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-2">Drop your photo here</h3>
                <p className="text-gray-400 font-light">or click to browse from your device</p>
                <div className="mt-8 flex gap-4 text-xs text-gray-400 uppercase tracking-widest">
                  <span>JPG</span>
                  <span>PNG</span>
                  <span>WEBP</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Original Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Original</span>
                      <ImageIcon className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="ghibli-card overflow-hidden aspect-[4/5] relative group">
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Result Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-accent-clay">Transformed</span>
                      <Sparkles className="w-4 h-4 text-accent-clay" />
                    </div>
                    <div className="ghibli-card overflow-hidden aspect-[4/5] relative bg-gray-50 flex items-center justify-center">
                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 border-4 border-accent-olive/20 border-t-accent-olive rounded-full animate-spin" />
                            <Sparkles className="w-6 h-6 text-accent-olive absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                          </div>
                          <p className="text-sm text-accent-olive font-medium animate-pulse">Applying artistic strokes...</p>
                        </div>
                      ) : resultUrl ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative w-full h-full group"
                        >
                          <img
                            src={resultUrl}
                            alt="Result"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                              onClick={downloadResult}
                              className="p-4 bg-white rounded-full text-gray-900 hover:scale-110 transition-transform shadow-xl"
                              title="Download Image"
                            >
                              <Download className="w-6 h-6" />
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center p-8">
                          <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-light">Click 'Transform Now' to see the magic</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-24 pt-12 border-top border-gray-100 text-center text-gray-400 text-sm font-light">
        <p>© 2024 Ghibliify AI Studio. Hand-crafted with love and magic.</p>
      </footer>
    </div>
  );
}
