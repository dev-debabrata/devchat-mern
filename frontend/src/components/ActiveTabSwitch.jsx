import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
    const { activeTab, setActiveTab } = useChatStore();

    return (
        <div className="flex justify-center items-center bg-transparent p-2 m-2">
            <button
                onClick={() => setActiveTab("chats")}
                className={`px-10 py-1 rounded-md cursor-pointer ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-stone-400"
                    }`}
            >
                Chats
            </button>

            <button
                onClick={() => setActiveTab("contacts")}
                className={`px-10 py-1 rounded-md cursor-pointer ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-stone-400"
                    }`}
            >
                Contacts
            </button>
        </div>
    );
}
export default ActiveTabSwitch;
