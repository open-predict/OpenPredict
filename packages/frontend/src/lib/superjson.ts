import SuperJSON from "superjson";
import {Buffer} from "buffer"

SuperJSON.registerCustom<Buffer, number[]>(
    {
        isApplicable: (v): v is Buffer => v instanceof Buffer,
        serialize: (v) => [...v],
        deserialize: (v) => Buffer.from(v),
    },
    "buffer"
);

export const superjson = SuperJSON;