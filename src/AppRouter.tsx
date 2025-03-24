import {Navigate, Route, Routes} from "react-router-dom";
import Login from "@/pages/Login.tsx";
import Questions from "@/pages/Questions.tsx";
import Answers from "@/pages/Answers.tsx";
import Notfound from "@/pages/Notfound.tsx";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>

            <Route path="/" element={<Navigate to="/login" replace/>}/>

            <Route path="/questions" element={<Questions/>}/>

            <Route path="/answers" element={<Answers/>}/>

            <Route path="*" element={<Notfound/>}/>
        </Routes>
    )
}