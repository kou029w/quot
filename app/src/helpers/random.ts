function random(): number {
  return window.crypto.getRandomValues(new Uint16Array(1))[0]!;
}

export default random;
