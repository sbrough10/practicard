export const SESSION_ID_LENGTH = 64;

const POSSIBLE_SESSION_ID_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateSessionId = () => {
  const myCharArray = new Uint8Array(SESSION_ID_LENGTH);

  for (let i = 0; i < SESSION_ID_LENGTH; i++) {
    myCharArray[i] = POSSIBLE_SESSION_ID_CHARS.charCodeAt(
      Math.floor(Math.random() * POSSIBLE_SESSION_ID_CHARS.length)
    );
  }

  return String.fromCharCode(...myCharArray);
};
