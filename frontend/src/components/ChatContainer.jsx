import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Check, CheckCheck, X } from "lucide-react";


const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString("en-GB");
};

function ChatContainer() {
    const {
        selectedUser,
        getMessagesByUserId,
        messages,
        isMessagesLoading,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();

    const { authUser } = useAuthStore();
    const containerRef = useRef(null);

    const [previewMedia, setPreviewMedia] = useState(null);
    const [previewType, setPreviewType] = useState(null);



    // Fetch messages + socket
    useEffect(() => {
        if (!selectedUser) return;

        getMessagesByUserId(selectedUser._id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser]);

    // GUARANTEED SCROLL TO BOTTOM
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.scrollTop = container.scrollHeight;
    }, [messages]);


    return (
        <>
            <ChatHeader />

            <div
                ref={containerRef}
                className="flex-1 px-6 overflow-y-auto py-6">
                {isMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : messages.length === 0 ? (
                    <NoChatHistoryPlaceholder name={selectedUser.fullName} />
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg, index) => {
                            const currentDate = formatDate(msg.createdAt);
                            const previousDate =
                                index > 0 ? formatDate(messages[index - 1].createdAt) : null;

                            const showDate = currentDate !== previousDate;
                            const isMe = msg.senderId === authUser._id;

                            return (
                                <div key={msg._id}>

                                    {/* Date Separator */}
                                    {showDate && (
                                        <div className="flex justify-center my-4">
                                            <span className="bg-stone-800 text-stone-300 text-xs px-4 py-1 rounded-full">
                                                {currentDate}
                                            </span>
                                        </div>
                                    )}

                                    {/* Message */}
                                    <div className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                                        {/* Bubble */}
                                        <div
                                            className={`chat-bubble max-w-[75%] px-4 py-2 break-words ${isMe
                                                ? "bg-stone-700 text-white"
                                                : "bg-stone-300 text-stone-950"
                                                }`}
                                        >
                                            {msg.image && (
                                                <img
                                                    src={msg.image}
                                                    alt="Shared"
                                                    onClick={() => {
                                                        setPreviewMedia(msg.image);
                                                        setPreviewType("image");
                                                    }}
                                                    className="rounded-lg h-48 object-cover mb-1 cursor-pointer hover:opacity-80"
                                                />
                                            )}

                                            {msg.video && (
                                                <video
                                                    src={msg.video}
                                                    onClick={() => {
                                                        setPreviewMedia(msg.video);
                                                        setPreviewType("video");
                                                    }}
                                                    className="rounded-lg max-w-xs mb-1 cursor-pointer"
                                                />
                                            )}


                                            {msg.text && (
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                            )}
                                        </div>

                                        {/* Footer (ticks + time) */}
                                        <div className="chat-footer flex items-center mr-1 gap-1 text-[12px] mt-1 text-stone-400">
                                            {isMe &&
                                                (msg.seen ? (
                                                    <CheckCheck className="w-3 h-3 text-sky-400" />
                                                ) : (
                                                    <Check className="w-3 h-3 text-gray-400" />
                                                ))}

                                            <span>
                                                {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                                {/* {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })} */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <MessageInput />

            {previewMedia && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

                    {/* Overlay click to close */}
                    <div
                        className="absolute inset-0"
                        onClick={() => {
                            setPreviewMedia(null);
                            setPreviewType(null);
                        }}
                    />

                    {/* Close button */}
                    <button
                        onClick={() => {
                            setPreviewMedia(null);
                            setPreviewType(null);
                        }}
                        className="absolute top-65 right-4 md:top-8 md:right-35 z-10 text-white bg-black/70 hover:bg-black/30 p-2 rounded-full cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Image or Video */}
                    {previewType === "image" ? (
                        <img
                            src={previewMedia}
                            className="relative z-10 max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
                        />
                    ) : (
                        <video
                            src={previewMedia}
                            controls
                            autoPlay
                            className="relative z-10 max-h-[90vh] max-w-[95vw] rounded-lg"
                        />
                    )}
                </div>
            )}


        </>
    );
}

export default ChatContainer;


// {
//     previewMedia && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

//             {/* Close Button */}
//             <button
//                 onClick={() => setPreviewImage(null)}
//                 className="absolute top-65 right-4 md:top-8 md:right-35 z-10 text-white bg-black/70 hover:bg-black/30 p-2 rounded-full cursor-pointer"
//             >
//                 <X className="w-6 h-6" />
//             </button>

//             {/* Image */}
//             <img
//                 src={previewImage}
//                 alt="Preview"
//                 className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
//                 onClick={(e) => e.stopPropagation()}
//             />

//             {/* Click outside to close */}
//             <div
//                 className="absolute inset-0"
//                 onClick={() => setPreviewImage(null)}
//             />
//         </div>
//     )
// }