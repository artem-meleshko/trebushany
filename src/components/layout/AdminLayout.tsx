import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-sidebar">
            {/* Placeholder for Admin Sidebar */}
            <aside className="w-64 bg-white border-r p-6 hidden md:block">
                <h2 className="text-lg font-bold mb-6">Admin Portal</h2>
                <nav className="space-y-2">
                    <div className="p-2 bg-accent/10 text-accent rounded">Dashboard</div>
                    <div className="p-2 hover:bg-slate-100 rounded">Pages & Builder</div>
                    <div className="p-2 hover:bg-slate-100 rounded">Settings</div>
                </nav>
            </aside>

            <main className="flex-1 overflow-auto bg-slate-50 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
