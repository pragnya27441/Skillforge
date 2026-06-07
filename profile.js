
// import { database, ref, get } from "./firebase.js";
import {
  database,
  ref,
  set,
  get,
  push,
  onValue


} from "./firebase.js";

// ================== GET USER FROM URL ==================
const params = new URLSearchParams(window.location.search);
let userId = params.get("id");

// Normalize email → Firebase key
if (userId) {
    userId = userId.replace(/\./g, "_");
}
console.log("Profile userId:", userId);
    // console.log("Logged user:", normalizedLoggedUser);
    console.log("Logged user:", localStorage.getItem("currentUser"));
//let postsContainer;
// ================== LOAD USER ==================
async function loadUser() {
    if (!userId) {
        console.error("No userId in URL");
        return;
    }

    try {
        const snapshot = await get(ref(database, "users/" + userId));

        if (!snapshot.exists()) {
            console.error("User not found");
            return;
        }

        const data = snapshot.val();
        const portfolio = data.portfolio || {};

        // ===== FILL UI =====
        document.getElementById("name").textContent = data.name || "No Name";
        document.getElementById("niche").textContent = portfolio.niche || "No niche";
        document.getElementById("bio").textContent = portfolio.bio || "No bio";

        document.getElementById("skills").textContent =
            Array.isArray(portfolio.skills)
                ? portfolio.skills.join(", ")
                : (portfolio.skills || "No skills");

        document.getElementById("tools").textContent = portfolio.tools || "No tools";
        document.getElementById("project").textContent = portfolio.project || "No project";
        document.getElementById("milestone").textContent = portfolio.milestone || "No milestone";

        // ===== AVATAR =====
        const avatarLarge = document.querySelector('.profile-avatar-large img');
        const avatarSmall = document.querySelector('.profile-avatar img');

        if (data.name) {
            const avatarUrl =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`;

            if (avatarLarge) avatarLarge.src = avatarUrl;
            if (avatarSmall) avatarSmall.src = avatarUrl;
        }

    } catch (err) {
        console.error("Error loading user:", err);
    }
}

// ================== POSTS (LOCAL STORAGE) ==================
// const postBtn = document.getElementById("postBtn");
// const postFile = document.getElementById("postFile");
// const postCaption = document.getElementById("postCaption");
// const postsContainer = document.getElementById("postsContainer");

// // Hide post button if not owner
// const loggedInUser = localStorage.getItem("currentUser");

// if (loggedInUser && loggedInUser.replace(/\./g, "_") !== userId) {
//     if (postBtn) postBtn.style.display = "none";
// }
// window.addEventListener("DOMContentLoaded", () => {

    // loadUser();
    // loadPosts();
    // const postBtn = document.getElementById("postBtn");
    // const postFile = document.getElementById("postFile");
    // const postCaption = document.getElementById("postCaption");
    // const postsContainer = document.getElementById("postsContainer");
    //postsContainer = document.getElementById("postsContainer");

// loadUser();
// loadPosts();
// const postsContainer = document.getElementById("postsContainer");
// const textPostBtn = document.getElementById("textPostBtn");
// const mediaPostBtn = document.getElementById("mediaPostBtn");

// const textPost = document.getElementById("textPost");

// const mediaPost = document.getElementById("mediaPost");
// const mediaCaption = document.getElementById("mediaCaption");
// loadUser();
// loadPosts();
window.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadPosts();

    setupPostButtons();

    const messageBtn = document.getElementById("messageBtn");

    if (messageBtn) {

        messageBtn.addEventListener("click", () => {

            window.location.href =
            `chat.html?user=${userId}`;

        });

    }

});
function setupPostButtons() {
    const postsContainer = document.getElementById("postsContainer");
    const textPostBtn = document.getElementById("textPostBtn");
    const mediaPostBtn = document.getElementById("mediaPostBtn");

    const textPost = document.getElementById("textPost");
    const mediaPost = document.getElementById("mediaPost");
    const mediaCaption = document.getElementById("mediaCaption");

    const loggedInUser = localStorage.getItem("currentUser");

    const normalizedLoggedUser = loggedInUser
        ? loggedInUser.replace(/\./g, "_")
        : null;

    // ✅ SHOW / HIDE BUTTONS
    // if (normalizedLoggedUser === userId) {
    //     textPostBtn.style.display = "inline-block";
    //     mediaPostBtn.style.display = "inline-block";
    // } else {
    //     textPostBtn.style.display = "none";
    //     mediaPostBtn.style.display = "none";
    // }
    if (textPostBtn && mediaPostBtn) {
    if (normalizedLoggedUser === userId) {
        textPostBtn.style.display = "inline-block";
        mediaPostBtn.style.display = "inline-block";
    } else {
        textPostBtn.style.display = "none";
        mediaPostBtn.style.display = "none";
    }
}
    // ✅ TEXT POST
    // textPostBtn.addEventListener("click", () => {
    //     if (!userId || normalizedLoggedUser !== userId) {
    //         alert("You can't post here");
    //         return;
    //     }

    //     const caption = textPost.value.trim();

    //     if (!caption) {
    //         alert("Write something first");
    //         return;
    //     }

    //     const postData = {
    //         file: null,
    //         caption: caption,
    //         time: Date.now()
    //     };

    //     savePost(postData);
    //     displayPost(postData);

    //     textPost.value = "";
    // });
//     textPostBtn.addEventListener("click", async () => {

//     if (!userId || normalizedLoggedUser !== userId) {
//         alert("You can't post here");
//         return;
//     }

//     const caption = textPost.value.trim();

//     if (!caption) {
//         alert("Write something first");
//         return;
//     }

//     const newPostRef = push(
//         ref(database, "posts")
//     );

//     await set(newPostRef, {
//         userId,
//         caption,
//         mediaUrl: "",
//         mediaType: "text",
//         time: Date.now()
//     });

//     textPost.value = "";
// });
textPostBtn.addEventListener("click", async () => {

    if (!userId || normalizedLoggedUser !== userId) {
        alert("You can't post here");
        return;
    }

    const caption = textPost.value.trim();

    if (!caption) {
        alert("Write something first");
        return;
    }

    const newPostRef = push(
        ref(database, "posts")
    );

    await set(newPostRef, {
        userId,
        caption,
        mediaUrl: "",
        mediaType: "text",
        time: Date.now()
    });

    textPost.value = "";
});

    // ✅ MEDIA POST
    // mediaPostBtn.addEventListener("click", () => {
    //     if (!userId || normalizedLoggedUser !== userId) {
    //         alert("You can't post here");
    //         return;
    //     }

    //     const file = mediaPost.files[0];
    //     const caption = mediaCaption.value.trim();

    //     if (!file) {
    //         alert("Please select a file");
    //         return;
    //     }

    //     const reader = new FileReader();

    //     reader.onload = function () {
    //         const postData = {
    //             file: reader.result,
    //             caption: caption,
    //             time: Date.now()
    //         };

    //         // savePost(postData);
    //         // displayPost(postData);

    //         mediaPost.value = "";
    //         mediaCaption.value = "";
    //     };

    //     reader.readAsDataURL(file);
    // });
}
// mediaPostBtn.addEventListener("click", async () => {

//     if (!userId || normalizedLoggedUser !== userId) {
//         alert("You can't post here");
//         return;
//     }

//     const file = mediaPost.files[0];
//     const caption = mediaCaption.value.trim();

//     if (!file) {
//         alert("Please select a file");
//         return;
//     }

//     try {

//         const fileName =
//             Date.now() + "_" + file.name;

//         const fileRef = storageRef(
//             storage,
//             "posts/" + fileName
//         );

//         // UPLOAD FILE
//         await uploadBytes(fileRef, file);

//         // GET URL
//         const downloadURL =
//             await getDownloadURL(fileRef);

//         // CHECK TYPE
//         const mediaType =
//             file.type.startsWith("video")
//             ? "video"
//             : "image";

//         // SAVE POST
//         const newPostRef = push(
//             ref(database, "posts")
//         );

//         await set(newPostRef, {
//             userId,
//             caption,
//             mediaUrl: downloadURL,
//             mediaType,
//             time: Date.now()
//         });

//         mediaPost.value = "";
//         mediaCaption.value = "";

//     } catch (err) {

//         console.error(err);

//         alert("Upload failed");
//     }
// });
// mediaPostBtn.addEventListener("click", () => {

//     if (!userId || normalizedLoggedUser !== userId) {
//         alert("You can't post here");
//         return;
//     }

//     const file = mediaPost.files[0];
//     if (file.size > 2 * 1024 * 1024) {
//     alert("File too large. Use files under 2MB");
//     return;
// }
//     const caption = mediaCaption.value.trim();

//     if (!file) {
//         alert("Please select a file");
//         return;
//     }

//     const reader = new FileReader();

//     reader.onload = async function () {

//         const mediaType =
//             file.type.startsWith("video")
//             ? "video"
//             : "image";

//         const newPostRef = push(
//             ref(database, "posts")
//         );

//         await set(newPostRef, {
//             userId,
//             caption,
//             mediaUrl: reader.result,
//             mediaType,
//             time: Date.now()
//         });

//         mediaPost.value = "";
//         mediaCaption.value = "";
//     };

//     reader.readAsDataURL(file);
// });
mediaPostBtn.addEventListener("click", () => {

    if (!userId || normalizedLoggedUser !== userId) {
        alert("You can't post here");
        return;
    }

    const file = mediaPost.files[0];
    const caption = mediaCaption.value.trim();

    if (!file) {
        alert("Please select a file");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {

        const mediaType =
            file.type.startsWith("video")
            ? "video"
            : "image";

        const post = {
            userId,
            caption,
            mediaUrl: reader.result,
            mediaType,
            time: Date.now()
        };

        // SAVE IN LOCAL STORAGE
        let mediaPosts =
            JSON.parse(localStorage.getItem("mediaPosts"))
            || [];

        mediaPosts.push(post);

        localStorage.setItem(
            "mediaPosts",
            JSON.stringify(mediaPosts)
        );

        // SHOW POST
        displayPost(post);

        mediaPost.value = "";
        mediaCaption.value = "";

        alert("Media posted successfully");
    };

    reader.readAsDataURL(file);
});
// function loadPosts() {

//     const postsRef = ref(database, "posts");

//     onValue(postsRef, (snapshot) => {

//         const postsContainer =
//             document.getElementById("postsContainer");

//         postsContainer.innerHTML = "";

//         if (!snapshot.exists()) return;

//         const posts = snapshot.val();

//         const postsArray =
//             Object.values(posts);

//         postsArray
//             .sort((a, b) => b.time - a.time)
//             .forEach(post => {

//                 if (post.userId !== userId) return;

//                 displayPost(post);
//             });
//     });
// }
// function loadPosts() {

//     const postsRef = ref(database, "posts");

//     onValue(postsRef, (snapshot) => {

//         const postsContainer =
//             document.getElementById("postsContainer");

//         postsContainer.innerHTML = "";

//         if (!snapshot.exists()) return;

//         const posts = snapshot.val();

//         const postsArray =
//             Object.values(posts);

//         postsArray
//             .sort((a, b) => b.time - a.time)
//             .forEach(post => {

//                 if (post.userId !== userId) return;

//                 displayPost(post);
//             });
//     });
// }
function loadPosts() {

    // FIREBASE TEXT POSTS
    const postsRef = ref(database, "posts");

    onValue(postsRef, (snapshot) => {

        const postsContainer =
            document.getElementById("postsContainer");

        postsContainer.innerHTML = "";

        // LOAD FIREBASE POSTS
        if (snapshot.exists()) {

            const posts = snapshot.val();

            const postsArray =
                Object.values(posts);

            postsArray
                .sort((a, b) => b.time - a.time)
                .forEach(post => {

                    if (post.userId !== userId) return;

                    displayPost(post);
                });
        }

        // LOAD MEDIA POSTS
        let mediaPosts =
            JSON.parse(localStorage.getItem("mediaPosts"))
            || [];

        mediaPosts
            .sort((a, b) => b.time - a.time)
            .forEach(post => {

                if (post.userId !== userId) return;

                displayPost(post);
            });
    });
}

// const postsContainer = document.getElementById("postsContainer");
// postsContainer = document.getElementById("postsContainer");
// if (textPostBtn) {
//     textPostBtn.addEventListener("click", () => {

//         const caption = textPost.value.trim();

//         if (!caption) {
//             alert("Write something first");
//             return;
//         }

//         const postData = {
//             file: null,
//             caption: caption,
//             time: Date.now()
//         };

//         savePost(postData);
//         displayPost(postData);

//         textPost.value = "";
//     });
// }
// if (mediaPostBtn) {
//     mediaPostBtn.addEventListener("click", () => {

//         const file = mediaPost.files[0];
//         const caption = mediaCaption.value.trim();

//         if (!file) {
//             alert("Please select a file");
//             return;
//         }

//         const reader = new FileReader();

//         reader.onload = function () {
//             const postData = {
//                 file: reader.result,
//                 caption: caption,
//                 time: Date.now()
//             };

//             savePost(postData);
//             displayPost(postData);

//             mediaPost.value = "";
//             mediaCaption.value = "";
//         };

//         reader.readAsDataURL(file);
//     });
// }

    // ✅ Get logged in user
    // const loggedInUser = localStorage.getItem("currentUser");

    // // ✅ Normalize both
    // const normalizedLoggedUser = loggedInUser
    //     ? loggedInUser.replace(/\./g, "_")
    //     : null;

    // console.log("Profile userId:", userId);
    // console.log("Logged user:", normalizedLoggedUser);

    // ✅ Hide button only if NOT same user
    // if (normalizedLoggedUser !== userId) {
    //     if (postBtn) postBtn.style.display = "none";
    // }
//     if (normalizedLoggedUser !== userId) {
//     if (textPostBtn) textPostBtn.style.display = "none";
//     if (mediaPostBtn) mediaPostBtn.style.display = "none";
// }
// const postSection = document.querySelector(".post-section");

// if (!normalizedLoggedUser || normalizedLoggedUser !== userId) {
//     if (postSection) postSection.style.display = "none";
// }
// if (!normalizedLoggedUser || normalizedLoggedUser !== userId) {
// //     // if (textPostBtn) textPostBtn.style.display = "none";
// //     // if (mediaPostBtn) mediaPostBtn.style.display = "none";
// //     // Always show buttons
// if (textPostBtn) textPostBtn.style.display = "inline-block";
// if (mediaPostBtn) mediaPostBtn.style.display = "inline-block";
// }
// if (normalizedLoggedUser && normalizedLoggedUser === userId) {
//     if (textPostBtn) textPostBtn.style.display = "inline-block";
//     if (mediaPostBtn) mediaPostBtn.style.display = "inline-block";
// } else {
//     if (textPostBtn) textPostBtn.style.display = "none";
//     if (mediaPostBtn) mediaPostBtn.style.display = "none";
// }
// if (normalizedLoggedUser !== userId) {
//     if (textPostBtn) textPostBtn.disabled = true;
//     if (mediaPostBtn) mediaPostBtn.disabled = true;
// }
    // ✅ Post button logic
    // if (postBtn) {
    //     postBtn.addEventListener("click", () => {
    //         const file = postFile.files[0];
    //         const caption = postCaption.value.trim();

    //         if (!file) {
    //             alert("Please select a file");
    //             return;
    //         }

    //         const reader = new FileReader();

    //         reader.onload = function () {
    //             const postData = {
    //                 file: reader.result,
    //                 caption: caption,
    //                 time: Date.now()
    //             };

    //             savePost(postData);
    //             displayPost(postData);

    //             postFile.value = "";
    //             postCaption.value = "";
    //         };

    //         reader.readAsDataURL(file);
    //     });
    // }
// });
// ===== SAVE POST =====
// function savePost(postData) {
//     let allPosts = JSON.parse(localStorage.getItem("posts")) || {};

//     if (!allPosts[userId]) {
//         allPosts[userId] = [];
//     }

//     allPosts[userId].push(postData);

//     localStorage.setItem("posts", JSON.stringify(allPosts));
// }
// function savePost(postData) {
//     if (!userId) return; // 🔴 IMPORTANT FIX

//     let allPosts = JSON.parse(localStorage.getItem("posts")) || {};

//     if (!allPosts[userId]) {
//         allPosts[userId] = [];
//     }

//     allPosts[userId].push(postData);

//     localStorage.setItem("posts", JSON.stringify(allPosts));
// }

// ===== DISPLAY POST =====
function displayPost(post) {
    const postsContainer = document.getElementById("postsContainer");
    if (!postsContainer) return;

    const div = document.createElement("div");
    div.className = "post glass";
    // div.style.margin = "15px 0";

    // let media = "";
    let media = "";
let extraClass = "";
let bgColor = "";

// 🎨 Random colors for text posts
const colors = ["#ff7e5f", "#6a11cb", "#ff9966", "#00c9ff", "#f7971e"];

if (!post.mediaUrl) {
    extraClass = "text-only";
    bgColor = colors[Math.floor(Math.random() * colors.length)];
    media = "";
} else {
    if (post.mediaType === "image") {
        media = `<img src="${post.mediaUrl}">`;
    } else {
        media = `
            <video controls>
                <source src="${post.mediaUrl}">
            </video>`;
    }
}

div.classList.add(extraClass);
if (bgColor) div.style.background = bgColor;

div.innerHTML = `
    <div class="post-header">
        <button class="three-dots">⋮</button>
        <div class="post-menu hidden">
            <div class="edit-post">Edit</div>
            <div class="delete-post">Delete</div>
        </div>
    </div>

    ${media}

    <div class="post-content">${post.caption || ""}</div>
`;

// if (post.file) {
//     if (post.file.includes("image")) {
//         media = `<img src="${post.file}" style="width:100%; border-radius:10px;">`;
//     } else {
//         media = `
//             <video controls style="width:100%; border-radius:10px;">
//                 <source src="${post.file}">
//             </video>`;
//     }
// }

    // if (post.file.includes("image")) {
    //     media = `<img src="${post.file}" style="width:100%; border-radius:10px;">`;
    // } else {
    //     media = `
    //         <video controls style="width:100%; border-radius:10px;">
    //             <source src="${post.file}">
    //         </video>`;
    // }

    // div.innerHTML = `
    //     ${media}
    //     <p style="margin-top:8px;">${post.caption || ""}</p>
    // `;
//     div.innerHTML = `
//     <div class="post-header">
//         <button class="three-dots">⋮</button>
//         <div class="post-menu hidden">
//             <div class="edit-post">Edit</div>
//             <div class="delete-post">Delete</div>
//         </div>
//     </div>

//     ${media}

//     <p class="post-caption">${post.caption || ""}</p>
// `;
const dotsBtn = div.querySelector(".three-dots");
const menu = div.querySelector(".post-menu");
const deleteBtn = div.querySelector(".delete-post");
const editBtn = div.querySelector(".edit-post");

// Toggle menu
dotsBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});
//delete post
// deleteBtn.addEventListener("click", () => {

//     let allPosts = JSON.parse(localStorage.getItem("posts")) || {};

//     allPosts[userId] = allPosts[userId].filter(p => p.time !== post.time);

//     // localStorage.setItem("posts", JSON.stringify(allPosts));

//     div.remove();
// });
deleteBtn.addEventListener("click", async () => {

    const postsRef = ref(database, "posts");

    const snapshot = await get(postsRef);

    if (!snapshot.exists()) return;

    const posts = snapshot.val();

    for (const key in posts) {

        const p = posts[key];

        if (
            p.time === post.time &&
            p.userId === post.userId
        ) {

            await set(
                ref(database, "posts/" + key),
                null
            );

            break;
        }
    }

    div.remove();
});
//edit post
// 
editBtn.addEventListener("click", async () => {

    const newCaption =
        prompt("Edit your caption:", post.caption);

    if (newCaption === null) return;

    const postsRef = ref(database, "posts");

    const snapshot = await get(postsRef);

    if (!snapshot.exists()) return;

    const posts = snapshot.val();

    for (const key in posts) {

        const p = posts[key];

        if (
            p.time === post.time &&
            p.userId === post.userId
        ) {

            await set(
                ref(database, "posts/" + key),
                {
                    ...p,
                    caption: newCaption
                }
            );

            break;
        }
    }

    div.querySelector(".post-content")
        .textContent = newCaption;
});

    postsContainer.prepend(div);
}
// //delete post
// deleteBtn.addEventListener("click", () => {

//     let allPosts = JSON.parse(localStorage.getItem("posts")) || {};

//     allPosts[userId] = allPosts[userId].filter(p => p.time !== post.time);

//     localStorage.setItem("posts", JSON.stringify(allPosts));

//     div.remove();
// });
// //edit post
// editBtn.addEventListener("click", () => {

//     const newCaption = prompt("Edit your caption:", post.caption);

//     if (newCaption === null) return;

//     let allPosts = JSON.parse(localStorage.getItem("posts")) || {};

//     allPosts[userId] = allPosts[userId].map(p => {
//         if (p.time === post.time) {
//             return { ...p, caption: newCaption };
//         }
//         return p;
//     });

//     localStorage.setItem("posts", JSON.stringify(allPosts));

//     div.querySelector(".post-caption").textContent = newCaption;
// });

// ===== LOAD POSTS =====
// function loadPosts() {
//     let allPosts = JSON.parse(localStorage.getItem("posts")) || {};

//     if (!allPosts[userId]) return;

//     allPosts[userId]
//         .sort((a, b) => b.time - a.time)
//         .forEach(displayPost);
// }

// ===== HANDLE POST =====
// if (postBtn) {
//     postBtn.addEventListener("click", () => {
//         const file = postFile.files[0];
//         const caption = postCaption.value.trim();

//         if (!file) {
//             alert("Please select a file");
//             return;
//         }

//         const reader = new FileReader();

//         reader.onload = function () {
//             const postData = {
//                 file: reader.result,
//                 caption: caption,
//                 time: Date.now()
//             };

//             savePost(postData);
//             displayPost(postData);

//             postFile.value = "";
//             postCaption.value = "";
//         };

//         reader.readAsDataURL(file);
//     });
// }

// ================== INIT ==================
// window.addEventListener("DOMContentLoaded", () => {
//     loadUser();
//     loadPosts();
// });