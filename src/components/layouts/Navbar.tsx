import React from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {LogOut, Menu, X} from 'lucide-react';
import {useAuth} from "@/contexts/AutContext.tsx";

const Navbar: React.FC = () => {
    const {user, isAdmin, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    if (!user) return null;

    const navLinks = [
        ...(isAdmin ? [{path: '/questions', label: 'Questions'}] : []),
        {path: '/answers', label: 'Answers'},
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container h-16 flex items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">Quick Quiz</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors ${
                                location.pathname === link.path
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="text-white inline-flex items-center justify-center h-9 px-3 text-sm font-medium transition-colors rounded-md bg-secondary hover:bg-secondary/80"
                        >
                            <LogOut className="text-white mr-2 h-4 w-4"/>
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-secondary"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? (
                        <X className="text-white h-6 w-6"/>
                    ) : (
                        <Menu className="text-white h-6 w-6"/>
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-background md:hidden animate-fade-in">
                    <nav className="container flex flex-col p-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-lg font-medium py-2 transition-colors ${
                                    location.pathname === link.path
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                                onClick={closeMenu}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-4 mt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-white inline-flex items-center justify-center h-9 px-4 text-sm font-medium transition-colors rounded-md bg-secondary hover:bg-secondary/80"
                                >
                                    <LogOut className="text-white mr-2 h-4 w-4"/>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
