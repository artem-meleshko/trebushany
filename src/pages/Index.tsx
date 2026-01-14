import { Button } from "@/components/ui/button";
import { Mountain, Truck, Award, FileCheck } from "lucide-react";

// Stats Data
const stats = [
    { icon: <Mountain className="w-6 h-6 text-primary" />, value: "1 947", label: "Рік заснування" },
    { icon: <Truck className="w-6 h-6 text-primary" />, value: "50 000т", label: "Річний видобуток" },
    { icon: <Award className="w-6 h-6 text-primary" />, value: "29+", label: "Видів продукції" },
    { icon: <FileCheck className="w-6 h-6 text-primary" />, value: "100%", label: "Платник ПДВ" },
];

const Index = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center bg-slate-50 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1618608823467-313d5b00c6d6?q=80&w=2576&auto=format&fit=crop"
                    alt="Marble Quarry"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 text-xs font-medium text-slate-800 border border-white/50 mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Офіційний видобуток з 1947 року
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        ПРАТ «ТРИБУШАНИ» -
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed">
                        ПРАТ «ТРИБУШАНИ» - <b>єдиний офіційний та ліцензований</b> видобуток мармуру в Україні,
                        що з 1947 року формує стандарти міцності та естетики для всього Східноєвропейського регіону.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-up">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white min-w-[200px] shadow-lg shadow-primary/20">
                            Переглянути продукцію
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white/50 border-slate-300 hover:bg-white text-slate-700 min-w-[200px]">
                            Про компанію
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center gap-3"
                            >
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-1">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button size="icon" className="h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </Button>
            </div>
        </div>
    );
};

export default Index;
