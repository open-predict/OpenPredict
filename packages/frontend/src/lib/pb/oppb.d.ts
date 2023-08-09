import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace openpredict. */
export namespace openpredict {

    /** Properties of an Instruction. */
    interface IInstruction {

        /** Instruction initMarket */
        initMarket?: (openpredict.Instruction.IInitMarket|null);

        /** Instruction initMarketAccount */
        initMarketAccount?: (openpredict.Instruction.IInitMarketAccount|null);

        /** Instruction buyShares */
        buyShares?: (openpredict.Instruction.IBuyShares|null);

        /** Instruction resolveMarket */
        resolveMarket?: (openpredict.Instruction.IResolveMarket|null);

        /** Instruction redeemShares */
        redeemShares?: (openpredict.Instruction.IRedeemShares|null);

        /** Instruction createAccount */
        createAccount?: (openpredict.Instruction.ICreateAccount|null);

        /** Instruction subsidizeMarket */
        subsidizeMarket?: (openpredict.Instruction.ISubsidizeMarket|null);
    }

    /** Represents an Instruction. */
    class Instruction implements IInstruction {

        /**
         * Constructs a new Instruction.
         * @param [properties] Properties to set
         */
        constructor(properties?: openpredict.IInstruction);

        /** Instruction initMarket. */
        public initMarket?: (openpredict.Instruction.IInitMarket|null);

        /** Instruction initMarketAccount. */
        public initMarketAccount?: (openpredict.Instruction.IInitMarketAccount|null);

        /** Instruction buyShares. */
        public buyShares?: (openpredict.Instruction.IBuyShares|null);

        /** Instruction resolveMarket. */
        public resolveMarket?: (openpredict.Instruction.IResolveMarket|null);

        /** Instruction redeemShares. */
        public redeemShares?: (openpredict.Instruction.IRedeemShares|null);

        /** Instruction createAccount. */
        public createAccount?: (openpredict.Instruction.ICreateAccount|null);

        /** Instruction subsidizeMarket. */
        public subsidizeMarket?: (openpredict.Instruction.ISubsidizeMarket|null);

        /** Instruction Contents. */
        public Contents?: ("initMarket"|"initMarketAccount"|"buyShares"|"resolveMarket"|"redeemShares"|"createAccount"|"subsidizeMarket");

        /**
         * Creates a new Instruction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Instruction instance
         */
        public static create(properties?: openpredict.IInstruction): openpredict.Instruction;

        /**
         * Encodes the specified Instruction message. Does not implicitly {@link openpredict.Instruction.verify|verify} messages.
         * @param message Instruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: openpredict.IInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Instruction message, length delimited. Does not implicitly {@link openpredict.Instruction.verify|verify} messages.
         * @param message Instruction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: openpredict.IInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Instruction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Instruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction;

        /**
         * Decodes an Instruction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Instruction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction;

        /**
         * Verifies an Instruction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Instruction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Instruction
         */
        public static fromObject(object: { [k: string]: any }): openpredict.Instruction;

        /**
         * Creates a plain object from an Instruction message. Also converts values to other types if specified.
         * @param message Instruction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: openpredict.Instruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Instruction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Instruction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Instruction {

        /** Properties of an InitMarket. */
        interface IInitMarket {

            /** InitMarket cid */
            cid?: (Uint8Array|null);

            /** InitMarket ammAddress */
            ammAddress?: (Uint8Array|null);

            /** InitMarket subsidy */
            subsidy?: (number|Long|null);
        }

        /** Represents an InitMarket. */
        class InitMarket implements IInitMarket {

            /**
             * Constructs a new InitMarket.
             * @param [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IInitMarket);

            /** InitMarket cid. */
            public cid: Uint8Array;

            /** InitMarket ammAddress. */
            public ammAddress: Uint8Array;

            /** InitMarket subsidy. */
            public subsidy: (number|Long);

            /**
             * Creates a new InitMarket instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InitMarket instance
             */
            public static create(properties?: openpredict.Instruction.IInitMarket): openpredict.Instruction.InitMarket;

            /**
             * Encodes the specified InitMarket message. Does not implicitly {@link openpredict.Instruction.InitMarket.verify|verify} messages.
             * @param message InitMarket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: openpredict.Instruction.IInitMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InitMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.InitMarket.verify|verify} messages.
             * @param message InitMarket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IInitMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InitMarket message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InitMarket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.InitMarket;

            /**
             * Decodes an InitMarket message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InitMarket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.InitMarket;

            /**
             * Verifies an InitMarket message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InitMarket message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InitMarket
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.InitMarket;

            /**
             * Creates a plain object from an InitMarket message. Also converts values to other types if specified.
             * @param message InitMarket
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: openpredict.Instruction.InitMarket, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InitMarket to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InitMarket
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InitMarketAccount. */
        interface IInitMarketAccount {

            /** InitMarketAccount ammAddress */
            ammAddress?: (Uint8Array|null);
        }

        /** Represents an InitMarketAccount. */
        class InitMarketAccount implements IInitMarketAccount {

            /**
             * Constructs a new InitMarketAccount.
             * @param [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IInitMarketAccount);

            /** InitMarketAccount ammAddress. */
            public ammAddress: Uint8Array;

            /**
             * Creates a new InitMarketAccount instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InitMarketAccount instance
             */
            public static create(properties?: openpredict.Instruction.IInitMarketAccount): openpredict.Instruction.InitMarketAccount;

            /**
             * Encodes the specified InitMarketAccount message. Does not implicitly {@link openpredict.Instruction.InitMarketAccount.verify|verify} messages.
             * @param message InitMarketAccount message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: openpredict.Instruction.IInitMarketAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InitMarketAccount message, length delimited. Does not implicitly {@link openpredict.Instruction.InitMarketAccount.verify|verify} messages.
             * @param message InitMarketAccount message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IInitMarketAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InitMarketAccount message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InitMarketAccount
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.InitMarketAccount;

            /**
             * Decodes an InitMarketAccount message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InitMarketAccount
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.InitMarketAccount;

            /**
             * Verifies an InitMarketAccount message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InitMarketAccount message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InitMarketAccount
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.InitMarketAccount;

            /**
             * Creates a plain object from an InitMarketAccount message. Also converts values to other types if specified.
             * @param message InitMarketAccount
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: openpredict.Instruction.InitMarketAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InitMarketAccount to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InitMarketAccount
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BuyShares. */
        interface IBuyShares {

            /** BuyShares ammAddress */
            ammAddress?: (Uint8Array|null);

            /** BuyShares microUsdc */
            microUsdc?: (number|Long|null);

            /** BuyShares direction */
            direction?: (boolean|null);

            /** BuyShares expectedAmount */
            expectedAmount?: (number|Long|null);

            /** BuyShares drift */
            drift?: (number|Long|null);
        }

        /** Represents a BuyShares. */
        class BuyShares implements IBuyShares {

            /**
             * Constructs a new BuyShares.
             * @param [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IBuyShares);

            /** BuyShares ammAddress. */
            public ammAddress: Uint8Array;

            /** BuyShares microUsdc. */
            public microUsdc: (number|Long);

            /** BuyShares direction. */
            public direction: boolean;

            /** BuyShares expectedAmount. */
            public expectedAmount: (number|Long);

            /** BuyShares drift. */
            public drift: (number|Long);

            /**
             * Creates a new BuyShares instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BuyShares instance
             */
            public static create(properties?: openpredict.Instruction.IBuyShares): openpredict.Instruction.BuyShares;

            /**
             * Encodes the specified BuyShares message. Does not implicitly {@link openpredict.Instruction.BuyShares.verify|verify} messages.
             * @param message BuyShares message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: openpredict.Instruction.IBuyShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BuyShares message, length delimited. Does not implicitly {@link openpredict.Instruction.BuyShares.verify|verify} messages.
             * @param message BuyShares message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IBuyShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BuyShares message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BuyShares
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.BuyShares;

            /**
             * Decodes a BuyShares message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BuyShares
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.BuyShares;

            /**
             * Verifies a BuyShares message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BuyShares message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BuyShares
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.BuyShares;

            /**
             * Creates a plain object from a BuyShares message. Also converts values to other types if specified.
             * @param message BuyShares
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: openpredict.Instruction.BuyShares, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BuyShares to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BuyShares
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a ResolveMarket. */
        interface IResolveMarket {

            /** ResolveMarket ammAddress */
            ammAddress?: (Uint8Array|null);

            /** ResolveMarket direction */
            direction?: (boolean|null);
        }

        /** Represents a ResolveMarket. */
        class ResolveMarket implements IResolveMarket {

            /**
             * Constructs a new ResolveMarket.
             * @param [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IResolveMarket);

            /** ResolveMarket ammAddress. */
            public ammAddress: Uint8Array;

            /** ResolveMarket direction. */
            public direction: boolean;

            /**
             * Creates a new ResolveMarket instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResolveMarket instance
             */
            public static create(properties?: openpredict.Instruction.IResolveMarket): openpredict.Instruction.ResolveMarket;

            /**
             * Encodes the specified ResolveMarket message. Does not implicitly {@link openpredict.Instruction.ResolveMarket.verify|verify} messages.
             * @param message ResolveMarket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: openpredict.Instruction.IResolveMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResolveMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.ResolveMarket.verify|verify} messages.
             * @param message ResolveMarket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IResolveMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResolveMarket message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResolveMarket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.ResolveMarket;

            /**
             * Decodes a ResolveMarket message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResolveMarket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.ResolveMarket;

            /**
             * Verifies a ResolveMarket message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResolveMarket message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResolveMarket
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.ResolveMarket;

            /**
             * Creates a plain object from a ResolveMarket message. Also converts values to other types if specified.
             * @param message ResolveMarket
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: openpredict.Instruction.ResolveMarket, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResolveMarket to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ResolveMarket
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a RedeemShares. */
        interface IRedeemShares {

            /** RedeemShares ammAddress */
            ammAddress?: (Uint8Array|null);
        }

        /** Represents a RedeemShares. */
        class RedeemShares implements IRedeemShares {

            /**
             * Constructs a new RedeemShares.
             * @param [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IRedeemShares);

            /** RedeemShares ammAddress. */
            public ammAddress: Uint8Array;

            /**
             * Creates a new RedeemShares instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RedeemShares instance
             */
            public static create(properties?: openpredict.Instruction.IRedeemShares): openpredict.Instruction.RedeemShares;

            /**
             * Encodes the specified RedeemShares message. Does not implicitly {@link openpredict.Instruction.RedeemShares.verify|verify} messages.
             * @param message RedeemShares message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: openpredict.Instruction.IRedeemShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RedeemShares message, length delimited. Does not implicitly {@link openpredict.Instruction.RedeemShares.verify|verify} messages.
             * @param message RedeemShares message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IRedeemShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RedeemShares message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RedeemShares
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.RedeemShares;

            /**
             * Decodes a RedeemShares message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RedeemShares
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.RedeemShares;

            /**
             * Verifies a RedeemShares message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RedeemShares message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RedeemShares
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.RedeemShares;

            /**
             * Creates a plain object from a RedeemShares message. Also converts values to other types if specified.
             * @param message RedeemShares
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: openpredict.Instruction.RedeemShares, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RedeemShares to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for RedeemShares
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CreateAccount. */
        interface ICreateAccount {

            /** CreateAccount username */
            username?: (string|null);

            /** CreateAccount cid */
            cid?: (Uint8Array|null);
        }

        /** Represents a CreateAccount. */
        class CreateAccount implements ICreateAccount {

            /**
             * Constructs a new CreateAccount.
             * @param [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.ICreateAccount);

            /** CreateAccount username. */
            public username: string;

            /** CreateAccount cid. */
            public cid: Uint8Array;

            /**
             * Creates a new CreateAccount instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateAccount instance
             */
            public static create(properties?: openpredict.Instruction.ICreateAccount): openpredict.Instruction.CreateAccount;

            /**
             * Encodes the specified CreateAccount message. Does not implicitly {@link openpredict.Instruction.CreateAccount.verify|verify} messages.
             * @param message CreateAccount message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: openpredict.Instruction.ICreateAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateAccount message, length delimited. Does not implicitly {@link openpredict.Instruction.CreateAccount.verify|verify} messages.
             * @param message CreateAccount message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.ICreateAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateAccount message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateAccount
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.CreateAccount;

            /**
             * Decodes a CreateAccount message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateAccount
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.CreateAccount;

            /**
             * Verifies a CreateAccount message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateAccount message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateAccount
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.CreateAccount;

            /**
             * Creates a plain object from a CreateAccount message. Also converts values to other types if specified.
             * @param message CreateAccount
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: openpredict.Instruction.CreateAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateAccount to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CreateAccount
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SubsidizeMarket. */
        interface ISubsidizeMarket {

            /** SubsidizeMarket ammAddress */
            ammAddress?: (Uint8Array|null);

            /** SubsidizeMarket subsidy */
            subsidy?: (number|Long|null);
        }

        /** Represents a SubsidizeMarket. */
        class SubsidizeMarket implements ISubsidizeMarket {

            /**
             * Constructs a new SubsidizeMarket.
             * @param [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.ISubsidizeMarket);

            /** SubsidizeMarket ammAddress. */
            public ammAddress: Uint8Array;

            /** SubsidizeMarket subsidy. */
            public subsidy: (number|Long);

            /**
             * Creates a new SubsidizeMarket instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SubsidizeMarket instance
             */
            public static create(properties?: openpredict.Instruction.ISubsidizeMarket): openpredict.Instruction.SubsidizeMarket;

            /**
             * Encodes the specified SubsidizeMarket message. Does not implicitly {@link openpredict.Instruction.SubsidizeMarket.verify|verify} messages.
             * @param message SubsidizeMarket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: openpredict.Instruction.ISubsidizeMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SubsidizeMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.SubsidizeMarket.verify|verify} messages.
             * @param message SubsidizeMarket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.ISubsidizeMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SubsidizeMarket message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SubsidizeMarket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.SubsidizeMarket;

            /**
             * Decodes a SubsidizeMarket message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SubsidizeMarket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.SubsidizeMarket;

            /**
             * Verifies a SubsidizeMarket message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SubsidizeMarket message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SubsidizeMarket
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.SubsidizeMarket;

            /**
             * Creates a plain object from a SubsidizeMarket message. Also converts values to other types if specified.
             * @param message SubsidizeMarket
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: openpredict.Instruction.SubsidizeMarket, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SubsidizeMarket to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SubsidizeMarket
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
