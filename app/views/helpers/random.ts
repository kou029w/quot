function random(): number {
  return 0x7f_ff_ff_ff & window.crypto.getRandomValues(new Uint32Array(1))[0]!;
}

export default random;
