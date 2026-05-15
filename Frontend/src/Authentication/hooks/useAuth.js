import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout} from "../Services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const res = await login({ email, password });
            if (res.success && res.user) {
                setUser(res.user);
                return { success: true };
            }
            return { success: false, message: res.message };
        } catch (err) {
            console.error("Login hook failed:", err);
            return { success: false, message: "An unexpected error occurred" };
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const res = await register({ username, email, password });
            if (res.success && res.user) {
                setUser(res.user);
                return { success: true };
            }
            return { success: false, message: res.message };
        } catch (err) {
            console.error("Register hook failed:", err);
            return { success: false, message: "An unexpected error occurred" };
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            const data = await logout();
            setUser(null);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }




    return { user, loading, handleLogin, handleRegister, handleLogout };


}







