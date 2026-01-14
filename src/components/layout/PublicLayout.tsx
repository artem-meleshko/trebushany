import { Link, Outlet } from "react-router-dom";
import { Phone, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const PublicLayout = () => {
    return (
        <div className="min-h-screen font-montserrat flex flex-col">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex flex-col leading-tight">
                        <span className="text-[10px] text-gray-500 tracking-widest uppercase">ПРАТ МАРМУРОВИЙ КАР'ЄР</span>
                        <span className="text-xl font-bold text-slate-900 tracking-wide">ТРИБУШАНИ</span>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
                        <Link to="/" className="hover:text-primary transition-colors border-b-2 border-primary pb-1">Головна</Link>
                        <Link to="/about" className="hover:text-primary transition-colors">Про кар'єр</Link>
                        <Link to="/prices" className="hover:text-primary transition-colors">Ціни</Link>
                        <Link to="/ecology" className="hover:text-primary transition-colors">Екологія</Link>
                        <Link to="/investors" className="hover:text-primary transition-colors">Інвесторам</Link>
                        <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center gap-1 border rounded px-2 py-1.5 text-sm font-medium hover:bg-slate-50 cursor-pointer">
                            <span className="text-xl leading-none">🇺🇦</span>
                            <span className="text-slate-700">UA</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>

                        {/* Phone Button */}
                        <Button variant="outline" className="hidden sm:flex gap-2 border-gray-300 text-slate-700 hover:text-primary hover:border-primary">
                            <Phone className="w-4 h-4" />
                            Зателефонувати
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-20">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2024 ПрАТ «ТРИБУШАНИ». Всі права захищені.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
