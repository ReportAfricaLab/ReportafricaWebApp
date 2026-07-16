'use client';
import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  aspect?: number;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = imageSrc; });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.9);
  });
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspect = 16 / 9 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedAspect, setSelectedAspect] = useState(aspect);

  const onCropDone = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedFile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Crop Area */}
      <div className="flex-1 relative">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={selectedAspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropDone}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 space-y-3">
        {/* Aspect Ratio Options */}
        <div className="flex items-center justify-center gap-2">
          {[
            { label: '16:9', value: 16 / 9 },
            { label: '4:3', value: 4 / 3 },
            { label: '1:1', value: 1 },
            { label: 'Free', value: 0 },
          ].map((opt) => (
            <button key={opt.label} onClick={() => setSelectedAspect(opt.value || undefined as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${selectedAspect === opt.value ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-3 px-4">
          <span className="text-xs text-gray-400">🔍</span>
          <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
          <span className="text-xs text-gray-400">{zoom.toFixed(1)}x</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-4">
          <button onClick={onCancel} className="flex-1 py-3 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition">
            Cancel
          </button>
          <button onClick={handleConfirm} className="flex-1 py-3 bg-[#0F7B6C] text-white rounded-lg text-sm font-medium hover:bg-[#0B6E4F] transition">
            ✓ Crop & Use
          </button>
        </div>
      </div>
    </div>
  );
}
