import { useState } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { Sidebar } from "@/components/admin/page-builder/sidebar/Sidebar";
import { Canvas } from "@/components/admin/page-builder/canvas/Canvas";
import { Inspector } from "@/components/admin/page-builder/inspector/Inspector";
import type { Widget } from "@/components/admin/page-builder/types";
import { Move } from "lucide-react";

export type PageElement = {
    id: string;
    type: Widget['type'];
    content: any;
    styles?: any;
};

const AdminPageBuilder = () => {
    const [elements, setElements] = useState<PageElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [activeDragItem, setActiveDragItem] = useState<Widget | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const widgetData = active.data.current as Widget;
        if (widgetData) {
            setActiveDragItem(widgetData);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id === "canvas-droppable") {
            const widget = active.data.current as Widget;
            if (widget) {
                const newElement: PageElement = {
                    id: crypto.randomUUID(),
                    type: widget.type,
                    content: widget.defaultContent,
                    styles: {},
                };
                setElements((prev) => [...prev, newElement]);
                setSelectedElementId(newElement.id);
            }
        }
        setActiveDragItem(null);
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-screen overflow-hidden bg-slate-50">
                <Sidebar />
                <Canvas
                    elements={elements}
                    selectedId={selectedElementId}
                    onSelect={setSelectedElementId}
                />
                <Inspector
                    selectedId={selectedElementId}
                    element={elements.find(el => el.id === selectedElementId)}
                    onUpdate={(id, updates) => {
                        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
                    }}
                />
            </div>
            <DragOverlay>
                {activeDragItem ? (
                    <div className="p-4 bg-white border rounded shadow-lg w-40 flex items-center gap-2 opacity-80 cursor-grabbing">
                        <Move className="w-4 h-4" />
                        {activeDragItem.label}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default AdminPageBuilder;
