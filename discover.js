
import { database, ref, get, set } from "./firebase.js";
import { onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById("discoverPosts");
    // const container = document.querySelector(".creators-grid");
    const container = document.getElementById("creatorsContainer");
    const loggedInEmail = localStorage.getItem("loggedInEmail");
    const currentUserId = loggedInEmail ? loggedInEmail.replace(/\./g, "_") : null;


async function loadCreators() {
    try {
        const snapshot = await get(ref(database, "users"));

        if (!snapshot.exists()) {
            container.innerHTML = "<p>No users found 🚫</p>";
            return;
        }

        const allUsers = snapshot.val(); // ✅ FIXED

        container.innerHTML = "";
        const fragment = document.createDocumentFragment();

        Object.entries(allUsers).forEach(([userId, user]) => {

            if (userId === currentUserId) return;
            if (!user) return;

   const name = user.name || "No Name";
const bio = user.portfolio?.bio || "No bio available";

const profile = user.portfolio || {};

const role = profile.niche || "Creator";
const skills = profile.skills || [];

const followers = user.followers
    ? Object.keys(user.followers).length
    : 0;

const avatar =
    profile.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

const card = document.createElement("div");
card.classList.add("creator-card", "glass");

card.innerHTML = `
<div class="creator-top">

    <img src="${avatar}" class="creator-avatar">

    <div class="creator-main">

        <h3>${name}</h3>

        <div class="creator-role">
            ${role}
        </div>

        <p class="creator-bio">
            ${bio}
        </p>

        <div class="creator-skills">
            ${skills.map(skill => `<span>${skill}</span>`).join("")}
        </div>

    </div>

</div>

<div class="creator-stats">
    <span>
        <i class="fas fa-users"></i>
        ${followers} Followers
    </span>
</div>

<div class="card-actions">

    <button class="view-profile-btn" data-id="${userId}">
        View Profile
    </button>

    <button class="connect-btn" data-id="${userId}">
        Connect
    </button>

</div>
`;

            fragment.appendChild(card);
        });

        container.appendChild(fragment);

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = "<p>Error loading creators ❌</p>";
    }
}
function loadDiscoverPosts() {
    const usersRef = ref(database, "users");

    onValue(usersRef, snapshot => {
        const data = snapshot.val();

        if (!postsContainer) return;

        postsContainer.innerHTML = "";

        if (!data) return;

        Object.entries(data).forEach(([userId, user]) => {

            const posts = user?.portfolio?.posts;

            if (!posts) return;

            Object.values(posts)
                .sort((a, b) => b.createdAt - a.createdAt)
                .forEach(post => {

                    const div = document.createElement("div");
                    div.classList.add("glass");
                    div.style.margin = "20px 0";
                    div.style.padding = "10px";

                    if (post.type === "image") {
                        div.innerHTML += `<img src="${post.fileUrl}" style="width:100%">`;
                    } else {
                        div.innerHTML += `<video controls src="${post.fileUrl}" style="width:100%"></video>`;
                    }

                    div.innerHTML += `<p>${post.caption}</p>`;

                    postsContainer.appendChild(div);
                });
        });
    });
}

    if (viewBtn) {
        const userId = viewBtn.dataset.id;

        if (!userId) return;

        window.location.href = `profile.html?id=${encodeURIComponent(userId)}`;
    }

    if (connectBtn) {
        const targetUserId = connectBtn.dataset.id;

        if (!currentUserId) {
            alert("Login required ❌");
            return;
        }

        try {
            const existing = await get(ref(database, `connectionRequests/${targetUserId}/${currentUserId}`));
            if (existing.exists()) {
                alert("Already requested ⚠️");
                return;
            }

            await set(ref(database, `connectionRequests/${targetUserId}/${currentUserId}`), {
                from: currentUserId,
                status: "pending",
                createdAt: Date.now()
            });

            
            const notifId = Date.now();

await set(ref(database, `notifications/${targetUserId}/${notifId}`), {
    type: "connection",
    from: currentUserId,
    message: "sent you a connection request",
    status: "pending",   
    createdAt: notifId
});

            
            connectBtn.innerText = "Requested";
            connectBtn.disabled = true;

        } catch (err) {
            console.error("Error:", err);
        }
    }
});

    loadCreators();
    loadDiscoverPosts();
});