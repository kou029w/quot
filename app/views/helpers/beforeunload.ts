function beforeunload() {
  function listener(e: BeforeUnloadEvent) {
    e.preventDefault();
    e.returnValue = "";
  }

  function block() {
    window.addEventListener("beforeunload", listener);
  }

  function unblock() {
    window.removeEventListener("beforeunload", listener);
  }

  return { block, unblock };
}

export default beforeunload;
