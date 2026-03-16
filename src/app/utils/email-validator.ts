export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    'mailinator.com',
    'yopmail.com',
    'guerrillamail.com',
    'temp-mail.org',
    '10minutemail.com',
    'dispostable.com',
    'getairmail.com',
    'sharklasers.com',
    'fakeinbox.com',
    'throwawaymail.com'
  ];
  const domain = email.split('@')[1];
  return disposableDomains.includes(domain.toLowerCase());
}
