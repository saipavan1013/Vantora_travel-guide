import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User, sendEmailVerification } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { validateEmail, isDisposableEmail } from '../utils/email-validator';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$: Observable<User | null>;

    constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
        this.user$ = authState(this.auth);
    }

    async signUp(email: string, password: string, name: string) {
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (isDisposableEmail(email)) {
            throw new Error('Disposable email addresses are not allowed. Please use a professional email.');
        }

        const credential = await createUserWithEmailAndPassword(this.auth, email, password);
        await updateProfile(credential.user, { displayName: name });

        // Send verification email
        await sendEmailVerification(credential.user);

        // Create user document in Firestore
        const userDoc = doc(this.firestore, `users/${credential.user.uid}`);
        await setDoc(userDoc, {
            uid: credential.user.uid,
            name: name,
            email: email,
            emailVerified: false,
            createdAt: new Date().toISOString()
        });

        // Sign out immediately so they have to verify before logging in
        await signOut(this.auth);
        return credential;
    }

    async login(email: string, password: string) {
        const credential = await signInWithEmailAndPassword(this.auth, email, password);
        
        if (!credential.user.emailVerified) {
            // Immediately sign out to prevent the navbar from showing "logged in" state
            await signOut(this.auth);
            throw new Error('UNVERIFIED_EMAIL');
        }

        this.router.navigate(['/']);
        return credential;
    }

    async resendVerificationEmail() {
        const user = this.auth.currentUser;
        if (user) {
            await sendEmailVerification(user);
        } else {
            throw new Error('No active session. Please try logging in again to verify.');
        }
    }

    async resendVerificationByEmail(email: string, password: string) {
        const credential = await signInWithEmailAndPassword(this.auth, email, password);
        await sendEmailVerification(credential.user);
        await signOut(this.auth);
    }

    async updateUserName(newName: string) {
        const user = this.auth.currentUser;
        if (user) {
            await updateProfile(user, { displayName: newName });
            // Update Firestore too
            const userDoc = doc(this.firestore, `users/${user.uid}`);
            await setDoc(userDoc, { name: newName }, { merge: true });
        } else {
            throw new Error('No user is currently logged in.');
        }
    }

    async logout() {
        await signOut(this.auth);
        this.router.navigate(['/']);
    }

    isLoggedIn(): Observable<boolean> {
        return this.user$.pipe(map(user => !!user));
    }
}
