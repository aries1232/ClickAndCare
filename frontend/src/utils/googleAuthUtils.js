export const decodeGoogleJwt = (credential) => {
  const payload = credential.split('.')[1];
  const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  return {
    googleId: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    imageUrl: decoded.picture,
  };
};
