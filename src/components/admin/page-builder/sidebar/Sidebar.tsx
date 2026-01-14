import { useDraggable } from "@dnd-kit/core";
import type { Widget } from "../types";
import { Type, Image, Square, LayoutTemplate } from "lucide-react";

const WIDGETS: Widget[] = [
    {
        type: "hero",
        label: "Головний Екран",
        icon: <LayoutTemplate className="w-5 h-5" />,
        defaultContent: {
            title: "Заголовок",
            subtitle: "Підзаголовок секції",
            cta: "Детальніше"
        }
    },
    {
        type: "text",
        label: "Текстовий Блок",
        icon: <Type className="w-5 h-5" />,
        defaultContent: {
            text: "Введіть ваш текст тут..."
        }
    },
    {
        type: "image",
        label: "Зображення",
        icon: <Image className="w-5 h-5" />,
        defaultContent: {
            src: "https://placehold.co/600x400",
            alt: "Зображення"
        }
    },
    {
        type: "container",
        label: "Контейнер",
        icon: <Square className="w-5 h-5" />,
        defaultContent: {
            padding: "p-4"
        }
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
            style={style}
            {...listeners}
            {...attributes}
            className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-grab hover:shadow-sm hover:border-primary/50 transition-all font-medium text-slate-700"
        >
            {widget.icon && <span className="text-slate-400">{widget.icon}</span>}
            {widget.label}
        </div>
    );
};

export const Sidebar = () => {
    return (
        <aside className="w-64 bg-sidebar border-r flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-slate-900">Віджети</h2>
                <p className="text-xs text-slate-500">Перетягніть елементи</p>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
                {WIDGETS.map((widget) => (
                    <DraggableWidget key={widget.type} widget={widget} />
                ))}
            </div>
        </aside>
    );
};
