import { X } from "lucide-react";

function UserProfileModal({ user, isOnline, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal box */}
            <div className="relative bg-stone-900 rounded-2xl w-full max-w-xl h-120 p-8 z-10 shadow-xl">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer"
                >
                    <X />
                </button>

                {/* Profile */}
                <div className="flex flex-col items-center text-center my-20 space-y-4">
                    <div className="relative">
                        <img
                            src={user.profilePic || "/avatar.png"}
                            alt={user.fullName}
                            className="w-28 h-28 rounded-full object-cover"
                        />
                        {isOnline && (
                            <span className="absolute bottom-1 right-3 h-4 w-4 rounded-full bg-green-500 border-2 border-stone-800"></span>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white mb-1">
                            {user.fullName}
                        </h2>
                        <p className="text-sm text-stone-400">
                            {isOnline ? "Online" : "Offline"}
                        </p>
                    </div>

                    {/* About */}
                    <p className="text-stone-400 text-sm bg-stone-800 p-4 rounded-xl w-full mt-4">
                        {user.about || "Hey there! I'm using DevChat."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserProfileModal;
