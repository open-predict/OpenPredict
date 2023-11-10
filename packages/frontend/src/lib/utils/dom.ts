import { onMount, tick } from "svelte";

export function autoresizeTextarea(node: any) {
    onMount(() => handleInput())
    const handleInput = async () => {
        node.style.height = "0"
        await tick();
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
