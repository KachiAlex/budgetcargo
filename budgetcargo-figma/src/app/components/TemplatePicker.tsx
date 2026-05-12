interface Template {
  id: string;
  name: string;
  slots: Array<{
    id: string;
    imageUrl: string | null;
    style: React.CSSProperties;
  }>;
}

export const templates: Template[] = [
  {
    id: 'grid-2x2',
    name: '2×2 Grid',
    slots: [
      { id: '1', imageUrl: null, style: { gridRow: '1', gridColumn: '1' } },
      { id: '2', imageUrl: null, style: { gridRow: '1', gridColumn: '2' } },
      { id: '3', imageUrl: null, style: { gridRow: '2', gridColumn: '1' } },
      { id: '4', imageUrl: null, style: { gridRow: '2', gridColumn: '2' } }
    ]
  },
  {
    id: 'horizontal-3',
    name: '3 Horizontal',
    slots: [
      { id: '1', imageUrl: null, style: { gridRow: '1', gridColumn: '1' } },
      { id: '2', imageUrl: null, style: { gridRow: '1', gridColumn: '2' } },
      { id: '3', imageUrl: null, style: { gridRow: '1', gridColumn: '3' } }
    ]
  },
  {
    id: 'vertical-3',
    name: '3 Vertical',
    slots: [
      { id: '1', imageUrl: null, style: { gridRow: '1', gridColumn: '1' } },
      { id: '2', imageUrl: null, style: { gridRow: '2', gridColumn: '1' } },
      { id: '3', imageUrl: null, style: { gridRow: '3', gridColumn: '1' } }
    ]
  },
  {
    id: 'featured-left',
    name: 'Featured Left',
    slots: [
      { id: '1', imageUrl: null, style: { gridRow: '1 / 3', gridColumn: '1' } },
      { id: '2', imageUrl: null, style: { gridRow: '1', gridColumn: '2' } },
      { id: '3', imageUrl: null, style: { gridRow: '2', gridColumn: '2' } }
    ]
  },
  {
    id: 'featured-right',
    name: 'Featured Right',
    slots: [
      { id: '1', imageUrl: null, style: { gridRow: '1', gridColumn: '1' } },
      { id: '2', imageUrl: null, style: { gridRow: '2', gridColumn: '1' } },
      { id: '3', imageUrl: null, style: { gridRow: '1 / 3', gridColumn: '2' } }
    ]
  },
  {
    id: 'grid-3x3',
    name: '3×3 Grid',
    slots: [
      { id: '1', imageUrl: null, style: { gridRow: '1', gridColumn: '1' } },
      { id: '2', imageUrl: null, style: { gridRow: '1', gridColumn: '2' } },
      { id: '3', imageUrl: null, style: { gridRow: '1', gridColumn: '3' } },
      { id: '4', imageUrl: null, style: { gridRow: '2', gridColumn: '1' } },
      { id: '5', imageUrl: null, style: { gridRow: '2', gridColumn: '2' } },
      { id: '6', imageUrl: null, style: { gridRow: '2', gridColumn: '3' } },
      { id: '7', imageUrl: null, style: { gridRow: '3', gridColumn: '1' } },
      { id: '8', imageUrl: null, style: { gridRow: '3', gridColumn: '2' } },
      { id: '9', imageUrl: null, style: { gridRow: '3', gridColumn: '3' } }
    ]
  }
];

interface TemplatePickerProps {
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplatePicker({ selectedTemplateId, onSelectTemplate }: TemplatePickerProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Templates</h3>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`p-2 border-2 rounded-lg transition-all ${
              selectedTemplateId === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="aspect-square bg-gray-200 rounded mb-1 relative overflow-hidden">
              <div
                className="absolute inset-0 grid gap-[2px] p-[2px]"
                style={{
                  gridTemplateColumns:
                    template.id === 'horizontal-3'
                      ? 'repeat(3, 1fr)'
                      : template.id === 'vertical-3'
                      ? '1fr'
                      : template.id === 'grid-3x3'
                      ? 'repeat(3, 1fr)'
                      : 'repeat(2, 1fr)',
                  gridTemplateRows:
                    template.id === 'horizontal-3'
                      ? '1fr'
                      : template.id === 'vertical-3'
                      ? 'repeat(3, 1fr)'
                      : template.id === 'grid-3x3'
                      ? 'repeat(3, 1fr)'
                      : 'repeat(2, 1fr)'
                }}
              >
                {template.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-gray-300"
                    style={slot.style}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-center">{template.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
