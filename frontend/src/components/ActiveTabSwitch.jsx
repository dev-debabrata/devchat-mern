import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
    const { activeTab, setActiveTab } = useChatStore();

    return (
        <div className="flex bg-transparent p-2 mx-2 mt-2 gap-2">
            <button
                onClick={() => setActiveTab("chats")}
                className={`flex-1 py-2 rounded-md cursor-pointer transition ${activeTab === "chats"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-stone-400"
                    }`}
            >
                Chats
            </button>

            <button
                onClick={() => setActiveTab("contacts")}
                className={`flex-1 py-2 rounded-md cursor-pointer transition ${activeTab === "contacts"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-stone-400"
                    }`}
            >
                Contacts
            </button>
        </div>
    );
}

export default ActiveTabSwitch;
