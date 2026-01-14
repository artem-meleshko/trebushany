import { useDroppable } from "@dnd-kit/core";
import type { PageElement } from "@/pages/admin/AdminPageBuilder";
import { cn } from "@/lib/utils";

interface CanvasProps {
    elements: PageElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
}

export const Canvas = ({ elements, selectedId, onSelect }: CanvasProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: "canvas-droppable",
    });

    return (
        <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100/50">
            <div
                ref={setNodeRef}
                onClick={() => onSelect(null)}
                className={cn(
                    "w-full max-w-5xl min-h-[800px] bg-white shadow-sm transition-all duration-300 relative",
                    isOver ? "ring-2 ring-primary ring-offset-4 ring-offset-slate-50" : ""
                )}
            >
                {elements.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                        <div className="text-center">
                            <p className="text-xl font-medium">Canvas Empty</p>
                            <p className="text-sm">Drag widgets here to start building</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {elements.map((element) => (
                            <div
                                key={element.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(element.id);
                                }}
                                className={cn(
                                    "relative hover:outline hover:outline-1 hover:outline-blue-200 transition-all",
                                    selectedId === element.id ? "outline outline-2 outline-primary z-10" : ""
                                )}
                            >
                                {/* Element Rendering Logic Placeholder */}
                                {element.type === 'hero' && (
                                    <div className="p-12 text-center bg-slate-50 border-b">
                                        <h1 className="text-4xl font-bold mb-4">{element.content.title}</h1>
                                        <p className="text-xl text-slate-600 mb-6">{element.content.subtitle}</p>
                                        <button className="bg-primary text-white px-6 py-2 rounded">{element.content.cta}</button>
                                    </div>
                                )}
                                {element.type === 'text' && (
                                    <div className="p-4 prose max-w-none">
                                        {element.content.text}
                                    </div>
                                )}
                                {element.type === 'image' && (
                                    <div className="w-full">
                                        <img src={element.content.src} alt={element.content.alt} className="w-full h-auto object-cover" />
                                    </div>
                                )}
                                {element.type === 'button' && (
                                    <div className="p-4">
                                        <button className="bg-primary text-white px-4 py-2 rounded">Button</button>
                                    </div>
                                )}
                                {element.type === 'container' && (
                                    <div className={cn("border-2 border-dashed border-slate-200 min-h-[100px] p-4", element.content.padding)}>
                                        Container
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};
