import { Navigate, Route, Routes, useLocation } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignupPage";
import PageLoader from "./components/PageLoader";
import Footer from "./components/Footer";


function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  const showFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-stone-200 flex flex-col">

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        </Routes>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}

      <Toaster />
    </div>

  );
}
export default App;
