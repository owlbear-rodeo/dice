export function isEmbeded() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
