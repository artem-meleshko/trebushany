import type { PageElement } from "@/pages/admin/AdminPageBuilder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InspectorProps {
    selectedId: string | null;
    element?: PageElement;
    onUpdate: (id: string, updates: any) => void;
}

export const Inspector = ({ selectedId, element, onUpdate }: InspectorProps) => {
    if (!selectedId || !element) {
        return (
            <aside className="w-80 bg-white border-l p-6 flex items-center justify-center text-slate-400 text-sm text-center">
                Виберіть елемент для редагування
            </aside>
        );
    }

    const handleContentChange = (key: string, value: string) => {
        onUpdate(element.id, {
            content: {
                ...element.content,
                [key]: value
            }
        });
    };

    return (
        <aside className="w-80 bg-white border-l flex flex-col h-full shadow-lg z-20">
            <div className="p-4 border-b bg-slate-50">
                <h3 className="font-semibold text-slate-900 capitalize">Налаштування</h3>
                <p className="text-xs text-slate-500">ID: {element.id.slice(0, 8)}</p>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Dynamic Form based on Element Type */}

                {element.type === 'hero' && (
                    <>
                        <div className="space-y-2">
                            <Label>Заголовок</Label>
                            <Input
                                value={element.content.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleContentChange('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Підзаголовок</Label>
                            <Textarea
                                value={element.content.subtitle}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleContentChange('subtitle', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Текст Кнопки (CTA)</Label>
                            <Input
                                value={element.content.cta}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleContentChange('cta', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {element.type === 'text' && (
                    <div className="space-y-2">
                        <Label>Текст</Label>
                        <Textarea
                            className="min-h-[200px]"
                            value={element.content.text}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleContentChange('text', e.target.value)}
                        />
                    </div>
                )}

                {element.type === 'image' && (
                    <div className="space-y-2">
                        <Label>Посилання на зображення (URL)</Label>
                        <Input
                            value={element.content.src}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleContentChange('src', e.target.value)}
                        />
                    </div>
                )}
            </div>
        </aside>
    );
};
