import {
    database,
    ref,
    push,
    set,
    onValue,
    get
} from "./firebase.js";

// Fetch current session details
const email = localStorage.getItem("loggedInEmail");
if (!email) {
    window.location.href = "login.html";
}
const currentUser = email.replace(/\./g, "_");

const params = new URLSearchParams(window.location.search);
let otherUser = params.get("user");
if (otherUser) {
    otherUser = otherUser.replace(/\./g, "_");
}

// Elements mapping
const inboxList = document.getElementById("inboxList");
const noChatSelected = document.getElementById("noChatSelected");
const activeChatWindow = document.getElementById("activeChatWindow");
const activeHeaderName = document.getElementById("activeHeaderName");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let activeRoomListener = null;

// =====================================
// INITIALIZE INBOX & LAYOUT MANAGEMENT
// =====================================
window.addEventListener("DOMContentLoaded", () => {
    // 1. Load the sidebar history
    loadInboxSidebar();
    
    // 2. Independently open the conversation if a user is specified in the URL
    if (otherUser && otherUser !== "null") {
        openConversation(otherUser);
    } else {
        noChatSelected.classList.remove("hidden");
        activeChatWindow.classList.add("hidden");
    }
});

// =====================================
// BUILD SIDEBAR INBOX (LINKEDIN STYLE)
// =====================================
function loadInboxSidebar() {
    const chatsRef = ref(database, "chats");

    onValue(chatsRef, async (snapshot) => {
        inboxList.innerHTML = "";
        const activeMatches = [];
        const uniqueContacts = new Set();

        // Parse historical logs if any exist in DB
        if (snapshot.exists()) {
            const allRooms = snapshot.val();

            for (const roomId in allRooms) {
                if (roomId.includes(currentUser)) {
                    let contactKey = "";
                    
                    if (roomId.startsWith(currentUser + "_")) {
                        contactKey = roomId.replace(currentUser + "_", "");
                    } else if (roomId.endsWith("_" + currentUser)) {
                        contactKey = roomId.replace("_" + currentUser, "");
                    } else {
                        const parts = roomId.split("_");
                        contactKey = parts[0] === currentUser ? parts[1] : parts[0];
                    }

                    if (!contactKey || uniqueContacts.has(contactKey)) continue;
                    uniqueContacts.add(contactKey);

                    const roomMessages = Object.values(allRooms[roomId]);
                    const lastMsgObj = roomMessages[roomMessages.length - 1];

                    activeMatches.push({
                        contactKey: contactKey,
                        lastMessage: lastMsgObj ? lastMsgObj.message : "",
                        time: lastMsgObj ? lastMsgObj.time : 0
                    });
                }
            }

            // Sort conversations by latest message timestamp
            activeMatches.sort((a, b) => b.time - a.time);
        }

        // FIX: Force target profile user into the sidebar even if chats node is empty!
        if (otherUser && otherUser !== "null" && !activeMatches.some(m => m.contactKey === otherUser)) {
            activeMatches.unshift({
                contactKey: otherUser,
                lastMessage: "Click to start typing...",
                time: Date.now()
            });
        }

        // If there's absolutely no history and no active profile clicked
        if (activeMatches.length === 0) {
            inboxList.innerHTML = `<div class="empty-inbox">No messages yet</div>`;
            return;
        }

        // Render conversation slots
        for (const match of activeMatches) {
            let fallbackName = match.contactKey.replace(/_/g, ".");
            if (!fallbackName.includes(".com") && fallbackName.includes("@")) {
                fallbackName += ".com";
            }

            let displayDetails = {
                name: fallbackName,
                avatar: `https://ui-avatars.com/api/?name=User&background=random`
            };

            try {
                const userSnapshot = await get(ref(database, `users/${match.contactKey}`));
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    if (userData.name) {
                        displayDetails.name = userData.name;
                        displayDetails.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`;
                    }
                }
            } catch (err) {
                console.error("Error fetching sidebar user details:", err);
            }

            const itemDiv = document.createElement("div");
            itemDiv.className = `inbox-item ${otherUser === match.contactKey ? "active-chat-item" : ""}`;
            itemDiv.innerHTML = `
                <img src="${displayDetails.avatar}" class="inbox-avatar" alt="Avatar">
                <div class="inbox-info">
                    <div class="inbox-name">${displayDetails.name}</div>
                    <div class="inbox-snippet">${match.lastMessage}</div>
                </div>
            `;

            itemDiv.addEventListener("click", () => {
                document.querySelectorAll(".inbox-item").forEach(i => i.classList.remove("active-chat-item"));
                itemDiv.classList.add("active-chat-item");
                
                history.pushState(null, "", `chat.html?user=${match.contactKey}`);
                otherUser = match.contactKey;
                
                openConversation(match.contactKey);
            });

            inboxList.appendChild(itemDiv);
        }
    });
}

// =====================================
// CHAT BOX INTERACTION WINDOW
// =====================================
async function openConversation(targetUserKey) {
    noChatSelected.classList.add("hidden");
    activeChatWindow.classList.remove("hidden");

    const viewProfileBtn = document.getElementById("viewProfileBtn");

    const userSnapshot = await get(ref(database, `users/${targetUserKey}`));
    if (userSnapshot.exists() && userSnapshot.val().name) {
        activeHeaderName.textContent = userSnapshot.val().name;
    } else {
        let fallbackName = targetUserKey.replace(/_/g, ".");
        if (!fallbackName.includes(".com") && fallbackName.includes("@")) {
            fallbackName += ".com";
        }
        activeHeaderName.textContent = fallbackName;
    }

    if (viewProfileBtn) {
        let originalEmail = targetUserKey.replace(/_/g, ".");
        if (!originalEmail.includes(".com") && originalEmail.includes("@")) {
            originalEmail += ".com";
        }
        
        const newBtn = viewProfileBtn.cloneNode(true);
        viewProfileBtn.parentNode.replaceChild(newBtn, viewProfileBtn);
        
        newBtn.addEventListener("click", () => {
            window.location.href = `profile.html?id=${originalEmail}`;
        });
    }

    const roomId = [currentUser, targetUserKey].sort().join("_");

    if (activeRoomListener) {
        activeRoomListener();
    }

    const targetRoomRef = ref(database, `chats/${roomId}`);
    
    activeRoomListener = onValue(targetRoomRef, (snapshot) => {
        messagesDiv.innerHTML = "";
        const data = snapshot.val();
        if (!data) return;

        Object.values(data).forEach(msg => {
            const div = document.createElement("div");
            div.className = msg.sender === currentUser ? "my-message" : "other-message";
            div.innerHTML = `${msg.message}`;
            messagesDiv.appendChild(div);
        });

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// =====================================
// MESSAGE TRANSMISSION LOGIC
// =====================================
sendBtn.addEventListener("click", sendMessageAction);
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessageAction();
});

async function sendMessageAction() {
    const text = messageInput.value.trim();
    if (!text || !otherUser) return;

    const roomId = [currentUser, otherUser].sort().join("_");
    const timestamp = Date.now();

    await push(ref(database, `chats/${roomId}`), {
        sender: currentUser,
        message: text,
        time: timestamp
    });

    await push(ref(database, `messageNotifications/${otherUser}`), {
        from: currentUser,
        message: text,
        read: false,
        time: timestamp
    });

    await push(ref(database, `notifications/${otherUser}`), {
        type: "message",
        from: currentUser,
        message: text,
        createdAt: timestamp,
        status: "unread"
    });

    messageInput.value = "";
}