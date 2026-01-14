import { useDraggable } from "@dnd-kit/core";
import { Type, Image, LayoutTemplate, Film, AppWindow, GalleryVerticalEnd, Quote } from "lucide-react";
import type { Widget } from "../types";
import { PropertyPanel } from "./PropertyPanel";
import type { PageElement } from "@/pages/admin/AdminPageBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";

const WIDGETS: Widget[] = [
    {
        type: "section",
        label: "Секція (Рядок)",
        icon: <LayoutTemplate className="w-5 h-5" />,
        defaultContent: { columns: 1 },
        defaultStyles: { padding: "p-8", backgroundColor: "#ffffff" }
    },
    {
        type: "text",
        label: "Текст",
        icon: <Type className="w-5 h-5" />,
        defaultContent: { text: "<h2>Заголовок</h2><p>Текст секції...</p>" },
        defaultStyles: {}
    },
    {
        type: "image",
        label: "Зображення",
        icon: <Image className="w-5 h-5" />,
        defaultContent: { src: "https://placehold.co/600x400", alt: "Image" },
        defaultStyles: {}
    },
    {
        type: "video",
        label: "Відео",
        icon: <Film className="w-5 h-5" />,
        defaultContent: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        defaultStyles: {}
    },
    {
        type: "card",
        label: "Картка",
        icon: <AppWindow className="w-5 h-5" />,
        defaultContent: { title: "Title", description: "Description...", image: "https://placehold.co/300x200" },
        defaultStyles: { backgroundColor: "#ffffff", boxShadow: "md", borderRadius: "0.5rem" }
    },
    {
        type: "gallery",
        label: "Галерея",
        icon: <GalleryVerticalEnd className="w-5 h-5" />,
        defaultContent: { images: [] },
        defaultStyles: {}
    },
    {
        type: "quote",
        label: "Цитата",
        icon: <Quote className="w-5 h-5" />,
        defaultContent: { text: "Your inspiring quote here..." },
        defaultStyles: {}
    }
];

const DraggableWidget = ({ widget }: { widget: Widget }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `widget-${widget.type}`,
        data: widget,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg cursor-grab hover:border-primary hover:shadow-md transition-all active:cursor-grabbing group"
        >
            <div className="text-slate-500 group-hover:text-primary transition-colors">
                {widget.icon}
            </div>
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{widget.label}</span>
        </div>
    );
};

interface SidebarProps {
    selectedElement?: PageElement | null;
    onUpdate?: (id: string, updates: Partial<PageElement>) => void;
    onBack?: () => void;
    onDelete?: (id: string) => void;
}

export const Sidebar = ({ selectedElement, onUpdate, onBack, onDelete }: SidebarProps) => {

    // If element is selected, show Property Panel (Elementor Style)
    if (selectedElement && onUpdate && onBack) {
        return (
            <PropertyPanel
                element={selectedElement}
                onUpdate={onUpdate}
                onBack={onBack}
                onDelete={onDelete}
            />
        );
    }

    // Default: Show Widget List
    return (
        <div className="w-[300px] bg-white border-r flex flex-col h-full z-10 shrink-0">
            <div className="p-4 border-b bg-slate-50">
                <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Елементи</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-2 gap-3">
                    {WIDGETS.map((widget) => (
                        <DraggableWidget key={widget.type} widget={widget} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
