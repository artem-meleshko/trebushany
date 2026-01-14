import { useDroppable } from "@dnd-kit/core";
import type { PageElement } from "@/pages/admin/AdminPageBuilder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CanvasProps {
    elements: PageElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onDelete?: (id: string) => void; // To implement
}

// Recursive Element Renderer
const ElementRenderer = ({
    element,
    selectedId,
    onSelect,
    device // Receive device state
}: {
    element: PageElement;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    device: 'desktop' | 'tablet' | 'mobile';
}) => {

    const isSelected = selectedId === element.id;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(element.id);
    };

    const commonClasses = cn(
        "relative transition-all duration-200 cursor-pointer group",
        isSelected ? "ring-2 ring-primary ring-offset-2 z-10" : "hover:ring-1 hover:ring-blue-300"
    );

    // Section (Row)
    if (element.type === 'section') {
        const cols = element.content.columns || 1;

        // Logic: If mobile, FORCE 1 column. If desktop/tablet, allow multi-column.
        const isMobile = device === 'mobile';
        const effectiveCols = isMobile ? 1 : cols;

        // Tailwind Map (Simplified, since we handle logic in JS)
        const gridClasses = {
            1: "grid-cols-1",
            2: "grid-cols-2",
            3: "grid-cols-3",
            4: "grid-cols-4",
        }[effectiveCols as 1 | 2 | 3 | 4] || "grid-cols-1";

        return (
            <div
                onClick={handleSelect}
                className={cn(commonClasses, element.styles?.padding || "p-8", element.styles?.background || "bg-white", "w-full")}
            >
                {isSelected && <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl">Секція</div>}

                <div className={`grid gap-4 ${gridClasses}`}>
                    {/* In a real drag-drop system, these columns would be DropZones too */}
                    {/* For this simplified version, we just render children if they existed, or placeholders */}
                    {Array.from({ length: effectiveCols }).map((_, i) => (
                        <div key={i} className="min-h-[100px] border border-dashed border-slate-200 rounded p-2 flex items-center justify-center bg-slate-50/50">
                            <span className="text-xs text-slate-400">Колонка {i + 1}</span>
                            {/* Recursive children rendering would go here, filtered by column index */}
                            {element.children?.filter(c => c.content.columnIndex === i).map(child => (
                                <ElementRenderer
                                    key={child.id}
                                    element={child}
                                    selectedId={selectedId}
                                    onSelect={onSelect}
                                    device={device} // Pass device down
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Text
    if (element.type === 'text') {
        return (
            <div onClick={handleSelect} className={cn(commonClasses, "p-4")}>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: element.content.text }} />
            </div>
        );
    }

    // Image
    if (element.type === 'image') {
        return (
            <div onClick={handleSelect} className={cn(commonClasses)}>
                <img src={element.content.src} alt={element.content.alt} className="w-full h-auto rounded" />
            </div>
        );
    }

    // Video
    if (element.type === 'video') {
        return (
            <div onClick={handleSelect} className={cn(commonClasses, "p-4")}>
                <div className="aspect-video bg-slate-900 rounded flex items-center justify-center text-white">
                    Video Placeholder ({element.content.url})
                </div>
            </div>
        );
    }

    // Card
    if (element.type === 'card') {
        return (
            <div onClick={handleSelect} className={cn(commonClasses, "bg-white rounded-lg shadow-sm border overflow-hidden")}>
                <img src={element.content.image} className="w-full h-40 object-cover" />
                <div className="p-4">
                    <h3 className="font-bold text-lg">{element.content.title}</h3>
                    <p className="text-slate-600 text-sm">{element.content.description}</p>
                </div>
            </div>
        );
    }

    // Gallery (Placeholder)
    if (element.type === 'gallery') {
        // Gallery also needs to respond to mobile
        const isMobile = device === 'mobile';
        return (
            <div onClick={handleSelect} className={cn(commonClasses, "grid gap-2", isMobile ? "grid-cols-2" : "grid-cols-3")}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-square bg-slate-100 rounded flex items-center justify-center text-slate-300">
                        Image {i}
                    </div>
                ))}
            </div>
        );
    }

    // Quote
    if (element.type === 'quote') {
        return (
            <div onClick={handleSelect} className={cn(commonClasses, "p-8 border-l-4 border-primary bg-slate-50 italic text-xl text-slate-700")}>
                "{element.content.text || "Insert quote here..."}"
                <div className="text-sm text-slate-500 mt-2 not-italic font-semibold">- Author Name</div>
            </div>
        );
    }

    return (
        <div onClick={handleSelect} className={cn(commonClasses, "p-4 border border-red-200 bg-red-50")}>
            Unknown Widget: {element.type}
        </div>
    );
};


import { useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

export const Canvas = ({ elements, selectedId, onSelect }: CanvasProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: "canvas-droppable",
    });
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    return (
        <main className="flex-1 overflow-y-auto bg-slate-100/50 flex flex-col">
            {/* Device Toolbar */}
            <div className="h-12 border-b bg-white flex items-center justify-center gap-2 px-4 shadow-sm z-10 shrink-0">
                <Button
                    variant={device === 'desktop' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setDevice('desktop')}
                    title="Desktop View"
                >
                    <Monitor className="w-4 h-4" />
                </Button>
                <Button
                    variant={device === 'tablet' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setDevice('tablet')}
                    title="Tablet View"
                >
                    <Tablet className="w-4 h-4" />
                </Button>
                <Button
                    variant={device === 'mobile' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setDevice('mobile')}
                    title="Mobile View"
                >
                    <Smartphone className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 flex justify-center p-4 md:p-8 overflow-y-auto w-full">
                <div
                    ref={setNodeRef}
                    onClick={() => onSelect(null)}
                    style={{
                        width: device === 'mobile' ? '375px' : device === 'tablet' ? '768px' : '100%',
                        maxWidth: device === 'desktop' ? '1200px' : undefined,
                        transition: 'width 0.3s ease'
                    }}
                    className={cn(
                        "bg-white shadow-lg relative flex flex-col gap-1 min-h-[800px]",
                        isOver ? "ring-2 ring-primary ring-offset-4 ring-offset-slate-50" : ""
                    )}
                >
                    {elements.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                            <div className="text-center">
                                <p className="text-xl font-medium">Порожнє полотно</p>
                                <p className="text-sm">Перетягніть віджет "Секція" сюди, щоб почати</p>
                            </div>
                        </div>
                    ) : (
                        elements.map((element) => (
                            <ElementRenderer
                                key={element.id}
                                element={element}
                                selectedId={selectedId}
                                onSelect={onSelect}
                                device={device}
                            />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};
