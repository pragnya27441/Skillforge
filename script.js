
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getDatabase, ref, onValue, set, get, update }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyDYubGMOax6iwAr1l9-mKJmTqZVtpG2hjo",
  authDomain: "skill-forge-dbffa.firebaseapp.com",
  databaseURL: "https://skill-forge-dbffa-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "skill-forge-dbffa"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();

    


const notifBtn = document.getElementById("notifBtn");
const notifOverlay = document.getElementById("notifOverlay");
const closeBtn = document.getElementById("closeNotifModal");

notifBtn?.addEventListener("click", () => {
    notifOverlay.classList.remove("hidden");
});

closeBtn?.addEventListener("click", () => {
    notifOverlay.classList.add("hidden");
});

notifOverlay?.addEventListener("click", (e) => {
    if (e.target === notifOverlay) {
        notifOverlay.classList.add("hidden");
    }
});
    const uploadBtn = document.getElementById('uploadBtn');
if (uploadBtn) {
    uploadBtn.addEventListener('click', openPortfolioModal);
}
});
const emailCheck = localStorage.getItem("loggedInEmail");

if (!emailCheck) {
    window.location.href = "login.html";
}
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById("logoutBtn");

        if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
        // Clear session
        localStorage.removeItem("loggedInEmail");
        localStorage.removeItem("portfolio");

        // Redirect
        window.location.href = "login.html";
        });
}
});
function loadNotifications() {
    const email = localStorage.getItem("loggedInEmail");
    if (!email) return;

    const userId = email.replace(/\./g, "_");

    const notifRef = ref(db, `notifications/${userId}`);

    const notifList = document.getElementById("notifList");
    const notifCount = document.getElementById("notifCount");

    if (!notifList || !notifCount) return;

    onValue(notifRef, (snapshot) => {
        const data = snapshot.val();
    
        notifList.innerHTML = "";

if (!data) {
    notifCount.innerText = "0";

    notifList.innerHTML = `
        <div id="emptyNotif" class="empty-notif">
            <p>${getMotivationalQuote()}</p>
        </div>
    `;

    return;
}

        
        const notifications = Object.entries(data)
    .map(([id, notif]) => ({ id, ...notif }))
    .sort((a, b) => b.createdAt - a.createdAt);

        const unreadCount = notifications.filter(n => n.status !== "accepted" && n.status !== "rejected").length;
notifCount.innerText = unreadCount;

notifications.forEach(notif => {

    const li = document.createElement("li");
    li.classList.add("notif-item");

    const isPending = notif.type === "connection" && notif.status === "pending";

    li.innerHTML = `
        <div class="notif-icon">
            <i class="fa-solid fa-user-plus"></i>
        </div>

        <div class="notif-content">
            <p class="notif-title">Connection Request</p>

            <p class="notif-msg">
                ${notif.from} ${notif.message}
            </p>

            <span class="notif-time">
                ${new Date(notif.createdAt).toLocaleString()}
            </span>

            ${isPending ? `
                <div class="notif-actions">
                    <button class="accept-btn"
                        data-from="${notif.from}"
                        data-id="${notif.id}">
                        Accept
                    </button>

                    <button class="reject-btn"
                        data-from="${notif.from}"
                        data-id="${notif.id}">
                        Reject
                    </button>
                </div>
            ` : `
                <span class="status-label">
                    ${notif.status || "done"}
                </span>
            `}
        </div>
    `;

    notifList.appendChild(li);
});
    });
}
document.addEventListener("click", async (e) => {

    const acceptBtn = e.target.closest(".accept-btn");
    const rejectBtn = e.target.closest(".reject-btn");

    const email = localStorage.getItem("loggedInEmail");
    if (!email) return;

    const currentUserId = email.replace(/\./g, "_");

   

if (acceptBtn) {
    const senderId = acceptBtn.dataset.from;
    const notifId = acceptBtn.dataset.id;

    const requestRef = ref(db, `connectionRequests/${currentUserId}/${senderId}`);
    const snapshot = await get(requestRef);

    // 🚫 prevent double action
    if (snapshot.exists() && snapshot.val().status !== "pending") {
        showToast("Already handled ⚠️");
        return;
    }

    
await update(
    ref(db, `connectionRequests/${currentUserId}/${senderId}`),
    {
        status: "accepted"
    }
);

await update(
    ref(db, `notifications/${currentUserId}/${notifId}`),
    {
        status: "accepted"
    }
);

await set(ref(db, `notifications/${senderId}/${Date.now()}`), {
    type: "info",
    status: "accepted",
    message: "accepted your connection request",
    createdAt: Date.now()
});
    acceptBtn.innerText = "Accepted";
    acceptBtn.disabled = true;
    acceptBtn.closest(".notif-actions")?.querySelector(".reject-btn")?.remove();

    showToast("Request accepted ✅");
}

   


    if (rejectBtn) {
    const senderId = rejectBtn.dataset.from;
    const notifId = rejectBtn.dataset.id;

    const requestRef = ref(db, `connectionRequests/${currentUserId}/${senderId}`);
    const snapshot = await get(requestRef);

    if (snapshot.exists() && snapshot.val().status !== "pending") {
        showToast("Already handled ⚠️");
        return;
    }

    await set(ref(db, `connectionRequests/${currentUserId}/${senderId}/status`), "rejected");

    await set(ref(db, `notifications/${currentUserId}/${notifId}/status`), "rejected");

    await set(ref(db, `notifications/${senderId}/${Date.now()}`), {
        type: "info",
        message: "rejected your connection request",
        createdAt: Date.now()
    });

    rejectBtn.innerText = "Rejected";
    rejectBtn.disabled = true;
    rejectBtn.closest(".notif-actions")?.querySelector(".accept-btn")?.remove();

    showToast("Request rejected ❌");
}
});
    const toggle = el => el.classList.toggle('hidden');
    const hide = el => el.classList.add('hidden');

    const showToast = (msg) => {
        const appliedToast = document.getElementById('appliedToast');
        if (!appliedToast) return;
        appliedToast.querySelector('span').textContent = msg;
        appliedToast.classList.add('show');
        setTimeout(() => appliedToast.classList.remove('show'), 3000);
    };
    // --- Navigation / Views ---
const navLinks = document.querySelectorAll('.nav-links a');
const logoLink = document.querySelector('.logo');
const homeLinks = document.querySelectorAll('.home-link'); // Home buttons
const views = document.querySelectorAll('.view-section');

// --- Function to switch views ---
function switchView(targetId) {
    views.forEach(v => {
        v.classList.add('hidden');
        v.classList.remove('active');
    });
//     // --- Notifications Only ---
//     const notifBtn = document.getElementById('notifBtn');

//     notifBtn?.addEventListener('click', e => {
//     e.stopPropagation();
//     toggle(notifDropdown);
//     });

// document.addEventListener('click', e => {
//     if (
//         notifBtn &&
//         notifDropdown &&
//         !notifBtn.contains(e.target) &&
//         !notifDropdown.contains(e.target)
//     ) {
//         hide(notifDropdown);
//     }
// });

    const view = document.getElementById(targetId);
    if (view) {
        view.classList.remove('hidden');
        view.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- Notifications Only ---
// const notifBtn = document.getElementById('notifBtn');

// notifBtn?.addEventListener('click', e => {
//     e.stopPropagation();
//     toggle(notifDropdown);
// });

// document.addEventListener('click', e => {
//     if (
//         notifBtn &&
//         notifDropdown &&
//         !notifBtn.contains(e.target) &&
//         !notifDropdown.contains(e.target)
//     ) {
//         hide(notifDropdown);
//     }
// });
// const notifBtn = document.getElementById("notifBtn");
// const notifModal = document.getElementById("notifModal");
// const closeNotifModal = document.getElementById("closeNotifModal");

// notifBtn?.addEventListener("click", () => {
//     notifModal.classList.remove("hidden");
// });

// closeNotifModal?.addEventListener("click", () => {
//     notifModal.classList.add("hidden");
// });

// // click outside modal to close
// notifModal?.addEventListener("click", (e) => {
//     if (e.target === notifModal) {
//         notifModal.classList.add("hidden");
//     }
// });

// --- Handle nav clicks ---
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');

        // Only handle same-page hash links
        if (href.startsWith('#')) {
            e.preventDefault(); // only prevent default for internal views
            let viewName;
            if (href === '#' || href === '#landing') {
                viewName = 'landing-view';
            } else {
                viewName = href.substring(1) + '-view';
            }
            switchView(viewName);
            history.pushState(null, '', href);
        }
        // external links (like index.html#discover) will work normally
    });
});
const categoryCards = document.querySelectorAll('.category-card');
const creatorsContainer = document.getElementById('creatorsContainer');

// Add click event to each category card
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        displayCreatorsByCategory(category);
    });
});

// Function to fetch and display creators by category
// function displayCreatorsByCategory(category) {
//     creatorsContainer.innerHTML = `<p>Loading ${category} creators...</p>`; // optional loader
//     const usersRef = ref(db, 'users'); // Make sure your users node contains portfolios
//     onValue(usersRef, snapshot => {
//         const data = snapshot.val();
//         creatorsContainer.innerHTML = ''; // clear previous results
//         if (data) {
//             // const filteredUsers = Object.values(data)
//             //                          .map(([id, u]) => ({ id, ...u.portfolio }))
//             //                         .filter(p => p && p.niche === category);
//             const filteredUsers = Object.entries(data)
//                                 .map(([id, u]) => ({ id, ...u, ...u.portfolio }))
//                                 .filter(user => user.niche === category);
//             if (filteredUsers.length === 0) {
//                 creatorsContainer.innerHTML = `<p>No creators found in ${category}</p>`;
//                 return;
//             }
//             filteredUsers.forEach(user => {
//                 const card = document.createElement('div');
//                 card.className = 'creator-card glass';
//                 card.innerHTML = `
//                     <img src="${user.profilePic || 'default-avatar.png'}" alt="${user.name}" class="creator-img"/>
//                     <h3>${user.name || user.portfolio?.name || 'Anonymous'}</h3>
//                     <p>${Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || 'No skills listed')}</p>
//                     <p>${user.bio || ''}</p>
//                 `;
//                 card.addEventListener('click', () => {
//                         window.location.href = `profile.html?id=${user.id}`;
//                         });
//                 creatorsContainer.appendChild(card);
//             });
//         } else {
//             creatorsContainer.innerHTML = `<p>No creators found in ${category}</p>`;
//         }
//     }, { onlyOnce: true });
// }
function displayCreatorsByCategory(category) {
    creatorsContainer.innerHTML = `<p>Loading ${category} creators...</p>`;

    const usersRef = ref(db, 'users');

    onValue(usersRef, snapshot => {
        const data = snapshot.val();
        creatorsContainer.innerHTML = '';

        if (data) {
            const filteredUsers = Object.entries(data)
                .map(([id, u]) => ({
                    id,
                    name: u.name,
                    ...u.portfolio
                }))
                // .filter(user => user.niche === category);
            //     .filter(user =>
            //     user.niche &&
            //     user.niche.toLowerCase().trim() === category.toLowerCase().trim()
            // );  
            .filter(user => {
            const normalize = str =>
            str.toLowerCase().replace(/\s+/g, '');

            return normalize(user.niche || '') === normalize(category);
            });

            if (filteredUsers.length === 0) {
                creatorsContainer.innerHTML = `<p>No creators found in ${category}</p>`;
                return;
            }

            filteredUsers.forEach(user => {
                const card = document.createElement('div');
                card.className = 'creator-card glass';

                card.innerHTML = `
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random" class="creator-img"/>
                    <h3>${user.name}</h3>
                    <p>${Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || 'No skills listed')}</p>
                    <p>${user.bio || ''}</p>
                `;

                // 🔥 Click → open profile
                card.addEventListener('click', () => {
                    window.location.href = `profile.html?id=${user.id}`;
                });

                creatorsContainer.appendChild(card);
            });

        } else {
            creatorsContainer.innerHTML = `<p>No creators found</p>`;
        }

    }, { onlyOnce: true });
}

// --- Handle logo click (go to home) ---
if (logoLink) {
    logoLink.addEventListener('click', e => {
        e.preventDefault();
        switchView('landing-view');
        history.pushState(null, '', 'index.html'); // optional: reset URL
    });
}

// --- Handle home-link buttons ---
homeLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        switchView('landing-view');
        history.pushState(null, '', 'index.html');
    });
});

// --- Show correct view on page load based on hash ---
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;

    if (hash) {
        if (hash === '#edit' && typeof openPortfolioModal === 'function') {
            openPortfolioModal(); // open portfolio modal if hash is #edit
        } else {
            const viewId = (hash === '#' || hash === '#landing') ? 'landing-view' : hash.substring(1) + '-view';
            switchView(viewId);
        }
    } else {
        switchView('landing-view'); // default landing view
    }
});

    // Handle page load hash
    const openHash = window.location.hash;
    if (openHash) {
        if (openHash === '#edit') openPortfolioModal();
        else switchView(openHash === '#' ? 'landing-view' : openHash.substring(1)+'-view');
    }

    // --- Modals ---
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeModalBtn = document.getElementById('closeModal');

    function prefillPortfolio(data) {
    ['name','niche','bio','skills','tools','project','milestone'].forEach(id => {
        if (id === 'skills') {
            document.getElementById(`p-${id}`).value = Array.isArray(data[id]) ? data[id].join(', ') : data[id] || '';
        } else {
            document.getElementById(`p-${id}`).value = data[id] || '';
        }
    });
    renderPortfolioPreview();
    goToStep(4);
}
    // Get logged-in email from localStorage
const loggedInEmail = localStorage.getItem('loggedInEmail');
const userId = loggedInEmail ? loggedInEmail.replace(/\./g, "_") : null;
function openPortfolioModal() {
    if (!uploadModal) return;
    if (!userId) {
        alert("You must be logged in to view your portfolio!");
        return;
    }

    uploadModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Fetch portfolio from Firebase
    get(ref(db, 'users/' + userId + '/portfolio'))
    .then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            localStorage.setItem('portfolio', JSON.stringify(data));
            prefillPortfolio(data);
        } else {
            // No portfolio saved yet
            ['name','niche','bio','skills','tools','project','milestone'].forEach(id => {
                document.getElementById(`p-${id}`).value = '';
            });
            goToStep(1);
        }
    })
    .catch(err => {
        console.error("Error fetching portfolio:", err);
        alert("Error fetching portfolio data.");
    });
}

function closePortfolioModal() {
    if (!uploadModal) return;
    uploadModal.classList.add('hidden');
    document.body.style.overflow = '';
}



if (uploadBtn) uploadBtn.addEventListener('click', openPortfolioModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closePortfolioModal);
uploadModal?.addEventListener('click', e => { if(e.target===uploadModal) closePortfolioModal(); });

    // --- Portfolio Steps ---
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const portfolioSteps = document.querySelectorAll('.portfolio-step');
    const stepperSteps = document.querySelectorAll('.portfolio-stepper .step');
    const previewContainer = document.getElementById('portfolio-preview-container');

    function goToStep(stepNum) {
        portfolioSteps.forEach(s => s.classList.add('hidden'));
        document.getElementById(`p-step-${stepNum}`).classList.remove('hidden');
        stepperSteps.forEach(s => {
            s.classList.toggle('active', parseInt(s.getAttribute('data-step')) <= stepNum);
        });
    }

    nextBtns.forEach(btn => btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-next');
        if (next === '4') renderPortfolioPreview();
        goToStep(next);
    }));

    prevBtns.forEach(btn => btn.addEventListener('click', () => {
        const prev = btn.getAttribute('data-prev');
        goToStep(prev);
    }));

    function renderPortfolioPreview() {
        const data = {
            name: document.getElementById('p-name').value || 'Creative Soul',
            niche: document.getElementById('p-niche').value || 'Contemporary Artist',
            bio: document.getElementById('p-bio').value || 'No bio provided yet.',
            skills: document.getElementById('p-skills').value.split(',').map(s=>s.trim()).filter(s=>s),
            tools: document.getElementById('p-tools').value,
            project: document.getElementById('p-project').value || 'Passion Project',
            milestone: document.getElementById('p-milestone').value || 'First Masterpiece'
        };

        previewContainer.innerHTML = `
            <div class="resume-preview-card glass">
                <div class="resume-header">
                    <div class="resume-identity">
                        <h2>${data.name}</h2>
                        <span class="niche">${data.niche}</span>
                    </div>
                    <div class="resume-badge">
                        <i class="fa-solid fa-medal" style="font-size: 2rem; color: #D9A066;"></i>
                    </div>
                </div>
                <div class="resume-section"><h4>The Journey</h4><p>${data.bio}</p></div>
                <div class="resume-grid">
                    <div class="resume-section"><h4>Techniques</h4>
                        <div class="resume-pills">${data.skills.length>0?data.skills.map(s=>`<span class="resume-pill">${s}</span>`).join(''):'<span class="resume-pill">Versatile</span>'}</div>
                    </div>
                    <div class="resume-section"><h4>Arsenal</h4><p>${data.tools || "Creative Instinct"}</p></div>
                </div>
                <div class="resume-section"><h4>Top Highlight</h4>
                    <div class="resume-highlight-box"><strong>${data.project}</strong><span>${data.milestone}</span></div>
                </div>
            </div>
        `;
    }
    function getMotivationalQuote() {
    const quotes = [
        "Great things take time. Keep building.",
        "Every expert was once a beginner.",
        "Your consistency will beat talent.",
        "Keep going — your future self will thank you.",
        "Small progress every day adds up to big results.",
        "Don’t stop until you’re proud."
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
}

// --- Finalize Portfolio Button ---
document.getElementById('finalize-portfolio')?.addEventListener('click', () => {
    // const username = document.getElementById("p-name").value;

// Save current user
// localStorage.setItem("currentUser", username);
    // 1️⃣ Collect portfolio data from form
    const data = {
        name: document.getElementById('p-name').value || 'Creative Soul',
        niche: document.getElementById('p-niche').value || 'Contemporary Artist',
        bio: document.getElementById('p-bio').value || 'No bio provided yet.',
        skills: document.getElementById('p-skills').value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0), // convert string to array
        tools: document.getElementById('p-tools').value || 'Creative Instinct',
        project: document.getElementById('p-project').value || 'Passion Project',
        milestone: document.getElementById('p-milestone').value || 'First Masterpiece'
    };


    // 2️⃣ Save portfolio locally (optional)
    localStorage.setItem("portfolio", JSON.stringify(data));

    // 3️⃣ Get logged-in user email from login
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail) {
        alert("You must be logged in to save portfolio!");
        return;
    }

    const userId = loggedInEmail.replace(/\./g, "_"); // Firebase-safe ID
    localStorage.setItem("currentUser", userId);
    // 4️⃣ Save portfolio under the logged-in user in Firebase
    set(ref(db, 'users/' + userId + '/portfolio'), data)
        .then(() => {
            showToast("Portfolio Updated Successfully! ❤️");
            closePortfolioModal();
            goToStep(1); // reset to step 1
        })
        .catch(err => {
            console.error("Error saving portfolio:", err);
            alert("Error saving portfolio: " + err);
        });
//         document.addEventListener("DOMContentLoaded", () => {
//     loadNotifications();
// });
});
// loadNotifications();
    // // --- Dropdowns ---
    // const searchBtn = document.getElementById('searchBtn');
    // const notifBtn = document.getElementById('notifBtn');
    // const searchDropdown = document.getElementById('searchDropdown');

    // searchBtn?.addEventListener('click', e => { e.stopPropagation(); toggle(searchDropdown); hide(notifDropdown); });
    // notifBtn?.addEventListener('click', e => { e.stopPropagation(); toggle(notifDropdown); hide(searchDropdown); });
    // document.addEventListener('click', e => {
    //     if(!searchBtn.contains(e.target)&&!searchDropdown.contains(e.target)) hide(searchDropdown);
    //     if(!notifBtn.contains(e.target)&&!notifDropdown.contains(e.target)) hide(notifDropdown);
    // });

    // // --- Search Logic ---
    // const searchInput = document.getElementById('searchInput');
    // const searchResults = document.getElementById('searchResults');
    // const performSearchBtn = document.getElementById('performSearchBtn');
    // const searchData = [
    //     { category: "Visual Art", items: ["Digital Painting","Surrealism","Abstract Art","3D Rendering","Concept Art","Oil Painting","Character Design"] },
    //     { category: "Music", items: ["Neural Symphony","Acoustic Jam","Electronic Beats","Vocal Performance","Synthesizer Soundscapes","LO-FI Beats"] },
    //     { category: "Dance", items: ["Contemporary Dance","Street Style","Ballet Fusion","Choreography","Holographic Hip-Hop","Neural Movement"] },
    //     { category: "Photography", items: ["Portrait Photography","Landscape Photography","Street Photography","Golden Hour","Wildlife","Macro Photography"] }
    // ];

    // const handleSearchAction = () => {
    //     const query = searchInput.value.toLowerCase().trim();
    //     if(!query) return;
    //     const usersRef = ref(db,'users');
    //     onValue(usersRef, snapshot => {
    //         const data = snapshot.val();
    //         const results = [];
    //         if(data) Object.values(data).forEach(user => { if(user.niche?.toLowerCase().includes(query)) results.push(user.name); });
    //         searchResults.innerHTML = results.length>0 ? results.map(n=>`<div class="search-result-item">${n}</div>`).join('') : '<div class="search-result-item">No results found</div>';
    //         searchResults.classList.remove('hidden');
    //     }, { onlyOnce:true });
    // };

    // searchInput?.addEventListener('keydown', e=>{ if(e.key==='Enter') handleSearchAction(); });
    // performSearchBtn?.addEventListener('click', handleSearchAction);

    // --- Video Feed, Events, Buttons, and all other interactions ---
    // (Keep your previous videoFeed and event logic as it is, because it’s mostly correct)
