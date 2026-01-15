import { db } from './firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';

export const addXp = async (userId, xp) => {
    if (!userId) {
        console.error("User ID is required to add XP.");
        return;
    }

    const userRef = doc(db, 'users', userId);

    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const currentXp = userData.xp || 0;
            const currentLevel = userData.level || 1;

            const newXp = currentXp + xp;
            const xpToNextLevel = currentLevel * 1.25 * 10;

            if (newXp >= xpToNextLevel) {
                await updateDoc(userRef, {
                    xp: 0,
                    level: increment(currentLevel)
                });
                console.log(`User ${userId} leveled up to level ${currentLevel + 1}`);
            } else {
                await updateDoc(userRef, {
                    xp: increment(xp)
                });
                console.log(`Successfully added ${xp} XP to user ${userId}`);
            }
        } else {
            console.error("User document not found.");
        }
    } catch (error) {
        console.error("Error adding XP:", error);
    }
};
