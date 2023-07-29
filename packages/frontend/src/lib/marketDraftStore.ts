// src/stores/user.ts
import { browser, dev } from '$app/environment'
import type { TMarketMetadataSchemaV0 } from '@am/backend/types/market'
import { writable } from 'svelte/store';
import base58 from 'bs58';
import { random } from 'nanoid';
import { faker } from '@faker-js/faker';

type TDraft = {
    date?: Date,
    subsidy?: number, //cents
    metadata: TMarketMetadataSchemaV0
}

type TDrafts = Record<string, TDraft>

const defaultDraft = {
    date: new Date(),
    subsidy: 500,
    metadata: dev ? { title: faker.lorem.lines(1), description: faker.lorem.paragraphs(2), version: 0 } : { title: "", description: "", version: 0 }
}

function createDraftsStore() {

    const key = 'market_drafts';
    const initialValue = browser ? localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {} : {}

    const { subscribe, set, update } = writable<TDrafts>(initialValue)

    subscribe((value) => {
        if (browser && JSON.stringify(value) !== localStorage.getItem(key)) {
            localStorage[key] = JSON.stringify(value)
        }
    })


    function createDraft(): string {
        const id = base58.encode(random(32));
        update(drafts => {
            drafts[id] = JSON.parse(JSON.stringify(defaultDraft))
            return drafts;
        })
        return id;
    }

    function updateMetadata(id: string, field: "title" | "description", value: string): boolean {
        let updated = false;
        update(drafts => {
            if (!!drafts[id]) {
                if (!drafts[id].metadata) drafts[id].metadata = { ...defaultDraft.metadata };
                drafts[id].metadata[field] = value;
            }
            return drafts;
        })
        return updated;
    }

    function updateSubsidy(id: string, value: number): boolean {
        let updated = false;
        update(drafts => {
            if (!!drafts[id]) {
                drafts[id].subsidy = value;
            }
            return drafts;
        })
        return updated;
    }

    function deleteDraft(id: string) {
        update(drafts => {
            delete drafts[id];
            return drafts;
        })
    }

    function clearDrafts() {
        set({})
    }

    return {
        subscribe,
        updateMetadata,
        updateSubsidy,
        createDraft,
        deleteDraft,
        clearDrafts
    }

}

export const draftsStore = createDraftsStore()