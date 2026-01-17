import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CameraIcon, LoaderIcon, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function Profile() {
    const { authUser, updateProfile } = useAuthStore();

    const [fullName, setFullName] = useState(authUser?.fullName || "");
    const [about, setAbout] = useState(authUser?.about || "");
    const [selectedImg, setSelectedImg] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setSelectedImg(reader.result);
        };
    };


    const handleSave = async () => {
        setIsSaving(true);

        await updateProfile({
            fullName,
            about,
            ...(selectedImg && { profilePic: selectedImg }),
        });

        setIsSaving(false);
    };

    const handleDeleteImage = async () => {
        setSelectedImg(null);

        // clear file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setIsSaving(true);

        await updateProfile({
            fullName,
            about,
            profilePic: null,
        });

        setIsSaving(false);
    };

    return (
        <div className="flex justify-center min-h-screen py-6 w-full">
            {/* SINGLE CONTAINER */}
            <div className="w-full max-w-5xl bg-stone-950 rounded-2xl shadow-2xl border border-stone-700">

                {/* HEADER */}
                <div className=" flex items-center gap-4 px-6 py-4 border-b border-stone-700 text-stone-200">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 bg-stone-800 rounded-md cursor-pointer hover:bg-stone-700 transition"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-stone-200">
                        Profile Settings
                    </h2>
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-6 max-w-[500px] mx-auto mt-8">

                    {/* AVATAR */}
                    <div className="flex justify-center">
                        <div className="relative group size-28">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="relative group size-28 rounded-full overflow-hidden"
                            >
                                <img
                                    src={selectedImg || authUser?.profilePic || "/avatar.png"}
                                    alt="Profile"
                                    className="size-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <CameraIcon className="text-white size-6" />
                                </div>
                            </button>

                            {/* Delete Icon */}
                            {(selectedImg || authUser?.profilePic) && (
                                <button
                                    onClick={handleDeleteImage}
                                    title="Remove photo"
                                    className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-800 p-1.5 rounded-full shadow-lg cursor-pointer"
                                >
                                    <Trash2 className="size-4 text-white" />
                                </button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    {/* FULL NAME */}
                    <div>
                        <label className="text-sm text-stone-400">Full Name</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    {/* ABOUT */}
                    <div>
                        <label className="text-sm text-stone-400">About</label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={3}
                            placeholder="Write something about yourself…"
                            className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 resize-none focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition disabled:opacity-50 cursor-pointer"
                    >
                        {isSaving ? (
                            <LoaderIcon className="w-full h-5 animate-spin text-center" />
                        ) : ("Save Changes")}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Profile;
