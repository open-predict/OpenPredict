import { browser } from '$app/environment'
import { writable } from 'svelte/store';
import Cookies from 'js-cookie';
import { superjson } from '$lib/superjson';
import { onMount } from 'svelte';

export type TUiStore = {
    theme?: "dark" | "light",
};

export const uiStoreLsKey = 'ui_store';

function createUiStore() {

    const initialValueRaw = Cookies.get(uiStoreLsKey);
    const initialValueParsed = initialValueRaw ? superjson.parse<TUiStore>(initialValueRaw) : undefined;
    const initialValue = initialValueParsed ? {
        ...initialValueParsed
    } : {};

    let theme = initialValue?.theme;

    const { subscribe, set, update } = writable<TUiStore>((() => {
        return initialValue;
    })())

    subscribe((value) => {
        if (browser && superjson.stringify(value) !== Cookies.get(uiStoreLsKey)) {
            Cookies.set(uiStoreLsKey, superjson.stringify(value))
            theme = value?.theme;
        }
    })

    function browserDefaultDark(): boolean | undefined {
        if(!browser){
            return;
        }
        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
    }

    function setAuto() {
        if (browserDefaultDark()) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        update(v => ({
            ...v,
            theme: undefined
        }))
    };

    function toggleTheme() {
        switch (theme) {
            case "dark":
                document.documentElement.classList.remove("dark");
                update(v => ({
                    ...v,
                    theme: "light"
                }))
                break;

            case "light":
                document.documentElement.classList.add("dark");
                update(v => ({
                    ...v,
                    theme: "dark"
                }))
                break;

            default:
                if (browserDefaultDark()) {
                    document.documentElement.classList.remove("dark");
                    update(v => ({
                        ...v,
                        theme: "light"
                    }))
                } else {
                    document.documentElement.classList.add("dark");
                    update(v => ({
                        ...v,
                        theme: "dark"
                    }))
                }
                break;
        }
    }

    function clear() {
        update(v => {
            return {};
        })
    }

    return {
        subscribe,
        browserDefaultDark,
        toggleTheme,
        setAuto,
        clear
    }

}

export const uiStore = createUiStore()