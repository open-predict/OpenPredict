import log from '$lib/log';
import { nanoid } from 'nanoid';
import { writable } from 'svelte/store';

export enum ToastKind {
    info,
    warning,
    error,
    success
}

type TToastProps = {
    duration?: number,
    variant?: "info" | "warning" | "error" | "success",
    title?: string,
    message?: string,
    optionOne?: {
        handler?: () => void,
        label?: string
    }
}

type TToastStore = (TToastProps & { id: string })[];

function createModalStore() {
    const { subscribe, update, set } = writable<TToastStore>([]);

    function create(opt: TToastProps) {
        const id = nanoid();
        if (opt.duration !== 0) {
            log("debug", "toastsStore", "created with timeout...");
            setTimeout(() => remove(id), opt.duration ?? 2500);
        }
        update(ts => {
            return [...ts, { id, ...opt }];
        })
    }

    function remove(id: string) {
        log("debug", "toastsStore", "removing...");
        update(ts => {
            return ts.filter(t => t.id !== id)
        })
    }

    return {
        subscribe,
        create,
        remove
    }
}

export const toastsStore = createModalStore()