import {Navigate, Route, Routes} from "react-router-dom";
import Login from "@/pages/Login.tsx";
import Questions from "@/pages/Questions.tsx";
import Answers from "@/pages/Answers.tsx";
import Notfound from "@/pages/Notfound.tsx";
import {useAuth} from "@/contexts/AutContext.tsx";
import LogedinPageLayout from "@/components/layouts/LogedinPageLayout.tsx";

const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
};

const AdminRoute = ({children}: { children: React.ReactNode }) => {
    const {isAdmin} = useAuth();


    if (!isAdmin) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default function AppRouter() {
    const {isAuthenticated} = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>

            <Route path="/" element={
                isAuthenticated ? <Navigate to="/answers" replace/> : <Navigate to="/login" replace/>
            }/>

            <Route path="/questions" element={
                <ProtectedRoute>
                    <AdminRoute>
                        <LogedinPageLayout>
                            <Questions/>
                        </LogedinPageLayout>
                    </AdminRoute>
                </ProtectedRoute>
            }/>

            <Route path="/answers" element={
                <ProtectedRoute>
                    <LogedinPageLayout>
                        <Answers/>
                    </LogedinPageLayout>
                </ProtectedRoute>
            }/>

            <Route path="*" element={<Notfound/>}/>
        </Routes>
    )
}