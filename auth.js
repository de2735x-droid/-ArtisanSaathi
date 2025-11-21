// Authentication functions
async function authSignUp(userData) {
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(
            userData.email, 
            userData.password
        );
        
        // Update user profile
        await userCredential.user.updateProfile({
            displayName: userData.name
        });
        
        // Save additional user data to Firestore
        await db.collection('artisans').doc(userCredential.user.uid).set({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            craftType: userData.craftType,
            region: userData.region,
            experience: userData.experience,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

async function authSignIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

async function authSignOut() {
    try {
        await auth.signOut();
        showNotification('Successfully logged out', 'success');
    } catch (error) {
        showNotification('Error signing out: ' + error.message, 'error');
    }
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await authSignIn(email, password);
        document.getElementById('loginModal').style.display = 'none';
        showNotification('Successfully logged in!', 'success');
    } catch (error) {
        showNotification('Login error: ' + error.message, 'error');
    }
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        craftType: document.getElementById('craftType').value,
        region: document.getElementById('region').value,
        experience: parseInt(document.getElementById('experience').value),
        password: document.getElementById('signupPassword').value
    };
    
    try {
        await authSignUp(userData);
        document.getElementById('signupModal').style.display = 'none';
        showNotification('Account created successfully!', 'success');
    } catch (error) {
        showNotification('Signup error: ' + error.message, 'error');
    }
});