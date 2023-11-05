export function autoresizeTextarea(node: any) {
    const handleInput = (e: Event) => {
        node.style.height = "0"
        node.style.height = node.scrollHeight + "px";
    };
    document.addEventListener("input", handleInput, false);
    document.addEventListener("focus", handleInput, false);
    return {
        destroy() {
            document.removeEventListener("click", handleInput, false);
            document.removeEventListener("focus", handleInput, false);
        },
    };
}

export function getScrollParent(node: HTMLElement | null) {
    if (node === null) {
        return null;
    }
    if (node.scrollHeight > node.clientHeight) {
        return node;
    } else {
        return getScrollParent(node.parentElement);
    }
}
