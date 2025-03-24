import {useAuth} from "@/contexts/AutContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import LoginForm from "@/components/Auth/LoginForm.tsx";

export default function Login() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (

        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
            <div className="w-full max-w-md mx-auto text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Quick Quiz</h1>
                <p className="text-muted-foreground">Test your knowledge little quick</p>
            </div>
            <LoginForm/>
            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>Admin account: admin@example.com / admin</p>
                <p>User account: user@example.com / user</p>
            </div>
        </div>

    );
}