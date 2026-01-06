import { useChatStore } from "../store/useChatStore";

// import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
// import ChatContainer from "../components/ChatContainer";
// import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
    const { activeTab, selectedUser } = useChatStore();

    return (
        <div className="relative flex justify-center  w-full max-w-6xl py-8 min-h-screen">
            {/* <BorderAnimatedContainer> */}
            {/* LEFT SIDE */}
            <div className="w-80 bg-stone-950 backdrop-blur-sm flex flex-col rounded-l-2xl">
                <ProfileHeader />
                <ActiveTabSwitch />

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {activeTab === "chats" ? <ChatsList /> : <ContactList />}
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col bg-stone-300 rounded-r-2xl">
                {/* {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />} */}
            </div>
            {/* </BorderAnimatedContainer> */}
        </div>
    );
}
export default ChatPage;
