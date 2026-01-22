import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router";
import { ArrowLeft, LogOutIcon } from "lucide-react";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useAuthStore } from "../store/useAuthStore";


function ChatPage() {
    const { logout, authUser } = useAuthStore();
    const { activeTab, selectedUser } = useChatStore();


    return (
        <div className="relative flex w-full max-w-6xl h-[calc(100vh-2rem)] mx-auto overflow-hidden">
            {/* LEFT SIDE */}
            <div
                className={`bg-stone-950 flex flex-col shadow-2xl md:rounded-l-2xl w-full md:w-80 
          ${selectedUser ? "hidden md:flex" : "flex"} `}
            >
                <div className=" flex justify-center items-center gap-1 px-8 pt-6 pb-4 border-b border-stone-700">
                    <img src="/chat-logo-2.png" alt="" className=" w-8 h-8 brightness-0 invert sepia saturate-200 hue-rotate-[160deg]" />
                    <h1 className=" text-stone-200 font-bold text-3xl">DevChat</h1>
                </div>
                <ActiveTabSwitch />

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {activeTab === "chats" ? <ChatsList /> : <ContactList />}
                </div>

                <div className=" p-4 border-t border-stone-700 flex items-center justify-between 
                md:flex-col md:items-stretch md:gap-1">

                    {/* Profile */}
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 p-4 rounded-lg hover:bg-cyan-500/20 transition-colors"
                    >
                        <img
                            src={authUser.profilePic || "/avatar.png"}
                            alt="User image"
                            className="w-7 h-7 rounded-full object-cover"
                        />
                        <h3 className="text-stone-200 font-medium text-base max-w-[180px] truncate">
                            {authUser.fullName}
                        </h3>
                    </Link>

                    <button
                        onClick={logout}
                        className="md:w-full p-4 rounded-lg flex items-center gap-2 font-semibold text-red-500 hover:bg-red-500/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    >
                        <LogOutIcon className="size-5" />
                        <span className=" hidden md:block">Logout</span>
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div
                className={`flex-1 flex flex-col bg-stone-800 md:rounded-r-2xl
          ${!selectedUser ? "hidden md:flex" : "flex"}`}
            >
                {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
            </div>
        </div>
    );
}
export default ChatPage;
