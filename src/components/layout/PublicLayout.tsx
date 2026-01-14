import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <div className="flex min-h-screen flex-col font-montserrat">
            {/* Placeholder for Navigation */}
            <header className="border-b p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-primary">Trebushany Marble</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>Home</li>
                            <li>About</li>
                            <li>Contact</li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            {/* Placeholder for Footer */}
            <footer className="bg-slate-900 text-white p-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Tribushansky Marble Quarry</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
