import './App.css'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "@/AppRouter.tsx";
import {Toaster} from "sonner";
import {AuthProvider} from "@/contexts/AutContext.tsx";

function App() {

    return (
        <section className="w-screen">
            <AuthProvider>
                <Toaster/>
                <BrowserRouter>
                    <AppRouter/>
                </BrowserRouter>
            </AuthProvider>
        </section>

    )
}

export default App
