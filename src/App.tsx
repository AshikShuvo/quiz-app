import './App.css'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "@/AppRouter.tsx";
import {Toaster} from "sonner";
import {AuthProvider} from "@/contexts/AutContext.tsx";
import {QuizProvider} from "@/contexts/QuizContext.tsx";

function App() {

    return (
        <section className="w-screen">
            <AuthProvider>
                <QuizProvider>
                    <Toaster/>
                    <BrowserRouter>
                        <AppRouter/>
                    </BrowserRouter>
                </QuizProvider>

            </AuthProvider>
        </section>

    )
}

export default App
