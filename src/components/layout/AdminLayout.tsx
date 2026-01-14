import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const AdminLayout = () => {
    const { session, loading, signOut } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/admin-login" replace />;
    }

    const handleSignOut = async () => {
        await signOut();
        navigate("/admin-login");
    };

    return (
        <div className="flex h-screen bg-sidebar">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-bold">Адмін Панель</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="p-2 bg-accent/10 text-accent rounded font-medium cursor-pointer" onClick={() => navigate("/admin-portal")}>Дашборд</div>
                    <div className="p-2 hover:bg-slate-100 rounded cursor-pointer" onClick={() => navigate("/admin-portal/page-builder")}>Конструктор Сторінок</div>
                    <div className="p-2 hover:bg-slate-100 rounded cursor-not-allowed opacity-50">Налаштування</div>
                </nav>

                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4" />
                        Вийти
                    </Button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto bg-slate-50 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
