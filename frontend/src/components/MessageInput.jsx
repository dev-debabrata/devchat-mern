import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {

    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { sendMessage, selectedUser } = useChatStore();
    const { socket, authUser } = useAuthStore();

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!text.trim() && !imagePreview) return;

        sendMessage({
            text: text.trim(),
            image: imagePreview,
        });

        if (socket && selectedUser && authUser) {
            socket.emit("stopTyping", {
                senderId: authUser._id,
                receiverId: selectedUser._id,
            });
        }

        setText("");
        setImagePreview(null);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    useEffect(() => {
        if (selectedUser && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedUser]);


    return (
        <div className="border-t border-stone-500/50 
                p-2 md:p-4 
                sticky bottom- 
                bg-stone-800/95 backdrop-blur
                pb-[env(safe-area-inset-bottom)] rounded-br-2xl">
            {imagePreview && (
                <div className="max-w-3xl mx-auto mb-3 flex items-center">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-stone-700"
                        />
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
                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        handleTyping();
                    }}
                    className="flex-1 text-stone-100 bg-stone-900/50 border border-stone-500/50 rounded-lg py-2.5 px-3 md:py-2 md:px-4 focus:outline-none focus:border-cyan-500"

                    placeholder="Type your message..."
                />

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-stone-900/50 text-stone-400 hover:text-stone-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""
                        }`}
                >
                    <ImageIcon className="w-5 h-5" />
                </button>

                <button
                    type="submit"
                    disabled={!text.trim() && !imagePreview}
                    className="bg-gradient-to-r from-stone-950 to-stone-900 text-white rounded-lg px-4 py-2 font-medium hover:from-stone-700 hover:to-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
