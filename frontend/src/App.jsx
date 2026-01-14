import { Navigate, Route, Routes } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignupPage";
import PageLoader from "./components/PageLoader";




function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-stone-500 flex items-center justify-center overflow-hidden">

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;
