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
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    const clientId = crypto.randomUUID();

    const optimisticMessage = {
      _id: `temp-${clientId}`,
      clientId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // show immediately
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        { ...messageData, clientId }
      );

      // replace optimistic with real
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.clientId === clientId ? res.data : msg
        ),
      }));
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((m) => m.clientId !== clientId),
      }));

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },


  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messagesSeen");

    socket.on("newMessage", async (newMessage) => {
      const state = get();
      const { selectedUser, chats } = state;
      const { authUser } = useAuthStore.getState();

      const isMine = String(newMessage.senderId) === String(authUser._id);

      // 1. Update open chat messages (only if NOT mine)
      if (
        selectedUser &&
        (String(selectedUser._id) === String(newMessage.senderId) ||
          String(selectedUser._id) === String(newMessage.receiverId))
      ) {
        if (!isMine) {
          set((state) => {
            const exists = state.messages.some(
              (msg) => msg._id === newMessage._id
            );

            if (exists) return state;

            return {
              messages: [...state.messages, newMessage],
            };
          });
        }
      }

      // 2. Update chats sidebar
      if (!chats || chats.length === 0) {
        await state.getMyChatPartners();
        return;
      }

      const partnerId = isMine
        ? String(newMessage.receiverId)
        : String(newMessage.senderId);

      let updatedChats = [...chats];
      const index = updatedChats.findIndex(
        (chat) => String(chat._id) === partnerId
      );

      if (index !== -1) {
        const chat = updatedChats[index];

        const updatedChat = {
          ...chat,
          unreadCount:
            selectedUser && String(selectedUser._id) === partnerId
              ? 0
              : (chat.unreadCount || 0) + (isMine ? 0 : 1),
        };

        updatedChats.splice(index, 1);
        updatedChats.unshift(updatedChat);

        set({ chats: updatedChats });
      } else {
        await state.getMyChatPartners();
      }
    });

    socket.on("messagesSeen", ({ from }) => {
      const { authUser } = useAuthStore.getState();

      set((state) => ({
        messages: state.messages.map((msg) =>
          String(msg.senderId) === String(authUser._id) &&
            String(msg.receiverId) === String(from)
            ? { ...msg, seen: true }
            : msg
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));





// sendMessage: async (messageData) => {
//   const { selectedUser, messages } = get();
//   const { authUser } = useAuthStore.getState();

//   const tempId = `temp-${Date.now()}`;

//   const optimisticMessage = {
//     _id: tempId,
//     senderId: authUser._id,
//     receiverId: selectedUser._id,
//     text: messageData.text,
//     image: messageData.image,
//     createdAt: new Date().toISOString(),
//     isOptimistic: true, // flag to identify optimistic messages (optional)
//   };
//   // immidetaly update the ui by adding the message
//   set({ messages: [...messages, optimisticMessage] });

//   try {
//     const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//     set({ messages: messages.concat(res.data) });
//   } catch (error) {
//     // remove optimistic message on failure
//     set({ messages: messages });
//     toast.error(error.response?.data?.message || "Something went wrong");
//   }
// },



// subscribeToMessages: () => {
//   const socket = useAuthStore.getState().socket;
//   if (!socket) return;

//   socket.off("newMessage");
//   socket.off("messagesSeen");

//   socket.on("newMessage", async (newMessage) => {
//     const state = get();
//     const { selectedUser, chats } = state;
//     const { authUser } = useAuthStore.getState();

//     // 1. Update open chat messages

//     if (
//       String(selectedUser?._id) === String(newMessage.senderId) ||
//       String(selectedUser?._id) === String(newMessage.receiverId)
//     ) {
//       //  Ignore messages sent by me (already added optimistically)
//       if (String(newMessage.senderId) === String(authUser._id)) {
//         return;
//       }

//       set((state) => {
//         const exists = state.messages.some(
//           (msg) => msg._id === newMessage._id
//         );

//         if (exists) return state;

//         return {
//           messages: [...state.messages, newMessage],
//         };
//       });
//     }


//     // if (
//     //   String(selectedUser?._id) === String(newMessage.senderId) ||
//     //   String(selectedUser?._id) === String(newMessage.receiverId)
//     // ) {
//     //   set({ messages: [...messages, newMessage] });
//     // }

//     if (!chats || chats.length === 0) {
//       await state.getMyChatPartners();
//       return;
//     }

//     // 2. Find actual chat partner
//     const partnerId =
//       String(newMessage.senderId) === String(authUser._id)
//         ? String(newMessage.receiverId)
//         : String(newMessage.senderId);

//     let updatedChats = [...chats];

//     const index = updatedChats.findIndex(
//       (chat) => String(chat._id) === partnerId
//     );

//     if (index !== -1) {
//       const chat = updatedChats[index];

//       const updatedChat = {
//         ...chat,
//         unreadCount:
//           String(selectedUser?._id) === partnerId
//             ? 0
//             : (chat.unreadCount || 0) + 1,
//       };

//       updatedChats.splice(index, 1);
//       updatedChats.unshift(updatedChat);

//       set({ chats: updatedChats });
//     } else {
//       await state.getMyChatPartners();
//     }
//   });

//   socket.on("messagesSeen", ({ from }) => {
//     const { authUser } = useAuthStore.getState();

//     set((state) => ({
//       messages: state.messages.map((msg) =>
//         msg.senderId === authUser._id && msg.receiverId === from
//           ? { ...msg, seen: true }
//           : msg
//       ),
//     }));
//   });

// },