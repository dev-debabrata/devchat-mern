import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
    const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();

    useEffect(() => {
        getAllContacts();
    }, [getAllContacts]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;

    return (
        <>
            {allContacts.map((contact) => (
                <div
                    key={contact._id}
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => setSelectedUser(contact)}
                >
                    <div className="flex items-center gap-3">
                        <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                            <div className="relative">
                                <img
                                    src={contact.profilePic || "/avatar.png"}
                                    alt={contact.fullName}
                                    className="size-12 rounded-full object-cover"
                                />

                                {onlineUsers.includes(contact._id) && (
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-stone-900"></span>
                                )}
                            </div>
                        </div>
                        <h4 className="text-stone-200 font-medium">{contact.fullName}</h4>
                    </div>
                </div>
            ))}
        </>
    );
}
export default ContactList;
