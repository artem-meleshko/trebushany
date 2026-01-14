export type WidgetType = "section" | "column" | "hero" | "text" | "button" | "image" | "container" | "video" | "gallery" | "card" | "quote";

export interface Widget {
    type: WidgetType;
    label: string;
    icon?: React.ReactNode;
    defaultContent: any;
    defaultStyles?: any;
}
