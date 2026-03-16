export function getFriendlyErrorMessage(err: any): string {
    const errorCode = err.code || '';
    const errorMessage = err.message || '';

    switch (errorCode) {
        case 'auth/invalid-email':
            return 'The email address provided is invalid. Please check for typos.';
        case 'auth/user-disabled':
            return 'This account has been suspended. Please contact our support team.';
        case 'auth/user-not-found':
            return 'We could not find an account registered with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect email or password.';
        case 'auth/invalid-credential':
            return 'Incorrect email or password.';
        case 'auth/email-already-in-use':
            return 'User is already registered.';
        case 'auth/weak-password':
            return 'Your password is too weak. Please choose a stronger password.';
        case 'auth/too-many-requests':
            return 'To protect your account, we have temporarily locked it due to too many failed login attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'A network error occurred. Please check your internet connection and try again.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is currently not enabled. Please try another method.';
    }

    // Fallback parsing if err.code is missing but the code is in the message string
    if (errorMessage.includes('auth/invalid-email')) return 'The email address provided is invalid. Please check for typos.';
    if (errorMessage.includes('auth/user-disabled')) return 'This account has been suspended.';
    if (errorMessage.includes('auth/user-not-found')) return 'We could not find an account registered with this email address.';
    if (errorMessage.includes('auth/wrong-password') || errorMessage.includes('auth/invalid-credential')) return 'Incorrect email or password.';
    if (errorMessage.includes('auth/email-already-in-use')) return 'User is already registered.';
    if (errorMessage.includes('auth/too-many-requests')) return 'To protect your account, we have temporarily locked it due to too many failed login attempts. Please try again later.';

    // If it's our custom internal error from auth.service
    if (errorMessage === 'UNVERIFIED_EMAIL') return 'Your email is not verified yet.';
    if (errorMessage.includes('Disposable email')) return errorMessage; // Custom error we already format well
    if (errorMessage.includes('Invalid email format')) return errorMessage;

    // Default fallback
    return 'An unexpected error occurred. Please try again.';
}
