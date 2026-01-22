import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="w-[400px] md:w-[450px] p-8 bg-stone-950 rounded-md shadow">
            <div className="text-center text-white my-4">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-stone-200 mb-4" />
                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                </h2>
                <p className="text-stone-400">
                    Login to access to your account
                </p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6">
                {/* EMAIL INPUT */}
                <div>
                    <label className=" block text-sm font-medium text-stone-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 size-5" />

                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2 pl-10 pr-4 text-stone-200 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="dev-debabrata@gmail.com"
                            required
                        />
                    </div>
                </div>

                {/* PASSWORD INPUT */}
                <div>
                    <label className="block text-sm font-medium text-stone-300 mb-2">Password</label>
                    <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 size-5" />

                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-stone-800/50 border border-stone-700 rounded-lg py-2 pl-10 pr-4 text-stone-200 placeholder-stone-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    className="w-full bg-stone-800 text-white rounded-lg py-2.5 font-medium hover:bg-stone-700 focus:ring-2 focus:ring-stone-500 cursor-pointer"
                    type="submit"
                    disabled={isLoggingIn}>
                    {isLoggingIn ? (
                        <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link
                    to="/signup"
                    className="px-4 py-2 inline-block bg-stone-500/10 rounded-lg text-stone-400 hover:text-blue-500 text-sm transition-colors">
                    Don't have an account? Sign Up
                </Link>
            </div>
        </div>
    );
}
export default LoginPage;
