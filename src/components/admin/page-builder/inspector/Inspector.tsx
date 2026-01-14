import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";
import type { PageElement } from "@/pages/admin/AdminPageBuilder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            onChange(data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    return (
        <div className="space-y-2">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-200 hover:border-primary'}`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs">Drag & drop or click to upload</span>
                    </div>
                )}
            </div>
            {value && (
                <div className="text-xs text-slate-400 break-all">
                    URL: {value.slice(0, 30)}...
                </div>
            )}
        </div>
    );
};

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

    const handleContentChange = (key: string, value: any) => {
        onUpdate(element.id, {
            content: {
                ...element.content,
                [key]: value
            }
        });
    };

    const handleStyleChange = (key: string, value: any) => {
        onUpdate(element.id, {
            styles: {
                ...element.styles,
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

            <Tabs defaultValue="content" className="flex-1 flex flex-col">
                <div className="px-4 pt-4">
                    <TabsList className="w-full">
                        <TabsTrigger value="content" className="flex-1">Вміст</TabsTrigger>
                        <TabsTrigger value="style" className="flex-1">Стиль</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <TabsContent value="content" className="p-6 space-y-6 mt-0">
                        {element.type === 'section' && (
                            <div className="space-y-4">
                                <Label>Кількість Колонок: {element.content.columns || 1}</Label>
                                <Slider
                                    min={1}
                                    max={4}
                                    step={1}
                                    value={[element.content.columns || 1]}
                                    onValueChange={(val) => handleContentChange('columns', val[0])}
                                />
                                <p className="text-xs text-slate-400">Перетягніть повзунок, щоб змінити макет</p>
                            </div>
                        )}

                        {element.type === 'hero' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Заголовок</Label>
                                    <Input
                                        value={element.content.title}
                                        onChange={(e) => handleContentChange('title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Підзаголовок</Label>
                                    <Textarea
                                        value={element.content.subtitle}
                                        onChange={(e) => handleContentChange('subtitle', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Текст Кнопки (CTA)</Label>
                                    <Input
                                        value={element.content.cta}
                                        onChange={(e) => handleContentChange('cta', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {element.type === 'text' && (
                            <div className="space-y-2">
                                <Label>Текст (HTML support)</Label>
                                <Textarea
                                    className="min-h-[200px] font-mono text-xs"
                                    value={element.content.text}
                                    onChange={(e) => handleContentChange('text', e.target.value)}
                                />
                            </div>
                        )}

                        {element.type === 'image' && (
                            <div className="space-y-2">
                                <Label>Select Image</Label>
                                <ImageUpload
                                    value={element.content.src}
                                    onChange={(url) => handleContentChange('src', url)}
                                />
                                <Label className="text-xs text-slate-400">Or manually enter URL</Label>
                                <Input
                                    value={element.content.src}
                                    onChange={(e) => handleContentChange('src', e.target.value)}
                                />
                            </div>
                        )}

                        {element.type === 'video' && (
                            <div className="space-y-2">
                                <Label>Video URL (YouTube/Vimeo)</Label>
                                <Input
                                    value={element.content.url}
                                    onChange={(e) => handleContentChange('url', e.target.value)}
                                />
                            </div>
                        )}

                        {element.type === 'card' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Назва картки</Label>
                                    <Input
                                        value={element.content.title}
                                        onChange={(e) => handleContentChange('title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Опис</Label>
                                    <Textarea
                                        value={element.content.description}
                                        onChange={(e) => handleContentChange('description', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Зображення</Label>
                                    <ImageUpload
                                        value={element.content.image}
                                        onChange={(url) => handleContentChange('image', url)}
                                    />
                                </div>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="style" className="p-6 space-y-6 mt-0">
                        <div className="space-y-2">
                            <Label>Внутрішній відступ (Padding)</Label>
                            <Input
                                placeholder="e.g. p-4, py-12"
                                value={element.styles?.padding || ""}
                                onChange={(e) => handleStyleChange('padding', e.target.value)}
                            />
                            <p className="text-xs text-slate-400">Use Tailwind classes (p-4, py-8, etc)</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Колір фону (Background)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    className="w-12 p-1 h-10"
                                    value={element.styles?.backgroundColor || "#ffffff"}
                                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                />
                                <Input
                                    placeholder="e.g. bg-white, bg-slate-100"
                                    value={element.styles?.background || ""}
                                    onChange={(e) => handleStyleChange('background', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Колір тексту</Label>
                            <Input
                                placeholder="e.g. text-slate-900"
                                value={element.styles?.textColor || ""}
                                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                            />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </aside>
    );
};
