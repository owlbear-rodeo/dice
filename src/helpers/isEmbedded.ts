/** Return true if this extension is currently being used inside a frame */
export function isEmbedded() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
