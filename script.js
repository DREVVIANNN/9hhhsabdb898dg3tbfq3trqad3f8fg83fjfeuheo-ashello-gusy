function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.content').forEach(page => page.classList.remove('active'));

    // Show selected page
    document.getElementById(pageId).classList.add('active');
}

async function copyText(textId, messageId) {
    let textArea = document.getElementById(textId);
    let message = document.getElementById(messageId);

    try {
        await navigator.clipboard.writeText(textArea.value);
        message.innerText = "Text copied!";
    } catch (err) {
        message.innerText = "Failed to copy!";
    }

    setTimeout(() => {
        message.innerText = "";
    }, 2000); // Remove message after 2 seconds
}

// Your Firebase configuration (Replace with your Firebase credentials)
const firebaseConfig = {
    apiKey: "AIzaSyDxxaYBCi3JByMiiddFPAqhVgu_Rbfj2Uw",
    authDomain: "d-website-design.firebaseapp.com",
    projectId: "d-website-design",
    storageBucket: "d-website-design.firebasestorage.app",
    messagingSenderId: "1002815935371",
    appId: "1:1002815935371:web:3d868dfa3215362bc1558e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference Firebase Authentication
// Initialize Firestore
const db = firebase.firestore();
const auth = firebase.auth();

// Function to handle Google Sign-In
document.getElementById("google-login").addEventListener("click", function () {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            saveUserToFirestore(user);
        })
        .catch((error) => {
            console.error(error.message);
        });
});

// Function to save user data to Firestore
function saveUserToFirestore(user) {
    const userRef = db.collection("users").doc(user.uid);

    userRef.get().then((doc) => {
        if (!doc.exists) {
            // Save user data only if it's a new user
            userRef.set({
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                profilePic: user.photoURL,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Update last login time
            userRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        // Display user info
        showUserInfo(user);
    });
}

// Function to show user info
function showUserInfo(user) {
    document.getElementById("user-info").innerHTML = `
        <img src="${user.photoURL}" width="50" style="border-radius:50%;">
        <p>Welcome, ${user.displayName}</p>
    `;
    document.getElementById("google-login").style.display = "none";
    document.getElementById("google-logout").style.display = "block";
}

// Function to check if a user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        showUserInfo(user);
    } else {
        document.getElementById("google-login").style.display = "block";
        document.getElementById("google-logout").style.display = "none";
        document.getElementById("user-info").innerHTML = "";
    }
});

// Logout function
document.getElementById("google-logout").addEventListener("click", function () {
    auth.signOut().then(() => {
        document.getElementById("user-info").innerHTML = "";
        document.getElementById("google-login").style.display = "block";
        document.getElementById("google-logout").style.display = "none";
    }).catch((error) => {
        console.error(error.message);
    });
});

function soon() {
    alert('Coming soon!');
}