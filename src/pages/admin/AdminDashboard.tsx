const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-slate-500">Total Leads</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-slate-500">Published Pages</h3>
                    <p className="text-3xl font-bold mt-2">8</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-medium text-slate-500">Products</h3>
                    <p className="text-3xl font-bold mt-2">24</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
