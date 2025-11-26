// Database functions
async function saveProductToFirebase(productData) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    try {
        let imageUrl = '';
        
        // Upload image if provided
        if (productData.imageFile) {
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`products/${user.uid}/${Date.now()}_${productData.imageFile.name}`);
            await imageRef.put(productData.imageFile);
            imageUrl = await imageRef.getDownloadURL();
        }
        
        // Save product data to Firestore
        const productRef = await db.collection('products').add({
            artisanId: user.uid,
            name: productData.name,
            description: productData.description,
            category: productData.category,
            price: productData.price,
            platforms: productData.platforms,
            imageUrl: imageUrl,
            status: 'pending', // pending, approved, rejected
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return productRef.id;
    } catch (error) {
        throw error;
    }
}

async function getUserProductsFromFirebase() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const snapshot = await db.collection('products')
            .where('artisanId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
}

async function getUserProfileFromFirebase() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const doc = await db.collection('artisans').doc(user.uid).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        throw error;
    }

}
