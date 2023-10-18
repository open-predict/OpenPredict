import type { FakeAppRouter } from "./_app";
import { createTRPCProxyClient } from '@trpc/client';
import { superjson } from "$lib/superjson";
import { fakeAppRouter } from './_app';
import type { TRPCLink } from "@trpc/client";
import type { AnyProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";

const procedureLink: TRPCLink<FakeAppRouter> = () => {
    return ({ op }) => {
      if (op.type === "query") {
        return observable((observer) => {
          const procedure = fakeAppRouter._def
            .procedures[
              op.path as keyof typeof fakeAppRouter._def.procedures
            ] as AnyProcedure;
  
          const promise = procedure({
            ctx: op.context,
            path: op.path,
            rawInput: op.input,
            type: op.type,
          });
  
          promise.then((data) => {
            observer.next({ result: { data } });
            observer.complete();
          }).catch((error) => {
            observer.error(error);
          });
        });
      }
  
      throw new Error("Only query operations are supported on the server");
    };
  };
  
export const trpc = createTRPCProxyClient({
    transformer: superjson,
    links: [procedureLink]
})
