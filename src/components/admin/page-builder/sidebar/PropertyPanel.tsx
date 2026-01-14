import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Type, Image as ImageIcon, Layout, Palette, Box } from "lucide-react";
import type { PageElement } from "@/pages/admin/AdminPageBuilder";
import { supabase } from "@/lib/supabase";
import { useDropzone } from "react-dropzone";
import { Loader2 } from "lucide-react";

// Inline ImageUpload Component
const ImageUpload = ({ value, onChange }: { value: string, onChange: (url: string) => void }) => {
    const [uploading, setUploading] = useState(false);

    const onDrop = async (acceptedFiles: File[]) => {
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
    };

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
                    <div className="space-y-1">
                        {value ? (
                            <img src={value} alt="Preview" className="w-full h-32 object-cover rounded mb-2" />
                        ) : (
                            <ImageIcon className="w-8 h-8 mx-auto text-slate-300" />
                        )}
                        <p className="text-xs text-slate-500">Drag & drop or click to upload</p>
                    </div>
                )}
            </div>
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Or enter URL..." className="text-xs" />
        </div>
    );
};

interface PropertyPanelProps {
    element: PageElement;
    onUpdate: (id: string, updates: Partial<PageElement>) => void;
    onBack: () => void;
    onDelete?: (id: string) => void;
}

export const PropertyPanel = ({ element, onUpdate, onBack, onDelete }: PropertyPanelProps) => {

    const updateContent = (key: string, value: any) => {
        onUpdate(element.id, {
            content: { ...element.content, [key]: value }
        });
    };

    const updateStyle = (key: string, value: any) => {
        onUpdate(element.id, {
            styles: { ...element.styles, [key]: value }
        });
    };

    return (
        <div className="flex flex-col h-full bg-white border-r w-[320px] shadow-xl z-20">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2 text-slate-600">
                    <ArrowLeft className="w-4 h-4" />
                    Widgets
                </Button>
                <span className="font-semibold text-sm capitalize">{element.type}</span>
                {onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(element.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <Tabs defaultValue="content" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2 h-10">
                    <TabsTrigger value="content" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-xs h-8">Content</TabsTrigger>
                    <TabsTrigger value="style" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-xs h-8">Style</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <TabsContent value="content" className="space-y-6 m-0">

                        {/* SECTION SPECIFIC */}
                        {element.type === 'section' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Columns</Label>
                                    <div className="flex items-center gap-4">
                                        <Slider
                                            value={[element.content.columns || 1]}
                                            min={1}
                                            max={4}
                                            step={1}
                                            onValueChange={([val]) => updateContent('columns', val)}
                                            className="flex-1"
                                        />
                                        <span className="text-sm font-bold w-4">{element.content.columns || 1}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Drag to change columns layout.</p>
                                </div>
                            </div>
                        )}

                        {/* TEXT SPECIFIC */}
                        {element.type === 'text' && (
                            <div className="space-y-2">
                                <Label>Text Content (HTML)</Label>
                                <Textarea
                                    rows={10}
                                    value={element.content.text}
                                    onChange={(e) => updateContent('text', e.target.value)}
                                    className="font-mono text-sm"
                                />
                                <p className="text-xs text-slate-400">Supports basic HTML tags.</p>
                            </div>
                        )}

                        {/* IMAGE SPECIFIC */}
                        {(element.type === 'image') && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Image Source</Label>
                                    <ImageUpload value={element.content.src} onChange={(url) => updateContent('src', url)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Alt Text</Label>
                                    <Input
                                        value={element.content.alt || ''}
                                        onChange={(e) => updateContent('alt', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* CARD / GENERIC IMAGE FIELDS */}
                        {(element.type === 'card') && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Image</Label>
                                    <ImageUpload value={element.content.image} onChange={(url) => updateContent('image', url)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={element.content.title} onChange={(e) => updateContent('title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={element.content.description} onChange={(e) => updateContent('description', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* QUOTE */}
                        {(element.type === 'quote') && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Quote Text</Label>
                                    <Textarea value={element.content.text} onChange={(e) => updateContent('text', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* VIDEO */}
                        {(element.type === 'video') && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Video URL</Label>
                                    <Input value={element.content.url} onChange={(e) => updateContent('url', e.target.value)} />
                                </div>
                            </div>
                        )}

                    </TabsContent>

                    <TabsContent value="style" className="space-y-6 m-0">

                        {/* TYPOGRAPHY */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Type className="w-3 h-3" /> Typography
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={element.styles?.color || '#000000'}
                                            onChange={(e) => updateStyle('color', e.target.value)}
                                            className="w-8 h-8 p-0 border-none px-0 py-0"
                                        />
                                        <Input
                                            value={element.styles?.color || ''}
                                            onChange={(e) => updateStyle('color', e.target.value)}
                                            placeholder="#000000"
                                            className="text-xs h-8 flex-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Align</Label>
                                    <select
                                        className="w-full text-xs h-8 border rounded px-2"
                                        value={element.styles?.textAlign || 'left'}
                                        onChange={(e) => updateStyle('textAlign', e.target.value)}
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* BACKGROUND */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Palette className="w-3 h-3" /> Background
                            </h4>
                            <div className="space-y-1">
                                <Label className="text-xs">Background Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={element.styles?.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                        className="w-8 h-8 p-0 border-none"
                                    />
                                    <Input
                                        value={element.styles?.backgroundColor || ''}
                                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                        placeholder="#ffffff"
                                        className="text-xs h-8 flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* SPACING */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Layout className="w-3 h-3" /> Spacing
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Padding</Label>
                                    <Input
                                        value={element.styles?.padding || ''}
                                        onChange={(e) => updateStyle('padding', e.target.value)}
                                        placeholder="e.g. 2rem"
                                        className="text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Margin</Label>
                                    <Input
                                        value={element.styles?.margin || ''}
                                        onChange={(e) => updateStyle('margin', e.target.value)}
                                        placeholder="e.g. 2rem"
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* EFFECTS */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Box className="w-3 h-3" /> Effects
                            </h4>
                            <div className="space-y-2">
                                <Label className="text-xs">Shadow</Label>
                                <select
                                    className="w-full text-xs h-8 border rounded px-2"
                                    value={element.styles?.boxShadow || 'none'}
                                    onChange={(e) => updateStyle('boxShadow', e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="sm">Small</option>
                                    <option value="md">Medium</option>
                                    <option value="lg">Large</option>
                                    <option value="xl">Extra Large</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Animation</Label>
                                <select
                                    className="w-full text-xs h-8 border rounded px-2"
                                    value={element.styles?.animation || 'none'}
                                    onChange={(e) => updateStyle('animation', e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="fade-up">Fade Up</option>
                                    <option value="fade-in">Fade In</option>
                                    <option value="zoom-in">Zoom In</option>
                                </select>
                            </div>
                        </div>

                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
