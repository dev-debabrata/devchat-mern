import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
    const {
        getMyChatPartners,
        chats,
        isUsersLoading,
        setSelectedUser,
        clearUnreadForUser,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();

    const { onlineUsers, socket } = useAuthStore();

    useEffect(() => {
        getMyChatPartners();
    }, [getMyChatPartners]);

    useEffect(() => {
        if (!socket) return;

        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket]);


    if (isUsersLoading) return <UsersLoadingSkeleton />;
    if (chats.length === 0) return <NoChatsFound />;

    return (
        <>
            {chats.map((chat) => (
                <div
                    key={chat._id}
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => {
                        setSelectedUser(chat);
                        clearUnreadForUser(chat._id);
                    }}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={chat.profilePic || "/avatar.png"}
                                    alt={chat.fullName}
                                    className="size-12 rounded-full object-cover"
                                />
                                {onlineUsers.includes(chat._id) && (
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-stone-900"></span>
                                )}
                            </div>
                            <h4 className="text-stone-200 font-medium truncate">
                                {chat.fullName}
                            </h4>
                        </div>

                        {chat.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {chat.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

export default ChatsList;
