// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import {
//     getDatabase,
//     ref,
//     get,
//     set
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// // Firebase config
// // const firebaseConfig = {
// //     apiKey: "YOUR_KEY",
// //     authDomain: "YOUR_DOMAIN",
// //     databaseURL: "YOUR_DB_URL",
// //     projectId: "YOUR_PROJECT_ID"
// // };
// const firebaseConfig = {
//     apiKey: "YOUR_ACTUAL_KEY",
//     authDomain: "skill-forge-dbffa.firebaseapp.com",
//     databaseURL: "https://skill-forge-dbffa-default-rtdb.asia-southeast1.firebasedatabase.app/",
//     projectId: "skill-forge-dbffa"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// const container = document.getElementById("opportunitiesContainer");

// async function loadOpportunities() {
//     const snapshot = await get(ref(db, "opportunities"));

//     if (!snapshot.exists()) {
//         container.innerHTML = "<p>No opportunities available</p>";
//         return;
//     }

//     const opportunities = snapshot.val();

//     container.innerHTML = "";

//     Object.entries(opportunities).forEach(([id, opp]) => {
//         const card = document.createElement("div");
//         card.className = "gig-card glass";

//         card.innerHTML = `
//             <div class="gig-header">
//                 <div class="tags-row">
//                     <span class="pill pill-blue">${opp.level}</span>
//                     <span class="pill pill-dark">${opp.category}</span>
//                 </div>
//             </div>

//             <h3>${opp.title}</h3>
//             <p class="company-name">${opp.company}</p>
//             <p class="gig-desc">${opp.description}</p>

//             <div class="gig-meta">
//                 <span><i class="fa-solid fa-dollar-sign"></i> ${opp.budget}</span>
//                 <span><i class="fa-solid fa-location-dot"></i> ${opp.location}</span>
//             </div>

//             <div class="card-actions">
//                 <button class="btn btn-primary apply-btn"
//                         data-id="${id}">
//                         Apply
//                 </button>

//                 <button class="btn btn-secondary save-btn"
//                         data-id="${id}">
//                         Save
//                 </button>
//             </div>
//         `;

//         container.appendChild(card);
//     });
// }

// loadOpportunities();
// document.addEventListener("click", async (e) => {

//     const applyBtn = e.target.closest(".apply-btn");

//     if (applyBtn) {
//         const opportunityId = applyBtn.dataset.id;

//         const email = localStorage.getItem("loggedInEmail");

//         if (!email) {
//             alert("Please login first");
//             return;
//         }

//         const userId = email.replace(/\./g, "_");

//         await set(
//             ref(db, `applications/${userId}/${opportunityId}`),
//             {
//                 status: "applied",
//                 appliedAt: Date.now()
//             }
//         );

//         alert("Applied successfully ✅");

//         applyBtn.innerText = "Applied";
//         applyBtn.disabled = true;
//     }
// });
// document.addEventListener("click", async (e) => {

//     const saveBtn = e.target.closest(".save-btn");

//     if (saveBtn) {
//         const opportunityId = saveBtn.dataset.id;

//         const email = localStorage.getItem("loggedInEmail");

//         if (!email) {
//             alert("Please login first");
//             return;
//         }

//         const userId = email.replace(/\./g, "_");

//         await set(
//             ref(db, `savedOpportunities/${userId}/${opportunityId}`),
//             {
//                 savedAt: Date.now()
//             }
//         );

//         alert("Opportunity saved ❤️");

//         saveBtn.innerText = "Saved";
//         saveBtn.disabled = true;
//     }
// });
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import {
    getDatabase,
    ref,
    get,
    set,
    push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// Firebase config
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "skill-forge-dbffa.firebaseapp.com",
    databaseURL:
        "https://skill-forge-dbffa-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "skill-forge-dbffa"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const container = document.getElementById("opportunitiesContainer");


// Dummy opportunities
const dummyOpportunities = [
    {
        title: "Wedding Dance Performance",
        company: "Elite Events Co.",
        description: "Looking for contemporary dancers for wedding performance.",
        budget: "$500-800",
        location: "Hyderabad",
        level: "Intermediate",
        category: "Dance"
    },
    {
        title: "Album Cover Design",
        company: "Indie Records",
        description: "Need visual artist for album cover artwork.",
        budget: "$1200",
        location: "Remote",
        level: "Advanced",
        category: "Visual Art"
    },
    {
        title: "Photography Internship",
        company: "Pixel Studios",
        description: "Looking for photographers for product shoots.",
        budget: "$700",
        location: "Bangalore",
        level: "Beginner",
        category: "Photography"
    }
];


// Step 1: Insert dummy data if database empty
async function seedOpportunities() {
    const snapshot = await get(ref(db, "opportunities"));

    if (!snapshot.exists()) {
        for (let opp of dummyOpportunities) {
            const newRef = push(ref(db, "opportunities"));
            await set(newRef, opp);
        }

        console.log("Dummy opportunities added to Firebase");
    }
}


// Step 2: Load opportunities from database
async function loadOpportunities() {
    const snapshot = await get(ref(db, "opportunities"));

    if (!snapshot.exists()) {
        container.innerHTML = "<p>No opportunities available</p>";
        return;
    }

    const opportunities = snapshot.val();
    container.innerHTML = "";

    Object.entries(opportunities).forEach(([id, opp]) => {
        const card = document.createElement("div");

        card.className = "gig-card glass";

        // card.innerHTML = `
        //     <div class="gig-header">
        //         <div class="tags-row">
        //             <span class="pill pill-blue">${opp.level}</span>
        //             <span class="pill pill-dark">${opp.category}</span>
        //         </div>
        //     </div>

        //     <h3>${opp.title}</h3>
        //     <p class="company-name">${opp.company}</p>
        //     <p class="gig-desc">${opp.description}</p>

        //     <div class="gig-meta">
        //         <span>${opp.budget}</span>
        //         <span>${opp.location}</span>
        //     </div>

        //     <div class="card-actions">
        //         <button class="btn btn-primary apply-btn" data-id="${id}">
        //             Apply
        //         </button>

        //         <button class="btn btn-secondary save-btn" data-id="${id}">
        //             Save
        //         </button>
        //     </div>
        // `;
        card.innerHTML = `
    <div class="gig-header">
        <div class="tags-row">
            <span class="pill pill-blue">${opp.level}</span>
            <span class="pill pill-dark">${opp.category}</span>
        </div>

        <div class="match-score">
            <i class="fa-solid fa-star"></i> 90% Match
        </div>
    </div>

    <h3>${opp.title}</h3>
    <p class="company-name">${opp.company}</p>
    <p class="gig-desc">${opp.description}</p>

    <div class="gig-meta">
        <span><i class="fa-solid fa-dollar-sign"></i> ${opp.budget}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${opp.location}</span>
    </div>

    <div class="skill-tags">
        ${
            opp.skills
            ? opp.skills.map(skill => `<span>${skill}</span>`).join("")
            : ""
        }
    </div>

    <div class="card-actions">
        <button class="btn btn-primary apply-btn" data-id="${id}">
            Apply
        </button>

        <button class="btn btn-secondary save-btn" data-id="${id}">
            Save
        </button>
    </div>
`;

        container.appendChild(card);
    });
}


// Apply button
document.addEventListener("click", async (e) => {
    const applyBtn = e.target.closest(".apply-btn");

    if (applyBtn) {
        const opportunityId = applyBtn.dataset.id;

        const email = localStorage.getItem("loggedInEmail");

        if (!email) {
            alert("Login first");
            return;
        }

        const userId = email.replace(/\./g, "_");

        await set(
            ref(db, `applications/${userId}/${opportunityId}`),
            {
                status: "applied",
                appliedAt: Date.now()
            }
        );

        applyBtn.innerText = "Applied";
        applyBtn.disabled = true;

        alert("Applied successfully ✅");
    }
});
const modal = document.getElementById("opportunityModal");
const openBtn = document.getElementById("openOpportunityModal");
const closeBtn = document.getElementById("closeOpportunityModal");

openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});


// Save button
document.addEventListener("click", async (e) => {
    const saveBtn = e.target.closest(".save-btn");

    if (saveBtn) {
        const opportunityId = saveBtn.dataset.id;

        const email = localStorage.getItem("loggedInEmail");

        if (!email) {
            alert("Login first");
            return;
        }

        const userId = email.replace(/\./g, "_");

        await set(
            ref(db, `savedOpportunities/${userId}/${opportunityId}`),
            {
                savedAt: Date.now()
            }
        );

        saveBtn.innerText = "Saved";
        saveBtn.disabled = true;

        alert("Saved successfully ❤️");
    }
});
document
.getElementById("saveOpportunityBtn")
.addEventListener("click", async () => {

    const title = document.getElementById("oppTitle").value;
    const company = document.getElementById("oppCompany").value;
    const description = document.getElementById("oppDescription").value;
    const budget = document.getElementById("oppBudget").value;
    const location = document.getElementById("oppLocation").value;
    const level = document.getElementById("oppLevel").value;
    const category = document.getElementById("oppCategory").value;
    const skills = document
        .getElementById("oppSkills")
        .value
        .split(",");

    if (!title || !company) {
        alert("Please fill required fields");
        return;
    }

    const newOppRef = push(ref(db, "opportunities"));

    await set(newOppRef, {
        title,
        company,
        description,
        budget,
        location,
        level,
        category,
        skills
    });

    alert("Opportunity added successfully ✅");

    modal.classList.add("hidden");

    loadOpportunities(); // refresh cards
});


// Run everything
async function init() {
    await seedOpportunities();
    await loadOpportunities();
}

init();