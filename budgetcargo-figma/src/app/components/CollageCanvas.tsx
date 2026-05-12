import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
}

interface CollageSlot {
  id: string;
  imageUrl: string | null;
  style: React.CSSProperties;
}

interface CollageCanvasProps {
  template: CollageSlot[];
  onImageChange: (slotId: string, imageUrl: string) => void;
  textOverlays: TextOverlay[];
  onAddText: () => void;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  onDeleteText: (id: string) => void;
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
}

export function CollageCanvas({
  template,
  onImageChange,
  textOverlays,
  onAddText,
  onUpdateText,
  onDeleteText,
  selectedTextId,
  onSelectText
}: CollageCanvasProps) {
  const [draggedTextId, setDraggedTextId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleTextMouseDown = (e: React.MouseEvent, textId: string) => {
    e.preventDefault();
    const text = textOverlays.find(t => t.id === textId);
    if (!text) return;

    setDraggedTextId(textId);
    onSelectText(textId);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedTextId) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

    onUpdateText(draggedTextId, {
      x: Math.max(0, Math.min(95, x)),
      y: Math.max(0, Math.min(95, y))
    });
  };

  const handleMouseUp = () => {
    setDraggedTextId(null);
  };

  const handleFileUpload = (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onImageChange(slotId, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Image Slots */}
      <div className="absolute inset-0 grid grid-cols-1">
        {template.map((slot) => (
          <div
            key={slot.id}
            className="relative border-2 border-white overflow-hidden group"
            style={slot.style}
          >
            {slot.imageUrl ? (
              <>
                <img
                  src={slot.imageUrl}
                  alt="Collage slot"
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                  <span className="text-white font-medium">Change Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(slot.id, e)}
                  />
                </label>
              </>
            ) : (
              <label className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors">
                <span className="text-gray-500">+ Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(slot.id, e)}
                />
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Text Overlays */}
      {textOverlays.map((text) => (
        <div
          key={text.id}
          className={`absolute cursor-move select-none group ${
            selectedTextId === text.id ? 'ring-2 ring-blue-500' : ''
          }`}
          style={{
            left: `${text.x}%`,
            top: `${text.y}%`,
            fontSize: `${text.fontSize}px`,
            color: text.color,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            textAlign: text.textAlign,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            minWidth: '100px'
          }}
          onMouseDown={(e) => handleTextMouseDown(e, text.id)}
        >
          <div className="relative">
            <div className="whitespace-nowrap px-2 py-1">
              {text.text}
            </div>
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteText(text.id);
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
