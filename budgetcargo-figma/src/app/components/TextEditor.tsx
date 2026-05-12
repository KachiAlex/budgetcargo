import { Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Plus } from 'lucide-react';

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

interface TextEditorProps {
  selectedText: TextOverlay | null;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  onAddText: () => void;
}

export function TextEditor({ selectedText, onUpdateText, onAddText }: TextEditorProps) {
  if (!selectedText) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Text Overlay</h3>
        <button
          onClick={onAddText}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Text
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Text Editor</h3>

      <div>
        <label className="text-xs text-gray-600 block mb-1">Text</label>
        <input
          type="text"
          value={selectedText.text}
          onChange={(e) => onUpdateText(selectedText.id, { text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text..."
        />
      </div>

      <div>
        <label className="text-xs text-gray-600 block mb-1">Font Size</label>
        <input
          type="range"
          min="16"
          max="72"
          value={selectedText.fontSize}
          onChange={(e) => onUpdateText(selectedText.id, { fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{selectedText.fontSize}px</div>
      </div>

      <div>
        <label className="text-xs text-gray-600 block mb-1">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={selectedText.color}
            onChange={(e) => onUpdateText(selectedText.id, { color: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={selectedText.color}
            onChange={(e) => onUpdateText(selectedText.id, { color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600 block mb-2">Style</label>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onUpdateText(selectedText.id, {
                fontWeight: selectedText.fontWeight === 'bold' ? 'normal' : 'bold'
              })
            }
            className={`flex-1 p-2 border rounded-lg transition-colors ${
              selectedText.fontWeight === 'bold'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Bold className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() =>
              onUpdateText(selectedText.id, {
                fontStyle: selectedText.fontStyle === 'italic' ? 'normal' : 'italic'
              })
            }
            className={`flex-1 p-2 border rounded-lg transition-colors ${
              selectedText.fontStyle === 'italic'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Italic className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600 block mb-2">Alignment</label>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdateText(selectedText.id, { textAlign: 'left' })}
            className={`flex-1 p-2 border rounded-lg transition-colors ${
              selectedText.textAlign === 'left'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <AlignLeft className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => onUpdateText(selectedText.id, { textAlign: 'center' })}
            className={`flex-1 p-2 border rounded-lg transition-colors ${
              selectedText.textAlign === 'center'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <AlignCenter className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => onUpdateText(selectedText.id, { textAlign: 'right' })}
            className={`flex-1 p-2 border rounded-lg transition-colors ${
              selectedText.textAlign === 'right'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <AlignRight className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
