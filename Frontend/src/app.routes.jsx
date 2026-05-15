import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import JournalChat from "./journal-chat/App.jsx";
import Journal_AI from "./journal-ai-chat/App.jsx";
import Journal_AI_Analytics from "./journal-ai-analytics/App.jsx";
import Protected from  "./Authentication/Components/protected.jsx"
import Login from "./Authentication/Pages/login.jsx";
import Register from "./Authentication/Pages/register.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/journal-chat",
        element: <Protected> <JournalChat /> </Protected>
    },
    {
        path: "/journal-ai",
        element: <Protected> <Journal_AI /> </Protected> 
    },
    {
        path: "/journal-ai-analytics",
        element: <Protected> <Journal_AI_Analytics /> </Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
]);