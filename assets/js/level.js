// Remove imports and use Firebase Compat
const firebaseConfig = {
    apiKey: "AIzaSyDmbQ5sgDW5az4gVWFdqkq7PD-rW41W8LU",
    authDomain: "guessthegraph.firebaseapp.com",
    projectId: "guessthegraph",
    storageBucket: "guessthegraph.firebasestorage.app",
    messagingSenderId: "564967841167",
    appId: "1:564967841167:web:c5a7a63d8d8cdebce9bffa",
    measurementId: "G-VB3GG43XG7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const levels = {
    level1: { equation: 'x^2 + 2*x + 1' },
    level2: { equation: 'x^3 - 3*x^2 + 2' },
    level3: { equation: 'sin(x)' },
    level4: { equation: 'cos(x)' },
    level5: { equation: 'tan(x)' },
    level6: { equation: 'log(x)' },
    level7: { equation: 'e^x' },
    level8: { equation: 'sqrt(x)' },
    level9: { equation: 'x^4 - 4*x^3 + 6*x^2 - 4*x + 1' },
    level10: { equation: '1/(1 + e^-x)' }
};

let currentLevel = levels.level1;
let currentUser = null;
let userGameData = null;

// Listen for auth state changes
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await loadUserGameData();
    } else {
        window.location.href = 'index.html';
    }
});

async function loadUserGameData() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection("users").doc(currentUser.uid).get();
        if (userDoc.exists) {
            userGameData = userDoc.data();
        } else {
            // Initialize new user data with all levels structure
            const initialLevels = {};
            Object.keys(levels).forEach(level => {
                initialLevels[level] = level === 'level1';
            });

            userGameData = {
                highestLevel: 0,
                totalScore: 0,
                levels: initialLevels
            };

            await db.collection("users").doc(currentUser.uid).set(userGameData);
        }
        
        // Log initial state
        console.log('Initial user data:', userGameData);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function updateUserProgress(levelCompleted) {
    if (!currentUser || !userGameData) return;

    try {
        // Get level number as integer
        const currentLevelNum = parseInt(levelCompleted.replace('level', ''));
        
        // Update score and highest level
        userGameData.totalScore += 10;
        userGameData.highestLevel = Math.max(currentLevelNum, userGameData.highestLevel || 0);

        // Update levels completion status
        userGameData.levels = {
            ...userGameData.levels,
            [levelCompleted]: true
        };

        // Unlock next level if exists
        if (currentLevelNum < 10) {
            const nextLevel = `level${currentLevelNum + 1}`;
            userGameData.levels[nextLevel] = true;
        }

        // Create clean update object
        const updates = {
            totalScore: userGameData.totalScore,
            highestLevel: userGameData.highestLevel,
            [`levels.${levelCompleted}`]: true
        };

        // Add next level unlock to updates if needed
        if (currentLevelNum < 10) {
            updates[`levels.level${currentLevelNum + 1}`] = true;
        }

        // Update Firestore with proper field paths
        await db.collection("users").doc(currentUser.uid).update(updates);
        
        console.log('Progress updated:', {
            level: levelCompleted,
            nextLevel: currentLevelNum < 10 ? `level${currentLevelNum + 1}` : null,
            highestLevel: userGameData.highestLevel,
            totalScore: userGameData.totalScore
        });
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

function setLevel(level) {
    currentLevel = levels[level];
}

function getLevelEquation() {
    return currentLevel.equation;
}

// Export necessary functions
window.setLevel = setLevel;
window.getLevelEquation = getLevelEquation;
window.updateUserProgress = updateUserProgress;