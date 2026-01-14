import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  clearUnreadForUser: (userId) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === userId
          ? { ...chat, unreadCount: 0 }
          : chat
      ),
    })),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // prevent duplicate listeners
    socket.off("newMessage");
    socket.off("messagesSeen");

    // When a new message arrives
    socket.on("newMessage", async (newMessage) => {
      const state = get();
      const { selectedUser, chats, messages } = state;

      // If currently chatting with this user → add message
      if (selectedUser?._id === newMessage.senderId) {
        set({ messages: [...messages, newMessage] });
      }

      // If chats not loaded yet, fetch again
      if (!chats || chats.length === 0) {
        await state.getMyChatPartners();
        return;
      }

      // Update unread count
      const updated = chats.map(chat => {
        if (chat._id === newMessage.senderId) {
          return {
            ...chat,
            unreadCount:
              selectedUser?._id === chat._id
                ? 0
                : (chat.unreadCount || 0) + 1,
          };
        }
        return chat;
      });

      // Move sender to top
      const sorted = [
        updated.find(c => c._id === newMessage.senderId),
        ...updated.filter(c => c._id !== newMessage.senderId),
      ];

      set({ chats: sorted });
    });

    // 🔥 THIS IS THE PART YOU WERE MISSING
    // When backend says messages were read
    socket.on("messagesSeen", ({ from }) => {
      set((state) => ({
        chats: state.chats.map(chat =>
          chat._id === from
            ? { ...chat, unreadCount: 0 }
            : chat
        ),
      }));
    });
  },


  // subscribeToMessages: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;

  //   socket.off("newMessage");

  //   socket.on("newMessage", async (newMessage) => {
  //     const state = get();
  //     const { selectedUser, chats, messages } = state;

  //     // 1. If open chat → update messages
  //     if (selectedUser?._id === newMessage.senderId) {
  //       set({ messages: [...messages, newMessage] });
  //     }

  //     // 2. If chats not loaded yet → fetch them
  //     if (!chats || chats.length === 0) {
  //       await state.getMyChatPartners();
  //       return;
  //     }

  //     // 3. If sender not in list → refetch chats
  //     const exists = chats.some(c => c._id === newMessage.senderId);
  //     if (!exists) {
  //       await state.getMyChatPartners();
  //       return;
  //     }

  //     // 4. Update unread + move to top
  //     const updated = chats.map(chat => {
  //       if (chat._id === newMessage.senderId) {
  //         return {
  //           ...chat,
  //           unreadCount:
  //             selectedUser?._id === chat._id
  //               ? 0
  //               : (chat.unreadCount || 0) + 1,
  //         };
  //       }
  //       return chat;
  //     });

  //     const sorted = [
  //       updated.find(c => c._id === newMessage.senderId),
  //       ...updated.filter(c => c._id !== newMessage.senderId),
  //     ];

  //     set({ chats: sorted });
  //   });
  // },



  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));



// subscribeToMessages: () => {
//   const { selectedUser, isSoundEnabled } = get();
//   if (!selectedUser) return;

//   const socket = useAuthStore.getState().socket;

//   socket.on("newMessage", (newMessage) => {
//     const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
//     if (!isMessageSentFromSelectedUser) return;

//     const currentMessages = get().messages;
//     set({ messages: [...currentMessages, newMessage] });

//     if (isSoundEnabled) {
//       const notificationSound = new Audio("/sounds/notification.mp3");

//       notificationSound.currentTime = 0; // reset to start
//       notificationSound.play().catch((e) => console.log("Audio play failed:", e));
//     }
//   });
// },
