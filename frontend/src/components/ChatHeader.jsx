import { ArrowLeft, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import UserProfileModal from "./UserProfileModal";

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers, socket } = useAuthStore();

    const [showModal, setShowModal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const isOnline =
        selectedUser && onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape") setSelectedUser(null);
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setSelectedUser]);

    // 👇 Typing listener
    useEffect(() => {
        if (!socket || !selectedUser) return;

        socket.on("typing", ({ senderId }) => {
            if (senderId === selectedUser._id) {
                setIsTyping(true);
            }
        });

        socket.on("stopTyping", ({ senderId }) => {
            if (senderId === selectedUser._id) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [socket, selectedUser]);

    if (!selectedUser) return null;

    return (
        <>
            <div className="flex justify-between items-center 
                bg-stone-900/80 backdrop-blur 
                border-b border-stone-500/50 
                max-h-[80px] 
                px-3 md:px-6 
                sticky top-0 z-20
                md:static
                md:rounded-tr-2xl">


                {/* LEFT: Back arrow (mobile only) + profile */}
                <div className="flex items-center gap-3">

                    {/* Mobile back button */}
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="md:hidden text-stone-300 hover:text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-3 cursor-pointer"
                    >
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


                            <p className="text-stone-400 text-sm flex items-center gap-1">
                                {isTyping ? (
                                    <>
                                        Typing
                                        <span className="flex gap-1 mt-3">
                                            <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                                            <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                                            <span className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                                        </span>
                                    </>
                                ) : isOnline ? (
                                    "Online"
                                ) : (
                                    "Offline"
                                )}
                            </p>

                            {/* <p className="text-stone-400 text-sm">
                            {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
                        </p> */}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setSelectedUser(null)}
                    className="hidden md:block">
                    <XIcon className="w-5 h-5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer" />
                </button>
            </div>

            {showModal && (
                <UserProfileModal
                    user={selectedUser}
                    isOnline={isOnline}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}

export default ChatHeader;

