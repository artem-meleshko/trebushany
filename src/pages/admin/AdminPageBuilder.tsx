import { useState, useEffect } from "react";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { Sidebar } from "@/components/admin/page-builder/sidebar/Sidebar";
import { Canvas } from "@/components/admin/page-builder/canvas/Canvas";
import type { Widget } from "@/components/admin/page-builder/types";
import { Move, Save, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export type PageElement = {
    id: string;
    type: Widget['type'];
    content: any;
    styles?: any;
    children?: PageElement[];
};

const AdminPageBuilder = () => {
    const [elements, setElements] = useState<PageElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [activeDragItem, setActiveDragItem] = useState<Widget | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Initial Load
    useEffect(() => {
        const loadPage = async () => {
            const { data } = await supabase
                .from('pages')
                .select('content, updated_at')
                .eq('slug', 'home')
                .single();

            if (data && data.content) {
                // Ensure content is array
                const loadedContent = Array.isArray(data.content) ? data.content : [];
                setElements(loadedContent as PageElement[]);
                if (data.updated_at) setLastSaved(new Date(data.updated_at));
            }
        };
        loadPage();
    }, []);


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

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('pages')
                .upsert({
                    slug: 'home',
                    title: 'Home Page',
                    content: elements,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'slug' });

            if (error) throw error;
            setLastSaved(new Date());
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Error saving page');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!confirm("Are you sure you want to publish these changes live?")) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('pages')
                .upsert({
                    slug: 'home',
                    title: 'Home Page',
                    content: elements,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'slug' });

            if (error) throw error;
            setLastSaved(new Date());
            alert('Page successfully published live!');
        } catch (error) {
            console.error('Error publishing page:', error);
            alert('Error publishing page');
        } finally {
            setSaving(false);
        }
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-screen overflow-hidden bg-slate-50 flex-col">
                {/* Builder Header */}
                <header className="h-14 bg-white border-b flex items-center justify-between px-4 z-50 shadow-sm relative">
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold text-slate-800">Page Builder</h1>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Pro Mode</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {lastSaved && <span className="text-xs text-slate-400 hidden md:inline mr-2">Saved: {lastSaved.toLocaleTimeString()}</span>}

                        <Button size="sm" variant="outline" onClick={handleSave} disabled={saving} className="gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Draft
                        </Button>

                        <Button size="sm" onClick={handlePublish} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md">
                            <Globe className="w-4 h-4" />
                            Publish
                        </Button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden relative">
                    {/* Elementor Style: single left panel for both Widgets and Properties */}
                    <Sidebar
                        selectedElement={selectedElementId ? elements.find(el => el.id === selectedElementId) : null}
                        onUpdate={(id, updates) => {
                            setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
                        }}
                        onBack={() => setSelectedElementId(null)}
                        onDelete={(id) => {
                            setElements(prev => prev.filter(el => el.id !== id));
                            setSelectedElementId(null);
                        }}
                    />

                    <Canvas
                        elements={elements}
                        selectedId={selectedElementId}
                        onSelect={setSelectedElementId}
                    />
                </div>
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
