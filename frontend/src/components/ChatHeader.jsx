import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const isOnline =
        selectedUser && onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape") setSelectedUser(null);
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setSelectedUser]);

    return (
        <div className="flex justify-between items-center bg-stone-900/50 border-b border-stone-500/50 max-h-[80px] px-6 flex-1 rounded-tr-2xl">
            <div className="flex items-center space-x-3">

                <div className="relative">
                    <img
                        src={selectedUser.profilePic || "/avatar.png"}
                        alt={selectedUser.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-stone-800"></span>
                    )}
                </div>

                <div>
                    <h3 className="text-stone-200 font-medium">
                        {selectedUser.fullName}
                    </h3>
                    <p className="text-stone-400 text-sm">
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            <button onClick={() => setSelectedUser(null)}>
                <XIcon className="w-5 h-5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer" />
            </button>
        </div>
    );
}

export default ChatHeader;
