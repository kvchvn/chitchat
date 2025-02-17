export const getAuthErrorDescription = (code: string) => {
  switch (code) {
    case 'OAuthAccountNotLinked':
      return 'The email is already linked, but not with this OAuth provider. Try to sign in with another email or provider.';
    default:
      return 'Your sign in request is failed. Please, try to sign in via another provider or go back later, maybe there are temporary troubles.';
  }
};
