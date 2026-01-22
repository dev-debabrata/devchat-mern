import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {

    const [text, setText] = useState("");

    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);

    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { sendMessage, selectedUser } = useChatStore();
    const { socket, authUser } = useAuthStore();

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!text.trim() && !mediaPreview) return;

        sendMessage({
            text: text.trim(),
            image: mediaType === "image" ? mediaPreview : null,
            video: mediaType === "video" ? mediaPreview : null,
        });

        if (socket && selectedUser && authUser) {
            socket.emit("stopTyping", {
                senderId: authUser._id,
                receiverId: selectedUser._id,
            });
        }

        setText("");
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    const handleTyping = () => {
        if (!socket || !selectedUser || !authUser) return;

        // emit typing event
        socket.emit("typing", {
            senderId: authUser._id,
            receiverId: selectedUser._id,
        });

        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", {
                senderId: authUser._id,
                receiverId: selectedUser._id,
            });
        }, 800);
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 20 * 1024 * 1024) {
            toast.error("Max file size is 20MB");
            return;
        }

        const reader = new FileReader();

        if (file.type.startsWith("image/")) {
            setMediaType("image");
        } else if (file.type.startsWith("video/")) {
            setMediaType("video");
        } else {
            toast.error("Only image or video allowed");
            return;
        }

        reader.onloadend = () => {
            setMediaPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };



    const removeImage = () => {
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    useEffect(() => {
        if (selectedUser && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedUser]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };



    return (
        <div className="p-4 border-t border-stone-500/50">
            {mediaPreview && (
                <div className="max-w-3xl mx-auto mb-3 flex items-center">
                    <div className="relative">
                        {mediaType === "image" ? (
                            <img
                                src={mediaPreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border border-stone-700"
                            />
                        ) : (
                            <video
                                src={mediaPreview}
                                className="w-32 rounded-lg border border-stone-700"
                                controls
                            />
                        )}

                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-stone-200 hover:bg-stone-700"
                            type="button"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSendMessage}
                className="max-w-3xl mx-auto flex space-x-2 md:space-x-4"
            >
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        handleTyping();
                    }}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="flex-1 resize-none text-stone-100 bg-stone-900/50 border border-stone-500/50 rounded-lg py-2.5 px-3 md:px-4 focus:outline-none focus:border-cyan-500"
                    placeholder="Type your message..."
                />


                <input
                    type="file"
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={handleMediaChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-stone-900/50 text-stone-400 hover:text-stone-200 rounded-lg px-4 transition-colors ${mediaPreview ? "text-cyan-500" : ""
                        }`}
                >
                    <ImageIcon className="w-5 h-5" />
                </button>

                <button
                    type="submit"
                    disabled={!text.trim() && !mediaPreview}
                    className="bg-gradient-to-r from-stone-950 to-stone-900 text-white rounded-lg px-4 py-2 font-medium hover:from-stone-700 hover:to-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
