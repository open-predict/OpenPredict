import * as $protobuf from "protobufjs";
import Long = require("long");
/**
 * * Namespace openpredict.
 * 	 * @exports openpredict
 * 	 * @namespace
 */
export namespace openpredict {

    /**
     * * Properties of an Instruction.
     * 		 * @memberof openpredict
     * 		 * @interface IInstruction
     * 		 * @property {openpredict.Instruction.IInitMarket|null} [initMarket] Instruction initMarket
     * 		 * @property {openpredict.Instruction.IInitMarketAccount|null} [initMarketAccount] Instruction initMarketAccount
     * 		 * @property {openpredict.Instruction.IBuyShares|null} [buyShares] Instruction buyShares
     * 		 * @property {openpredict.Instruction.IResolveMarket|null} [resolveMarket] Instruction resolveMarket
     * 		 * @property {openpredict.Instruction.IRedeemShares|null} [redeemShares] Instruction redeemShares
     * 		 * @property {openpredict.Instruction.ICreateAccount|null} [createAccount] Instruction createAccount
     */
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
    }

    /**
     * * Constructs a new Instruction.
     * 		 * @memberof openpredict
     * 		 * @classdesc Represents an Instruction.
     * 		 * @implements IInstruction
     * 		 * @constructor
     * 		 * @param {openpredict.IInstruction=} [properties] Properties to set
     */
    class Instruction implements IInstruction {

        /**
         * * Constructs a new Instruction.
         * 		 * @memberof openpredict
         * 		 * @classdesc Represents an Instruction.
         * 		 * @implements IInstruction
         * 		 * @constructor
         * 		 * @param {openpredict.IInstruction=} [properties] Properties to set
         */
        constructor(properties?: openpredict.IInstruction);

        /**
         * * Instruction initMarket.
         * 		 * @member {openpredict.Instruction.IInitMarket|null|undefined} initMarket
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         */
        public initMarket?: (openpredict.Instruction.IInitMarket|null);

        /**
         * * Instruction initMarketAccount.
         * 		 * @member {openpredict.Instruction.IInitMarketAccount|null|undefined} initMarketAccount
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         */
        public initMarketAccount?: (openpredict.Instruction.IInitMarketAccount|null);

        /**
         * * Instruction buyShares.
         * 		 * @member {openpredict.Instruction.IBuyShares|null|undefined} buyShares
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         */
        public buyShares?: (openpredict.Instruction.IBuyShares|null);

        /**
         * * Instruction resolveMarket.
         * 		 * @member {openpredict.Instruction.IResolveMarket|null|undefined} resolveMarket
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         */
        public resolveMarket?: (openpredict.Instruction.IResolveMarket|null);

        /**
         * * Instruction redeemShares.
         * 		 * @member {openpredict.Instruction.IRedeemShares|null|undefined} redeemShares
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         */
        public redeemShares?: (openpredict.Instruction.IRedeemShares|null);

        /**
         * * Instruction createAccount.
         * 		 * @member {openpredict.Instruction.ICreateAccount|null|undefined} createAccount
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         */
        public createAccount?: (openpredict.Instruction.ICreateAccount|null);

        /**
         * * Instruction Contents.
         * 		 * @member {"initMarket"|"initMarketAccount"|"buyShares"|"resolveMarket"|"redeemShares"|"createAccount"|undefined} Contents
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         */
        public Contents?: ("initMarket"|"initMarketAccount"|"buyShares"|"resolveMarket"|"redeemShares"|"createAccount");

        /**
         * * Creates a new Instruction instance using the specified properties.
         * 		 * @function create
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {openpredict.IInstruction=} [properties] Properties to set
         * 		 * @returns {openpredict.Instruction} Instruction instance
         */
        public static create(properties?: openpredict.IInstruction): openpredict.Instruction;

        /**
         * * Encodes the specified Instruction message. Does not implicitly {@link openpredict.Instruction.verify|verify} messages.
         * 		 * @function encode
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {openpredict.IInstruction} message Instruction message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encode(message: openpredict.IInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Encodes the specified Instruction message, length delimited. Does not implicitly {@link openpredict.Instruction.verify|verify} messages.
         * 		 * @function encodeDelimited
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {openpredict.IInstruction} message Instruction message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encodeDelimited(message: openpredict.IInstruction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Decodes an Instruction message from the specified reader or buffer.
         * 		 * @function decode
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @param {number} [length] Message length if known beforehand
         * 		 * @returns {openpredict.Instruction} Instruction
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction;

        /**
         * * Decodes an Instruction message from the specified reader or buffer, length delimited.
         * 		 * @function decodeDelimited
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @returns {openpredict.Instruction} Instruction
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction;

        /**
         * * Verifies an Instruction message.
         * 		 * @function verify
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {Object.<string,*>} message Plain object to verify
         * 		 * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * * Creates an Instruction message from a plain object. Also converts values to their respective internal types.
         * 		 * @function fromObject
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {Object.<string,*>} object Plain object
         * 		 * @returns {openpredict.Instruction} Instruction
         */
        public static fromObject(object: { [k: string]: any }): openpredict.Instruction;

        /**
         * * Creates a plain object from an Instruction message. Also converts values to other types if specified.
         * 		 * @function toObject
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {openpredict.Instruction} message Instruction
         * 		 * @param {$protobuf.IConversionOptions} [options] Conversion options
         * 		 * @returns {Object.<string,*>} Plain object
         */
        public static toObject(message: openpredict.Instruction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * * Converts this Instruction to JSON.
         * 		 * @function toJSON
         * 		 * @memberof openpredict.Instruction
         * 		 * @instance
         * 		 * @returns {Object.<string,*>} JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * * Gets the default type url for Instruction
         * 		 * @function getTypeUrl
         * 		 * @memberof openpredict.Instruction
         * 		 * @static
         * 		 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * 		 * @returns {string} The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Instruction {

        /**
         * * Properties of an InitMarket.
         * 			 * @memberof openpredict.Instruction
         * 			 * @interface IInitMarket
         * 			 * @property {Uint8Array|null} [cid] InitMarket cid
         * 			 * @property {Uint8Array|null} [ammAddress] InitMarket ammAddress
         * 			 * @property {number|Long|null} [subsidy] InitMarket subsidy
         */
        interface IInitMarket {

            /** InitMarket cid */
            cid?: (Uint8Array|null);

            /** InitMarket ammAddress */
            ammAddress?: (Uint8Array|null);

            /** InitMarket subsidy */
            subsidy?: (number|Long|null);
        }

        /**
         * * Constructs a new InitMarket.
         * 			 * @memberof openpredict.Instruction
         * 			 * @classdesc Represents an InitMarket.
         * 			 * @implements IInitMarket
         * 			 * @constructor
         * 			 * @param {openpredict.Instruction.IInitMarket=} [properties] Properties to set
         */
        class InitMarket implements IInitMarket {

            /**
             * * Constructs a new InitMarket.
             * 			 * @memberof openpredict.Instruction
             * 			 * @classdesc Represents an InitMarket.
             * 			 * @implements IInitMarket
             * 			 * @constructor
             * 			 * @param {openpredict.Instruction.IInitMarket=} [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IInitMarket);

            /**
             * * InitMarket cid.
             * 			 * @member {Uint8Array} cid
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @instance
             */
            public cid: Uint8Array;

            /**
             * * InitMarket ammAddress.
             * 			 * @member {Uint8Array} ammAddress
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @instance
             */
            public ammAddress: Uint8Array;

            /**
             * * InitMarket subsidy.
             * 			 * @member {number|Long} subsidy
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @instance
             */
            public subsidy: (number|Long);

            /**
             * * Creates a new InitMarket instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IInitMarket=} [properties] Properties to set
             * 			 * @returns {openpredict.Instruction.InitMarket} InitMarket instance
             */
            public static create(properties?: openpredict.Instruction.IInitMarket): openpredict.Instruction.InitMarket;

            /**
             * * Encodes the specified InitMarket message. Does not implicitly {@link openpredict.Instruction.InitMarket.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IInitMarket} message InitMarket message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.Instruction.IInitMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified InitMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.InitMarket.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IInitMarket} message InitMarket message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IInitMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes an InitMarket message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.Instruction.InitMarket} InitMarket
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.InitMarket;

            /**
             * * Decodes an InitMarket message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.Instruction.InitMarket} InitMarket
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.InitMarket;

            /**
             * * Verifies an InitMarket message.
             * 			 * @function verify
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates an InitMarket message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.Instruction.InitMarket} InitMarket
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.InitMarket;

            /**
             * * Creates a plain object from an InitMarket message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.InitMarket} message InitMarket
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.Instruction.InitMarket, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this InitMarket to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for InitMarket
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.Instruction.InitMarket
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /**
         * * Properties of an InitMarketAccount.
         * 			 * @memberof openpredict.Instruction
         * 			 * @interface IInitMarketAccount
         * 			 * @property {Uint8Array|null} [ammAddress] InitMarketAccount ammAddress
         */
        interface IInitMarketAccount {

            /** InitMarketAccount ammAddress */
            ammAddress?: (Uint8Array|null);
        }

        /**
         * * Constructs a new InitMarketAccount.
         * 			 * @memberof openpredict.Instruction
         * 			 * @classdesc Represents an InitMarketAccount.
         * 			 * @implements IInitMarketAccount
         * 			 * @constructor
         * 			 * @param {openpredict.Instruction.IInitMarketAccount=} [properties] Properties to set
         */
        class InitMarketAccount implements IInitMarketAccount {

            /**
             * * Constructs a new InitMarketAccount.
             * 			 * @memberof openpredict.Instruction
             * 			 * @classdesc Represents an InitMarketAccount.
             * 			 * @implements IInitMarketAccount
             * 			 * @constructor
             * 			 * @param {openpredict.Instruction.IInitMarketAccount=} [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IInitMarketAccount);

            /**
             * * InitMarketAccount ammAddress.
             * 			 * @member {Uint8Array} ammAddress
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @instance
             */
            public ammAddress: Uint8Array;

            /**
             * * Creates a new InitMarketAccount instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IInitMarketAccount=} [properties] Properties to set
             * 			 * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount instance
             */
            public static create(properties?: openpredict.Instruction.IInitMarketAccount): openpredict.Instruction.InitMarketAccount;

            /**
             * * Encodes the specified InitMarketAccount message. Does not implicitly {@link openpredict.Instruction.InitMarketAccount.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IInitMarketAccount} message InitMarketAccount message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.Instruction.IInitMarketAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified InitMarketAccount message, length delimited. Does not implicitly {@link openpredict.Instruction.InitMarketAccount.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IInitMarketAccount} message InitMarketAccount message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IInitMarketAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes an InitMarketAccount message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.InitMarketAccount;

            /**
             * * Decodes an InitMarketAccount message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.InitMarketAccount;

            /**
             * * Verifies an InitMarketAccount message.
             * 			 * @function verify
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates an InitMarketAccount message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.InitMarketAccount;

            /**
             * * Creates a plain object from an InitMarketAccount message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.InitMarketAccount} message InitMarketAccount
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.Instruction.InitMarketAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this InitMarketAccount to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for InitMarketAccount
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.Instruction.InitMarketAccount
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /**
         * * Properties of a BuyShares.
         * 			 * @memberof openpredict.Instruction
         * 			 * @interface IBuyShares
         * 			 * @property {Uint8Array|null} [ammAddress] BuyShares ammAddress
         * 			 * @property {number|Long|null} [microUsdc] BuyShares microUsdc
         * 			 * @property {boolean|null} [direction] BuyShares direction
         * 			 * @property {number|Long|null} [expectedAmount] BuyShares expectedAmount
         * 			 * @property {number|Long|null} [drift] BuyShares drift
         */
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

        /**
         * * Constructs a new BuyShares.
         * 			 * @memberof openpredict.Instruction
         * 			 * @classdesc Represents a BuyShares.
         * 			 * @implements IBuyShares
         * 			 * @constructor
         * 			 * @param {openpredict.Instruction.IBuyShares=} [properties] Properties to set
         */
        class BuyShares implements IBuyShares {

            /**
             * * Constructs a new BuyShares.
             * 			 * @memberof openpredict.Instruction
             * 			 * @classdesc Represents a BuyShares.
             * 			 * @implements IBuyShares
             * 			 * @constructor
             * 			 * @param {openpredict.Instruction.IBuyShares=} [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IBuyShares);

            /**
             * * BuyShares ammAddress.
             * 			 * @member {Uint8Array} ammAddress
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @instance
             */
            public ammAddress: Uint8Array;

            /**
             * * BuyShares microUsdc.
             * 			 * @member {number|Long} microUsdc
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @instance
             */
            public microUsdc: (number|Long);

            /**
             * * BuyShares direction.
             * 			 * @member {boolean} direction
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @instance
             */
            public direction: boolean;

            /**
             * * BuyShares expectedAmount.
             * 			 * @member {number|Long} expectedAmount
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @instance
             */
            public expectedAmount: (number|Long);

            /**
             * * BuyShares drift.
             * 			 * @member {number|Long} drift
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @instance
             */
            public drift: (number|Long);

            /**
             * * Creates a new BuyShares instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IBuyShares=} [properties] Properties to set
             * 			 * @returns {openpredict.Instruction.BuyShares} BuyShares instance
             */
            public static create(properties?: openpredict.Instruction.IBuyShares): openpredict.Instruction.BuyShares;

            /**
             * * Encodes the specified BuyShares message. Does not implicitly {@link openpredict.Instruction.BuyShares.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IBuyShares} message BuyShares message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.Instruction.IBuyShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified BuyShares message, length delimited. Does not implicitly {@link openpredict.Instruction.BuyShares.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IBuyShares} message BuyShares message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IBuyShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes a BuyShares message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.Instruction.BuyShares} BuyShares
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.BuyShares;

            /**
             * * Decodes a BuyShares message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.Instruction.BuyShares} BuyShares
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.BuyShares;

            /**
             * * Verifies a BuyShares message.
             * 			 * @function verify
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates a BuyShares message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.Instruction.BuyShares} BuyShares
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.BuyShares;

            /**
             * * Creates a plain object from a BuyShares message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.BuyShares} message BuyShares
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.Instruction.BuyShares, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this BuyShares to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for BuyShares
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.Instruction.BuyShares
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /**
         * * Properties of a ResolveMarket.
         * 			 * @memberof openpredict.Instruction
         * 			 * @interface IResolveMarket
         * 			 * @property {Uint8Array|null} [ammAddress] ResolveMarket ammAddress
         * 			 * @property {boolean|null} [direction] ResolveMarket direction
         */
        interface IResolveMarket {

            /** ResolveMarket ammAddress */
            ammAddress?: (Uint8Array|null);

            /** ResolveMarket direction */
            direction?: (boolean|null);
        }

        /**
         * * Constructs a new ResolveMarket.
         * 			 * @memberof openpredict.Instruction
         * 			 * @classdesc Represents a ResolveMarket.
         * 			 * @implements IResolveMarket
         * 			 * @constructor
         * 			 * @param {openpredict.Instruction.IResolveMarket=} [properties] Properties to set
         */
        class ResolveMarket implements IResolveMarket {

            /**
             * * Constructs a new ResolveMarket.
             * 			 * @memberof openpredict.Instruction
             * 			 * @classdesc Represents a ResolveMarket.
             * 			 * @implements IResolveMarket
             * 			 * @constructor
             * 			 * @param {openpredict.Instruction.IResolveMarket=} [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IResolveMarket);

            /**
             * * ResolveMarket ammAddress.
             * 			 * @member {Uint8Array} ammAddress
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @instance
             */
            public ammAddress: Uint8Array;

            /**
             * * ResolveMarket direction.
             * 			 * @member {boolean} direction
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @instance
             */
            public direction: boolean;

            /**
             * * Creates a new ResolveMarket instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IResolveMarket=} [properties] Properties to set
             * 			 * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket instance
             */
            public static create(properties?: openpredict.Instruction.IResolveMarket): openpredict.Instruction.ResolveMarket;

            /**
             * * Encodes the specified ResolveMarket message. Does not implicitly {@link openpredict.Instruction.ResolveMarket.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IResolveMarket} message ResolveMarket message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.Instruction.IResolveMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified ResolveMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.ResolveMarket.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IResolveMarket} message ResolveMarket message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IResolveMarket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes a ResolveMarket message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.ResolveMarket;

            /**
             * * Decodes a ResolveMarket message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.ResolveMarket;

            /**
             * * Verifies a ResolveMarket message.
             * 			 * @function verify
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates a ResolveMarket message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.ResolveMarket;

            /**
             * * Creates a plain object from a ResolveMarket message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {openpredict.Instruction.ResolveMarket} message ResolveMarket
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.Instruction.ResolveMarket, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this ResolveMarket to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for ResolveMarket
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.Instruction.ResolveMarket
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /**
         * * Properties of a RedeemShares.
         * 			 * @memberof openpredict.Instruction
         * 			 * @interface IRedeemShares
         * 			 * @property {Uint8Array|null} [ammAddress] RedeemShares ammAddress
         */
        interface IRedeemShares {

            /** RedeemShares ammAddress */
            ammAddress?: (Uint8Array|null);
        }

        /**
         * * Constructs a new RedeemShares.
         * 			 * @memberof openpredict.Instruction
         * 			 * @classdesc Represents a RedeemShares.
         * 			 * @implements IRedeemShares
         * 			 * @constructor
         * 			 * @param {openpredict.Instruction.IRedeemShares=} [properties] Properties to set
         */
        class RedeemShares implements IRedeemShares {

            /**
             * * Constructs a new RedeemShares.
             * 			 * @memberof openpredict.Instruction
             * 			 * @classdesc Represents a RedeemShares.
             * 			 * @implements IRedeemShares
             * 			 * @constructor
             * 			 * @param {openpredict.Instruction.IRedeemShares=} [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.IRedeemShares);

            /**
             * * RedeemShares ammAddress.
             * 			 * @member {Uint8Array} ammAddress
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @instance
             */
            public ammAddress: Uint8Array;

            /**
             * * Creates a new RedeemShares instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IRedeemShares=} [properties] Properties to set
             * 			 * @returns {openpredict.Instruction.RedeemShares} RedeemShares instance
             */
            public static create(properties?: openpredict.Instruction.IRedeemShares): openpredict.Instruction.RedeemShares;

            /**
             * * Encodes the specified RedeemShares message. Does not implicitly {@link openpredict.Instruction.RedeemShares.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IRedeemShares} message RedeemShares message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.Instruction.IRedeemShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified RedeemShares message, length delimited. Does not implicitly {@link openpredict.Instruction.RedeemShares.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.IRedeemShares} message RedeemShares message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.IRedeemShares, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes a RedeemShares message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.Instruction.RedeemShares} RedeemShares
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.RedeemShares;

            /**
             * * Decodes a RedeemShares message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.Instruction.RedeemShares} RedeemShares
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.RedeemShares;

            /**
             * * Verifies a RedeemShares message.
             * 			 * @function verify
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates a RedeemShares message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.Instruction.RedeemShares} RedeemShares
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.RedeemShares;

            /**
             * * Creates a plain object from a RedeemShares message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {openpredict.Instruction.RedeemShares} message RedeemShares
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.Instruction.RedeemShares, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this RedeemShares to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for RedeemShares
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.Instruction.RedeemShares
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /**
         * * Properties of a CreateAccount.
         * 			 * @memberof openpredict.Instruction
         * 			 * @interface ICreateAccount
         * 			 * @property {string|null} [username] CreateAccount username
         * 			 * @property {Uint8Array|null} [cid] CreateAccount cid
         */
        interface ICreateAccount {

            /** CreateAccount username */
            username?: (string|null);

            /** CreateAccount cid */
            cid?: (Uint8Array|null);
        }

        /**
         * * Constructs a new CreateAccount.
         * 			 * @memberof openpredict.Instruction
         * 			 * @classdesc Represents a CreateAccount.
         * 			 * @implements ICreateAccount
         * 			 * @constructor
         * 			 * @param {openpredict.Instruction.ICreateAccount=} [properties] Properties to set
         */
        class CreateAccount implements ICreateAccount {

            /**
             * * Constructs a new CreateAccount.
             * 			 * @memberof openpredict.Instruction
             * 			 * @classdesc Represents a CreateAccount.
             * 			 * @implements ICreateAccount
             * 			 * @constructor
             * 			 * @param {openpredict.Instruction.ICreateAccount=} [properties] Properties to set
             */
            constructor(properties?: openpredict.Instruction.ICreateAccount);

            /**
             * * CreateAccount username.
             * 			 * @member {string} username
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @instance
             */
            public username: string;

            /**
             * * CreateAccount cid.
             * 			 * @member {Uint8Array} cid
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @instance
             */
            public cid: Uint8Array;

            /**
             * * Creates a new CreateAccount instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.ICreateAccount=} [properties] Properties to set
             * 			 * @returns {openpredict.Instruction.CreateAccount} CreateAccount instance
             */
            public static create(properties?: openpredict.Instruction.ICreateAccount): openpredict.Instruction.CreateAccount;

            /**
             * * Encodes the specified CreateAccount message. Does not implicitly {@link openpredict.Instruction.CreateAccount.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.ICreateAccount} message CreateAccount message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.Instruction.ICreateAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified CreateAccount message, length delimited. Does not implicitly {@link openpredict.Instruction.CreateAccount.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.ICreateAccount} message CreateAccount message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.Instruction.ICreateAccount, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes a CreateAccount message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.Instruction.CreateAccount} CreateAccount
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.Instruction.CreateAccount;

            /**
             * * Decodes a CreateAccount message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.Instruction.CreateAccount} CreateAccount
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.Instruction.CreateAccount;

            /**
             * * Verifies a CreateAccount message.
             * 			 * @function verify
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates a CreateAccount message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.Instruction.CreateAccount} CreateAccount
             */
            public static fromObject(object: { [k: string]: any }): openpredict.Instruction.CreateAccount;

            /**
             * * Creates a plain object from a CreateAccount message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {openpredict.Instruction.CreateAccount} message CreateAccount
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.Instruction.CreateAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this CreateAccount to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for CreateAccount
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.Instruction.CreateAccount
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /**
     * * Properties of a MarketData.
     * 		 * @memberof openpredict
     * 		 * @interface IMarketData
     * 		 * @property {openpredict.MarketData.IV1|null} [v1] MarketData v1
     */
    interface IMarketData {

        /** MarketData v1 */
        v1?: (openpredict.MarketData.IV1|null);
    }

    /**
     * * Constructs a new MarketData.
     * 		 * @memberof openpredict
     * 		 * @classdesc Represents a MarketData.
     * 		 * @implements IMarketData
     * 		 * @constructor
     * 		 * @param {openpredict.IMarketData=} [properties] Properties to set
     */
    class MarketData implements IMarketData {

        /**
         * * Constructs a new MarketData.
         * 		 * @memberof openpredict
         * 		 * @classdesc Represents a MarketData.
         * 		 * @implements IMarketData
         * 		 * @constructor
         * 		 * @param {openpredict.IMarketData=} [properties] Properties to set
         */
        constructor(properties?: openpredict.IMarketData);

        /**
         * * MarketData v1.
         * 		 * @member {openpredict.MarketData.IV1|null|undefined} v1
         * 		 * @memberof openpredict.MarketData
         * 		 * @instance
         */
        public v1?: (openpredict.MarketData.IV1|null);

        /**
         * * MarketData Contents.
         * 		 * @member {"v1"|undefined} Contents
         * 		 * @memberof openpredict.MarketData
         * 		 * @instance
         */
        public Contents?: "v1";

        /**
         * * Creates a new MarketData instance using the specified properties.
         * 		 * @function create
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {openpredict.IMarketData=} [properties] Properties to set
         * 		 * @returns {openpredict.MarketData} MarketData instance
         */
        public static create(properties?: openpredict.IMarketData): openpredict.MarketData;

        /**
         * * Encodes the specified MarketData message. Does not implicitly {@link openpredict.MarketData.verify|verify} messages.
         * 		 * @function encode
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {openpredict.IMarketData} message MarketData message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encode(message: openpredict.IMarketData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Encodes the specified MarketData message, length delimited. Does not implicitly {@link openpredict.MarketData.verify|verify} messages.
         * 		 * @function encodeDelimited
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {openpredict.IMarketData} message MarketData message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encodeDelimited(message: openpredict.IMarketData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Decodes a MarketData message from the specified reader or buffer.
         * 		 * @function decode
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @param {number} [length] Message length if known beforehand
         * 		 * @returns {openpredict.MarketData} MarketData
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.MarketData;

        /**
         * * Decodes a MarketData message from the specified reader or buffer, length delimited.
         * 		 * @function decodeDelimited
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @returns {openpredict.MarketData} MarketData
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.MarketData;

        /**
         * * Verifies a MarketData message.
         * 		 * @function verify
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {Object.<string,*>} message Plain object to verify
         * 		 * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * * Creates a MarketData message from a plain object. Also converts values to their respective internal types.
         * 		 * @function fromObject
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {Object.<string,*>} object Plain object
         * 		 * @returns {openpredict.MarketData} MarketData
         */
        public static fromObject(object: { [k: string]: any }): openpredict.MarketData;

        /**
         * * Creates a plain object from a MarketData message. Also converts values to other types if specified.
         * 		 * @function toObject
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {openpredict.MarketData} message MarketData
         * 		 * @param {$protobuf.IConversionOptions} [options] Conversion options
         * 		 * @returns {Object.<string,*>} Plain object
         */
        public static toObject(message: openpredict.MarketData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * * Converts this MarketData to JSON.
         * 		 * @function toJSON
         * 		 * @memberof openpredict.MarketData
         * 		 * @instance
         * 		 * @returns {Object.<string,*>} JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * * Gets the default type url for MarketData
         * 		 * @function getTypeUrl
         * 		 * @memberof openpredict.MarketData
         * 		 * @static
         * 		 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * 		 * @returns {string} The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MarketData {

        /**
         * * Properties of a V1.
         * 			 * @memberof openpredict.MarketData
         * 			 * @interface IV1
         * 			 * @property {number|Long|null} [yes] V1 yes
         * 			 * @property {number|Long|null} [no] V1 no
         * 			 * @property {number|Long|null} [subsidy] V1 subsidy
         * 			 * @property {Uint8Array|null} [cid] V1 cid
         * 			 * @property {Uint8Array|null} [ammAddress] V1 ammAddress
         * 			 * @property {Uint8Array|null} [userKey] V1 userKey
         */
        interface IV1 {

            /** V1 yes */
            yes?: (number|Long|null);

            /** V1 no */
            no?: (number|Long|null);

            /** V1 subsidy */
            subsidy?: (number|Long|null);

            /** V1 cid */
            cid?: (Uint8Array|null);

            /** V1 ammAddress */
            ammAddress?: (Uint8Array|null);

            /** V1 userKey */
            userKey?: (Uint8Array|null);
        }

        /**
         * * Constructs a new V1.
         * 			 * @memberof openpredict.MarketData
         * 			 * @classdesc Represents a V1.
         * 			 * @implements IV1
         * 			 * @constructor
         * 			 * @param {openpredict.MarketData.IV1=} [properties] Properties to set
         */
        class V1 implements IV1 {

            /**
             * * Constructs a new V1.
             * 			 * @memberof openpredict.MarketData
             * 			 * @classdesc Represents a V1.
             * 			 * @implements IV1
             * 			 * @constructor
             * 			 * @param {openpredict.MarketData.IV1=} [properties] Properties to set
             */
            constructor(properties?: openpredict.MarketData.IV1);

            /**
             * * V1 yes.
             * 			 * @member {number|Long} yes
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @instance
             */
            public yes: (number|Long);

            /**
             * * V1 no.
             * 			 * @member {number|Long} no
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @instance
             */
            public no: (number|Long);

            /**
             * * V1 subsidy.
             * 			 * @member {number|Long} subsidy
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @instance
             */
            public subsidy: (number|Long);

            /**
             * * V1 cid.
             * 			 * @member {Uint8Array} cid
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @instance
             */
            public cid: Uint8Array;

            /**
             * * V1 ammAddress.
             * 			 * @member {Uint8Array} ammAddress
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @instance
             */
            public ammAddress: Uint8Array;

            /**
             * * V1 userKey.
             * 			 * @member {Uint8Array} userKey
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @instance
             */
            public userKey: Uint8Array;

            /**
             * * Creates a new V1 instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketData.IV1=} [properties] Properties to set
             * 			 * @returns {openpredict.MarketData.V1} V1 instance
             */
            public static create(properties?: openpredict.MarketData.IV1): openpredict.MarketData.V1;

            /**
             * * Encodes the specified V1 message. Does not implicitly {@link openpredict.MarketData.V1.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketData.IV1} message V1 message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.MarketData.IV1, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified V1 message, length delimited. Does not implicitly {@link openpredict.MarketData.V1.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketData.IV1} message V1 message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.MarketData.IV1, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes a V1 message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.MarketData.V1} V1
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.MarketData.V1;

            /**
             * * Decodes a V1 message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.MarketData.V1} V1
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.MarketData.V1;

            /**
             * * Verifies a V1 message.
             * 			 * @function verify
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates a V1 message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.MarketData.V1} V1
             */
            public static fromObject(object: { [k: string]: any }): openpredict.MarketData.V1;

            /**
             * * Creates a plain object from a V1 message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketData.V1} message V1
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.MarketData.V1, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this V1 to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for V1
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.MarketData.V1
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /**
     * * Properties of a MarketUserData.
     * 		 * @memberof openpredict
     * 		 * @interface IMarketUserData
     * 		 * @property {openpredict.MarketUserData.IV1|null} [v1] MarketUserData v1
     */
    interface IMarketUserData {

        /** MarketUserData v1 */
        v1?: (openpredict.MarketUserData.IV1|null);
    }

    /**
     * * Constructs a new MarketUserData.
     * 		 * @memberof openpredict
     * 		 * @classdesc Represents a MarketUserData.
     * 		 * @implements IMarketUserData
     * 		 * @constructor
     * 		 * @param {openpredict.IMarketUserData=} [properties] Properties to set
     */
    class MarketUserData implements IMarketUserData {

        /**
         * * Constructs a new MarketUserData.
         * 		 * @memberof openpredict
         * 		 * @classdesc Represents a MarketUserData.
         * 		 * @implements IMarketUserData
         * 		 * @constructor
         * 		 * @param {openpredict.IMarketUserData=} [properties] Properties to set
         */
        constructor(properties?: openpredict.IMarketUserData);

        /**
         * * MarketUserData v1.
         * 		 * @member {openpredict.MarketUserData.IV1|null|undefined} v1
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @instance
         */
        public v1?: (openpredict.MarketUserData.IV1|null);

        /**
         * * MarketUserData Contents.
         * 		 * @member {"v1"|undefined} Contents
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @instance
         */
        public Contents?: "v1";

        /**
         * * Creates a new MarketUserData instance using the specified properties.
         * 		 * @function create
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {openpredict.IMarketUserData=} [properties] Properties to set
         * 		 * @returns {openpredict.MarketUserData} MarketUserData instance
         */
        public static create(properties?: openpredict.IMarketUserData): openpredict.MarketUserData;

        /**
         * * Encodes the specified MarketUserData message. Does not implicitly {@link openpredict.MarketUserData.verify|verify} messages.
         * 		 * @function encode
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {openpredict.IMarketUserData} message MarketUserData message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encode(message: openpredict.IMarketUserData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Encodes the specified MarketUserData message, length delimited. Does not implicitly {@link openpredict.MarketUserData.verify|verify} messages.
         * 		 * @function encodeDelimited
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {openpredict.IMarketUserData} message MarketUserData message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encodeDelimited(message: openpredict.IMarketUserData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Decodes a MarketUserData message from the specified reader or buffer.
         * 		 * @function decode
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @param {number} [length] Message length if known beforehand
         * 		 * @returns {openpredict.MarketUserData} MarketUserData
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.MarketUserData;

        /**
         * * Decodes a MarketUserData message from the specified reader or buffer, length delimited.
         * 		 * @function decodeDelimited
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @returns {openpredict.MarketUserData} MarketUserData
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.MarketUserData;

        /**
         * * Verifies a MarketUserData message.
         * 		 * @function verify
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {Object.<string,*>} message Plain object to verify
         * 		 * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * * Creates a MarketUserData message from a plain object. Also converts values to their respective internal types.
         * 		 * @function fromObject
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {Object.<string,*>} object Plain object
         * 		 * @returns {openpredict.MarketUserData} MarketUserData
         */
        public static fromObject(object: { [k: string]: any }): openpredict.MarketUserData;

        /**
         * * Creates a plain object from a MarketUserData message. Also converts values to other types if specified.
         * 		 * @function toObject
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {openpredict.MarketUserData} message MarketUserData
         * 		 * @param {$protobuf.IConversionOptions} [options] Conversion options
         * 		 * @returns {Object.<string,*>} Plain object
         */
        public static toObject(message: openpredict.MarketUserData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * * Converts this MarketUserData to JSON.
         * 		 * @function toJSON
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @instance
         * 		 * @returns {Object.<string,*>} JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * * Gets the default type url for MarketUserData
         * 		 * @function getTypeUrl
         * 		 * @memberof openpredict.MarketUserData
         * 		 * @static
         * 		 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * 		 * @returns {string} The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace MarketUserData {

        /**
         * * Properties of a V1.
         * 			 * @memberof openpredict.MarketUserData
         * 			 * @interface IV1
         * 			 * @property {Uint8Array|null} [userKey] V1 userKey
         * 			 * @property {number|Long|null} [shares] V1 shares
         */
        interface IV1 {

            /** V1 userKey */
            userKey?: (Uint8Array|null);

            /** V1 shares */
            shares?: (number|Long|null);
        }

        /**
         * * Constructs a new V1.
         * 			 * @memberof openpredict.MarketUserData
         * 			 * @classdesc Represents a V1.
         * 			 * @implements IV1
         * 			 * @constructor
         * 			 * @param {openpredict.MarketUserData.IV1=} [properties] Properties to set
         */
        class V1 implements IV1 {

            /**
             * * Constructs a new V1.
             * 			 * @memberof openpredict.MarketUserData
             * 			 * @classdesc Represents a V1.
             * 			 * @implements IV1
             * 			 * @constructor
             * 			 * @param {openpredict.MarketUserData.IV1=} [properties] Properties to set
             */
            constructor(properties?: openpredict.MarketUserData.IV1);

            /**
             * * V1 userKey.
             * 			 * @member {Uint8Array} userKey
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @instance
             */
            public userKey: Uint8Array;

            /**
             * * V1 shares.
             * 			 * @member {number|Long} shares
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @instance
             */
            public shares: (number|Long);

            /**
             * * Creates a new V1 instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketUserData.IV1=} [properties] Properties to set
             * 			 * @returns {openpredict.MarketUserData.V1} V1 instance
             */
            public static create(properties?: openpredict.MarketUserData.IV1): openpredict.MarketUserData.V1;

            /**
             * * Encodes the specified V1 message. Does not implicitly {@link openpredict.MarketUserData.V1.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketUserData.IV1} message V1 message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.MarketUserData.IV1, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified V1 message, length delimited. Does not implicitly {@link openpredict.MarketUserData.V1.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketUserData.IV1} message V1 message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.MarketUserData.IV1, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes a V1 message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.MarketUserData.V1} V1
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.MarketUserData.V1;

            /**
             * * Decodes a V1 message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.MarketUserData.V1} V1
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.MarketUserData.V1;

            /**
             * * Verifies a V1 message.
             * 			 * @function verify
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates a V1 message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.MarketUserData.V1} V1
             */
            public static fromObject(object: { [k: string]: any }): openpredict.MarketUserData.V1;

            /**
             * * Creates a plain object from a V1 message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {openpredict.MarketUserData.V1} message V1
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.MarketUserData.V1, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this V1 to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for V1
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.MarketUserData.V1
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /**
     * * Properties of a UserProfileData.
     * 		 * @memberof openpredict
     * 		 * @interface IUserProfileData
     * 		 * @property {openpredict.UserProfileData.IV1|null} [v1] UserProfileData v1
     */
    interface IUserProfileData {

        /** UserProfileData v1 */
        v1?: (openpredict.UserProfileData.IV1|null);
    }

    /**
     * * Constructs a new UserProfileData.
     * 		 * @memberof openpredict
     * 		 * @classdesc Represents a UserProfileData.
     * 		 * @implements IUserProfileData
     * 		 * @constructor
     * 		 * @param {openpredict.IUserProfileData=} [properties] Properties to set
     */
    class UserProfileData implements IUserProfileData {

        /**
         * * Constructs a new UserProfileData.
         * 		 * @memberof openpredict
         * 		 * @classdesc Represents a UserProfileData.
         * 		 * @implements IUserProfileData
         * 		 * @constructor
         * 		 * @param {openpredict.IUserProfileData=} [properties] Properties to set
         */
        constructor(properties?: openpredict.IUserProfileData);

        /**
         * * UserProfileData v1.
         * 		 * @member {openpredict.UserProfileData.IV1|null|undefined} v1
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @instance
         */
        public v1?: (openpredict.UserProfileData.IV1|null);

        /**
         * * UserProfileData Contents.
         * 		 * @member {"v1"|undefined} Contents
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @instance
         */
        public Contents?: "v1";

        /**
         * * Creates a new UserProfileData instance using the specified properties.
         * 		 * @function create
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {openpredict.IUserProfileData=} [properties] Properties to set
         * 		 * @returns {openpredict.UserProfileData} UserProfileData instance
         */
        public static create(properties?: openpredict.IUserProfileData): openpredict.UserProfileData;

        /**
         * * Encodes the specified UserProfileData message. Does not implicitly {@link openpredict.UserProfileData.verify|verify} messages.
         * 		 * @function encode
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {openpredict.IUserProfileData} message UserProfileData message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encode(message: openpredict.IUserProfileData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Encodes the specified UserProfileData message, length delimited. Does not implicitly {@link openpredict.UserProfileData.verify|verify} messages.
         * 		 * @function encodeDelimited
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {openpredict.IUserProfileData} message UserProfileData message or plain object to encode
         * 		 * @param {$protobuf.Writer} [writer] Writer to encode to
         * 		 * @returns {$protobuf.Writer} Writer
         */
        public static encodeDelimited(message: openpredict.IUserProfileData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * * Decodes a UserProfileData message from the specified reader or buffer.
         * 		 * @function decode
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @param {number} [length] Message length if known beforehand
         * 		 * @returns {openpredict.UserProfileData} UserProfileData
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.UserProfileData;

        /**
         * * Decodes a UserProfileData message from the specified reader or buffer, length delimited.
         * 		 * @function decodeDelimited
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * 		 * @returns {openpredict.UserProfileData} UserProfileData
         * 		 * @throws {Error} If the payload is not a reader or valid buffer
         * 		 * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.UserProfileData;

        /**
         * * Verifies a UserProfileData message.
         * 		 * @function verify
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {Object.<string,*>} message Plain object to verify
         * 		 * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * * Creates a UserProfileData message from a plain object. Also converts values to their respective internal types.
         * 		 * @function fromObject
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {Object.<string,*>} object Plain object
         * 		 * @returns {openpredict.UserProfileData} UserProfileData
         */
        public static fromObject(object: { [k: string]: any }): openpredict.UserProfileData;

        /**
         * * Creates a plain object from a UserProfileData message. Also converts values to other types if specified.
         * 		 * @function toObject
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {openpredict.UserProfileData} message UserProfileData
         * 		 * @param {$protobuf.IConversionOptions} [options] Conversion options
         * 		 * @returns {Object.<string,*>} Plain object
         */
        public static toObject(message: openpredict.UserProfileData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * * Converts this UserProfileData to JSON.
         * 		 * @function toJSON
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @instance
         * 		 * @returns {Object.<string,*>} JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * * Gets the default type url for UserProfileData
         * 		 * @function getTypeUrl
         * 		 * @memberof openpredict.UserProfileData
         * 		 * @static
         * 		 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * 		 * @returns {string} The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace UserProfileData {

        /**
         * * Properties of a V1.
         * 			 * @memberof openpredict.UserProfileData
         * 			 * @interface IV1
         * 			 * @property {Uint8Array|null} [cid] V1 cid
         * 			 * @property {string|null} [username] V1 username
         */
        interface IV1 {

            /** V1 cid */
            cid?: (Uint8Array|null);

            /** V1 username */
            username?: (string|null);
        }

        /**
         * * Constructs a new V1.
         * 			 * @memberof openpredict.UserProfileData
         * 			 * @classdesc Represents a V1.
         * 			 * @implements IV1
         * 			 * @constructor
         * 			 * @param {openpredict.UserProfileData.IV1=} [properties] Properties to set
         */
        class V1 implements IV1 {

            /**
             * * Constructs a new V1.
             * 			 * @memberof openpredict.UserProfileData
             * 			 * @classdesc Represents a V1.
             * 			 * @implements IV1
             * 			 * @constructor
             * 			 * @param {openpredict.UserProfileData.IV1=} [properties] Properties to set
             */
            constructor(properties?: openpredict.UserProfileData.IV1);

            /**
             * * V1 cid.
             * 			 * @member {Uint8Array} cid
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @instance
             */
            public cid: Uint8Array;

            /**
             * * V1 username.
             * 			 * @member {string} username
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @instance
             */
            public username: string;

            /**
             * * Creates a new V1 instance using the specified properties.
             * 			 * @function create
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {openpredict.UserProfileData.IV1=} [properties] Properties to set
             * 			 * @returns {openpredict.UserProfileData.V1} V1 instance
             */
            public static create(properties?: openpredict.UserProfileData.IV1): openpredict.UserProfileData.V1;

            /**
             * * Encodes the specified V1 message. Does not implicitly {@link openpredict.UserProfileData.V1.verify|verify} messages.
             * 			 * @function encode
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {openpredict.UserProfileData.IV1} message V1 message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encode(message: openpredict.UserProfileData.IV1, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Encodes the specified V1 message, length delimited. Does not implicitly {@link openpredict.UserProfileData.V1.verify|verify} messages.
             * 			 * @function encodeDelimited
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {openpredict.UserProfileData.IV1} message V1 message or plain object to encode
             * 			 * @param {$protobuf.Writer} [writer] Writer to encode to
             * 			 * @returns {$protobuf.Writer} Writer
             */
            public static encodeDelimited(message: openpredict.UserProfileData.IV1, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * * Decodes a V1 message from the specified reader or buffer.
             * 			 * @function decode
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @param {number} [length] Message length if known beforehand
             * 			 * @returns {openpredict.UserProfileData.V1} V1
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): openpredict.UserProfileData.V1;

            /**
             * * Decodes a V1 message from the specified reader or buffer, length delimited.
             * 			 * @function decodeDelimited
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * 			 * @returns {openpredict.UserProfileData.V1} V1
             * 			 * @throws {Error} If the payload is not a reader or valid buffer
             * 			 * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): openpredict.UserProfileData.V1;

            /**
             * * Verifies a V1 message.
             * 			 * @function verify
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {Object.<string,*>} message Plain object to verify
             * 			 * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * * Creates a V1 message from a plain object. Also converts values to their respective internal types.
             * 			 * @function fromObject
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {Object.<string,*>} object Plain object
             * 			 * @returns {openpredict.UserProfileData.V1} V1
             */
            public static fromObject(object: { [k: string]: any }): openpredict.UserProfileData.V1;

            /**
             * * Creates a plain object from a V1 message. Also converts values to other types if specified.
             * 			 * @function toObject
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {openpredict.UserProfileData.V1} message V1
             * 			 * @param {$protobuf.IConversionOptions} [options] Conversion options
             * 			 * @returns {Object.<string,*>} Plain object
             */
            public static toObject(message: openpredict.UserProfileData.V1, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * * Converts this V1 to JSON.
             * 			 * @function toJSON
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @instance
             * 			 * @returns {Object.<string,*>} JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * * Gets the default type url for V1
             * 			 * @function getTypeUrl
             * 			 * @memberof openpredict.UserProfileData.V1
             * 			 * @static
             * 			 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * 			 * @returns {string} The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
