import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Eye, EyeOff, LogIn} from 'lucide-react';
import {useAuth} from "@/contexts/AutContext.tsx";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            login(email, password);
            navigate('/');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Demo credential buttons
    const loginAsAdmin = (e: React.MouseEvent) => {
        e.preventDefault();
        setEmail('admin@example.com');
        setPassword('admin');
        try {
            login('admin@example.com', 'admin');
            navigate('/');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
        }
    };

    const loginAsUser = (e: React.MouseEvent) => {
        e.preventDefault();
        setEmail('user@example.com');
        setPassword('user');

        try {
            login('user@example.com', 'user');
            navigate('/');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
        }
    };

    return (
        <div
            className="w-full max-w-md space-y-8 p-8 backdrop-blur-sm bg-white/10 rounded-xl border border-border shadow-md">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Welcome back</h2>
                <p className="mt-2 text-muted-foreground">Sign in to your account</p>
            </div>

            {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                    {error}
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4"/>
                                ) : (
                                    <Eye className="h-4 w-4"/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2"/>
                      Sign in
                    </span>

                </button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background text-muted-foreground">Demo accounts</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <button
                        onClick={loginAsAdmin}
                        className="text-white inline-flex justify-center items-center px-3 py-2 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                    >
                        Login as Admin
                    </button>
                    <button
                        onClick={loginAsUser}
                        className="text-white inline-flex justify-center items-center px-3 py-2 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                    >
                        Login as User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
