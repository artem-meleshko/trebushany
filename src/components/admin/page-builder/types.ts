export type WidgetType = "hero" | "text" | "button" | "image" | "container";

export interface Widget {
    type: WidgetType;
    label: string;
    icon?: React.ReactNode;
    defaultContent: any;
}
