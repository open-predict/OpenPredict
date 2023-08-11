"use strict";

import $protobuf from "protobufjs/minimal.js";
// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const openpredict = $root.openpredict = (() => {

  /**
   * Namespace openpredict.
   * @exports openpredict
   * @namespace
   */
  const openpredict = {};

  openpredict.Instruction = (function () {

    /**
     * Properties of an Instruction.
     * @memberof openpredict
     * @interface IInstruction
     * @property {openpredict.Instruction.IInitMarket|null} [initMarket] Instruction initMarket
     * @property {openpredict.Instruction.IInitMarketAccount|null} [initMarketAccount] Instruction initMarketAccount
     * @property {openpredict.Instruction.IBuyShares|null} [buyShares] Instruction buyShares
     * @property {openpredict.Instruction.IResolveMarket|null} [resolveMarket] Instruction resolveMarket
     * @property {openpredict.Instruction.IRedeemShares|null} [redeemShares] Instruction redeemShares
     * @property {openpredict.Instruction.ICreateAccount|null} [createAccount] Instruction createAccount
     * @property {openpredict.Instruction.ISubsidizeMarket|null} [subsidizeMarket] Instruction subsidizeMarket
     */

    /**
     * Constructs a new Instruction.
     * @memberof openpredict
     * @classdesc Represents an Instruction.
     * @implements IInstruction
     * @constructor
     * @param {openpredict.IInstruction=} [properties] Properties to set
     */
    function Instruction(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * Instruction initMarket.
     * @member {openpredict.Instruction.IInitMarket|null|undefined} initMarket
     * @memberof openpredict.Instruction
     * @instance
     */
    Instruction.prototype.initMarket = null;

    /**
     * Instruction initMarketAccount.
     * @member {openpredict.Instruction.IInitMarketAccount|null|undefined} initMarketAccount
     * @memberof openpredict.Instruction
     * @instance
     */
    Instruction.prototype.initMarketAccount = null;

    /**
     * Instruction buyShares.
     * @member {openpredict.Instruction.IBuyShares|null|undefined} buyShares
     * @memberof openpredict.Instruction
     * @instance
     */
    Instruction.prototype.buyShares = null;

    /**
     * Instruction resolveMarket.
     * @member {openpredict.Instruction.IResolveMarket|null|undefined} resolveMarket
     * @memberof openpredict.Instruction
     * @instance
     */
    Instruction.prototype.resolveMarket = null;

    /**
     * Instruction redeemShares.
     * @member {openpredict.Instruction.IRedeemShares|null|undefined} redeemShares
     * @memberof openpredict.Instruction
     * @instance
     */
    Instruction.prototype.redeemShares = null;

    /**
     * Instruction createAccount.
     * @member {openpredict.Instruction.ICreateAccount|null|undefined} createAccount
     * @memberof openpredict.Instruction
     * @instance
     */
    Instruction.prototype.createAccount = null;

    /**
     * Instruction subsidizeMarket.
     * @member {openpredict.Instruction.ISubsidizeMarket|null|undefined} subsidizeMarket
     * @memberof openpredict.Instruction
     * @instance
     */
    Instruction.prototype.subsidizeMarket = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Instruction Contents.
     * @member {"initMarket"|"initMarketAccount"|"buyShares"|"resolveMarket"|"redeemShares"|"createAccount"|"subsidizeMarket"|undefined} Contents
     * @memberof openpredict.Instruction
     * @instance
     */
    Object.defineProperty(Instruction.prototype, "Contents", {
      get: $util.oneOfGetter($oneOfFields = ["initMarket", "initMarketAccount", "buyShares", "resolveMarket", "redeemShares", "createAccount", "subsidizeMarket"]),
      set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Instruction instance using the specified properties.
     * @function create
     * @memberof openpredict.Instruction
     * @static
     * @param {openpredict.IInstruction=} [properties] Properties to set
     * @returns {openpredict.Instruction} Instruction instance
     */
    Instruction.create = function create(properties) {
      return new Instruction(properties);
    };

    /**
     * Encodes the specified Instruction message. Does not implicitly {@link openpredict.Instruction.verify|verify} messages.
     * @function encode
     * @memberof openpredict.Instruction
     * @static
     * @param {openpredict.IInstruction} message Instruction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Instruction.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.initMarket != null && Object.hasOwnProperty.call(message, "initMarket"))
        $root.openpredict.Instruction.InitMarket.encode(message.initMarket, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
      if (message.initMarketAccount != null && Object.hasOwnProperty.call(message, "initMarketAccount"))
        $root.openpredict.Instruction.InitMarketAccount.encode(message.initMarketAccount, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
      if (message.buyShares != null && Object.hasOwnProperty.call(message, "buyShares"))
        $root.openpredict.Instruction.BuyShares.encode(message.buyShares, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
      if (message.resolveMarket != null && Object.hasOwnProperty.call(message, "resolveMarket"))
        $root.openpredict.Instruction.ResolveMarket.encode(message.resolveMarket, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
      if (message.redeemShares != null && Object.hasOwnProperty.call(message, "redeemShares"))
        $root.openpredict.Instruction.RedeemShares.encode(message.redeemShares, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
      if (message.createAccount != null && Object.hasOwnProperty.call(message, "createAccount"))
        $root.openpredict.Instruction.CreateAccount.encode(message.createAccount, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
      if (message.subsidizeMarket != null && Object.hasOwnProperty.call(message, "subsidizeMarket"))
        $root.openpredict.Instruction.SubsidizeMarket.encode(message.subsidizeMarket, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
      return writer;
    };

    /**
     * Encodes the specified Instruction message, length delimited. Does not implicitly {@link openpredict.Instruction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof openpredict.Instruction
     * @static
     * @param {openpredict.IInstruction} message Instruction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Instruction.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Instruction message from the specified reader or buffer.
     * @function decode
     * @memberof openpredict.Instruction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {openpredict.Instruction} Instruction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Instruction.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction();
      while (reader.pos < end) {
        let tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            message.initMarket = $root.openpredict.Instruction.InitMarket.decode(reader, reader.uint32());
            break;
          }
          case 2: {
            message.initMarketAccount = $root.openpredict.Instruction.InitMarketAccount.decode(reader, reader.uint32());
            break;
          }
          case 3: {
            message.buyShares = $root.openpredict.Instruction.BuyShares.decode(reader, reader.uint32());
            break;
          }
          case 4: {
            message.resolveMarket = $root.openpredict.Instruction.ResolveMarket.decode(reader, reader.uint32());
            break;
          }
          case 5: {
            message.redeemShares = $root.openpredict.Instruction.RedeemShares.decode(reader, reader.uint32());
            break;
          }
          case 6: {
            message.createAccount = $root.openpredict.Instruction.CreateAccount.decode(reader, reader.uint32());
            break;
          }
          case 7: {
            message.subsidizeMarket = $root.openpredict.Instruction.SubsidizeMarket.decode(reader, reader.uint32());
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an Instruction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof openpredict.Instruction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {openpredict.Instruction} Instruction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Instruction.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Instruction message.
     * @function verify
     * @memberof openpredict.Instruction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Instruction.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      let properties = {};
      if (message.initMarket != null && message.hasOwnProperty("initMarket")) {
        properties.Contents = 1;
        {
          let error = $root.openpredict.Instruction.InitMarket.verify(message.initMarket);
          if (error)
            return "initMarket." + error;
        }
      }
      if (message.initMarketAccount != null && message.hasOwnProperty("initMarketAccount")) {
        if (properties.Contents === 1)
          return "Contents: multiple values";
        properties.Contents = 1;
        {
          let error = $root.openpredict.Instruction.InitMarketAccount.verify(message.initMarketAccount);
          if (error)
            return "initMarketAccount." + error;
        }
      }
      if (message.buyShares != null && message.hasOwnProperty("buyShares")) {
        if (properties.Contents === 1)
          return "Contents: multiple values";
        properties.Contents = 1;
        {
          let error = $root.openpredict.Instruction.BuyShares.verify(message.buyShares);
          if (error)
            return "buyShares." + error;
        }
      }
      if (message.resolveMarket != null && message.hasOwnProperty("resolveMarket")) {
        if (properties.Contents === 1)
          return "Contents: multiple values";
        properties.Contents = 1;
        {
          let error = $root.openpredict.Instruction.ResolveMarket.verify(message.resolveMarket);
          if (error)
            return "resolveMarket." + error;
        }
      }
      if (message.redeemShares != null && message.hasOwnProperty("redeemShares")) {
        if (properties.Contents === 1)
          return "Contents: multiple values";
        properties.Contents = 1;
        {
          let error = $root.openpredict.Instruction.RedeemShares.verify(message.redeemShares);
          if (error)
            return "redeemShares." + error;
        }
      }
      if (message.createAccount != null && message.hasOwnProperty("createAccount")) {
        if (properties.Contents === 1)
          return "Contents: multiple values";
        properties.Contents = 1;
        {
          let error = $root.openpredict.Instruction.CreateAccount.verify(message.createAccount);
          if (error)
            return "createAccount." + error;
        }
      }
      if (message.subsidizeMarket != null && message.hasOwnProperty("subsidizeMarket")) {
        if (properties.Contents === 1)
          return "Contents: multiple values";
        properties.Contents = 1;
        {
          let error = $root.openpredict.Instruction.SubsidizeMarket.verify(message.subsidizeMarket);
          if (error)
            return "subsidizeMarket." + error;
        }
      }
      return null;
    };

    /**
     * Creates an Instruction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof openpredict.Instruction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {openpredict.Instruction} Instruction
     */
    Instruction.fromObject = function fromObject(object) {
      if (object instanceof $root.openpredict.Instruction)
        return object;
      let message = new $root.openpredict.Instruction();
      if (object.initMarket != null) {
        if (typeof object.initMarket !== "object")
          throw TypeError(".openpredict.Instruction.initMarket: object expected");
        message.initMarket = $root.openpredict.Instruction.InitMarket.fromObject(object.initMarket);
      }
      if (object.initMarketAccount != null) {
        if (typeof object.initMarketAccount !== "object")
          throw TypeError(".openpredict.Instruction.initMarketAccount: object expected");
        message.initMarketAccount = $root.openpredict.Instruction.InitMarketAccount.fromObject(object.initMarketAccount);
      }
      if (object.buyShares != null) {
        if (typeof object.buyShares !== "object")
          throw TypeError(".openpredict.Instruction.buyShares: object expected");
        message.buyShares = $root.openpredict.Instruction.BuyShares.fromObject(object.buyShares);
      }
      if (object.resolveMarket != null) {
        if (typeof object.resolveMarket !== "object")
          throw TypeError(".openpredict.Instruction.resolveMarket: object expected");
        message.resolveMarket = $root.openpredict.Instruction.ResolveMarket.fromObject(object.resolveMarket);
      }
      if (object.redeemShares != null) {
        if (typeof object.redeemShares !== "object")
          throw TypeError(".openpredict.Instruction.redeemShares: object expected");
        message.redeemShares = $root.openpredict.Instruction.RedeemShares.fromObject(object.redeemShares);
      }
      if (object.createAccount != null) {
        if (typeof object.createAccount !== "object")
          throw TypeError(".openpredict.Instruction.createAccount: object expected");
        message.createAccount = $root.openpredict.Instruction.CreateAccount.fromObject(object.createAccount);
      }
      if (object.subsidizeMarket != null) {
        if (typeof object.subsidizeMarket !== "object")
          throw TypeError(".openpredict.Instruction.subsidizeMarket: object expected");
        message.subsidizeMarket = $root.openpredict.Instruction.SubsidizeMarket.fromObject(object.subsidizeMarket);
      }
      return message;
    };

    /**
     * Creates a plain object from an Instruction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof openpredict.Instruction
     * @static
     * @param {openpredict.Instruction} message Instruction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Instruction.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      let object = {};
      if (message.initMarket != null && message.hasOwnProperty("initMarket")) {
        object.initMarket = $root.openpredict.Instruction.InitMarket.toObject(message.initMarket, options);
        if (options.oneofs)
          object.Contents = "initMarket";
      }
      if (message.initMarketAccount != null && message.hasOwnProperty("initMarketAccount")) {
        object.initMarketAccount = $root.openpredict.Instruction.InitMarketAccount.toObject(message.initMarketAccount, options);
        if (options.oneofs)
          object.Contents = "initMarketAccount";
      }
      if (message.buyShares != null && message.hasOwnProperty("buyShares")) {
        object.buyShares = $root.openpredict.Instruction.BuyShares.toObject(message.buyShares, options);
        if (options.oneofs)
          object.Contents = "buyShares";
      }
      if (message.resolveMarket != null && message.hasOwnProperty("resolveMarket")) {
        object.resolveMarket = $root.openpredict.Instruction.ResolveMarket.toObject(message.resolveMarket, options);
        if (options.oneofs)
          object.Contents = "resolveMarket";
      }
      if (message.redeemShares != null && message.hasOwnProperty("redeemShares")) {
        object.redeemShares = $root.openpredict.Instruction.RedeemShares.toObject(message.redeemShares, options);
        if (options.oneofs)
          object.Contents = "redeemShares";
      }
      if (message.createAccount != null && message.hasOwnProperty("createAccount")) {
        object.createAccount = $root.openpredict.Instruction.CreateAccount.toObject(message.createAccount, options);
        if (options.oneofs)
          object.Contents = "createAccount";
      }
      if (message.subsidizeMarket != null && message.hasOwnProperty("subsidizeMarket")) {
        object.subsidizeMarket = $root.openpredict.Instruction.SubsidizeMarket.toObject(message.subsidizeMarket, options);
        if (options.oneofs)
          object.Contents = "subsidizeMarket";
      }
      return object;
    };

    /**
     * Converts this Instruction to JSON.
     * @function toJSON
     * @memberof openpredict.Instruction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Instruction.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Instruction
     * @function getTypeUrl
     * @memberof openpredict.Instruction
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Instruction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/openpredict.Instruction";
    };

    Instruction.InitMarket = (function () {

      /**
       * Properties of an InitMarket.
       * @memberof openpredict.Instruction
       * @interface IInitMarket
       * @property {Uint8Array|null} [cid] InitMarket cid
       * @property {Uint8Array|null} [ammAddress] InitMarket ammAddress
       * @property {number|Long|null} [subsidy] InitMarket subsidy
       */

      /**
       * Constructs a new InitMarket.
       * @memberof openpredict.Instruction
       * @classdesc Represents an InitMarket.
       * @implements IInitMarket
       * @constructor
       * @param {openpredict.Instruction.IInitMarket=} [properties] Properties to set
       */
      function InitMarket(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * InitMarket cid.
       * @member {Uint8Array} cid
       * @memberof openpredict.Instruction.InitMarket
       * @instance
       */
      InitMarket.prototype.cid = $util.newBuffer([]);

      /**
       * InitMarket ammAddress.
       * @member {Uint8Array} ammAddress
       * @memberof openpredict.Instruction.InitMarket
       * @instance
       */
      InitMarket.prototype.ammAddress = $util.newBuffer([]);

      /**
       * InitMarket subsidy.
       * @member {number|Long} subsidy
       * @memberof openpredict.Instruction.InitMarket
       * @instance
       */
      InitMarket.prototype.subsidy = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

      /**
       * Creates a new InitMarket instance using the specified properties.
       * @function create
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {openpredict.Instruction.IInitMarket=} [properties] Properties to set
       * @returns {openpredict.Instruction.InitMarket} InitMarket instance
       */
      InitMarket.create = function create(properties) {
        return new InitMarket(properties);
      };

      /**
       * Encodes the specified InitMarket message. Does not implicitly {@link openpredict.Instruction.InitMarket.verify|verify} messages.
       * @function encode
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {openpredict.Instruction.IInitMarket} message InitMarket message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      InitMarket.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
          writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.cid);
        if (message.ammAddress != null && Object.hasOwnProperty.call(message, "ammAddress"))
          writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.ammAddress);
        if (message.subsidy != null && Object.hasOwnProperty.call(message, "subsidy"))
          writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.subsidy);
        return writer;
      };

      /**
       * Encodes the specified InitMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.InitMarket.verify|verify} messages.
       * @function encodeDelimited
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {openpredict.Instruction.IInitMarket} message InitMarket message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      InitMarket.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an InitMarket message from the specified reader or buffer.
       * @function decode
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {openpredict.Instruction.InitMarket} InitMarket
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      InitMarket.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction.InitMarket();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.cid = reader.bytes();
              break;
            }
            case 2: {
              message.ammAddress = reader.bytes();
              break;
            }
            case 3: {
              message.subsidy = reader.uint64();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an InitMarket message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {openpredict.Instruction.InitMarket} InitMarket
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      InitMarket.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an InitMarket message.
       * @function verify
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      InitMarket.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.cid != null && message.hasOwnProperty("cid"))
          if (!(message.cid && typeof message.cid.length === "number" || $util.isString(message.cid)))
            return "cid: buffer expected";
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          if (!(message.ammAddress && typeof message.ammAddress.length === "number" || $util.isString(message.ammAddress)))
            return "ammAddress: buffer expected";
        if (message.subsidy != null && message.hasOwnProperty("subsidy"))
          if (!$util.isInteger(message.subsidy) && !(message.subsidy && $util.isInteger(message.subsidy.low) && $util.isInteger(message.subsidy.high)))
            return "subsidy: integer|Long expected";
        return null;
      };

      /**
       * Creates an InitMarket message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {openpredict.Instruction.InitMarket} InitMarket
       */
      InitMarket.fromObject = function fromObject(object) {
        if (object instanceof $root.openpredict.Instruction.InitMarket)
          return object;
        let message = new $root.openpredict.Instruction.InitMarket();
        if (object.cid != null)
          if (typeof object.cid === "string")
            $util.base64.decode(object.cid, message.cid = $util.newBuffer($util.base64.length(object.cid)), 0);
          else if (object.cid.length >= 0)
            message.cid = object.cid;
        if (object.ammAddress != null)
          if (typeof object.ammAddress === "string")
            $util.base64.decode(object.ammAddress, message.ammAddress = $util.newBuffer($util.base64.length(object.ammAddress)), 0);
          else if (object.ammAddress.length >= 0)
            message.ammAddress = object.ammAddress;
        if (object.subsidy != null)
          if ($util.Long)
            (message.subsidy = $util.Long.fromValue(object.subsidy)).unsigned = true;
          else if (typeof object.subsidy === "string")
            message.subsidy = parseInt(object.subsidy, 10);
          else if (typeof object.subsidy === "number")
            message.subsidy = object.subsidy;
          else if (typeof object.subsidy === "object")
            message.subsidy = new $util.LongBits(object.subsidy.low >>> 0, object.subsidy.high >>> 0).toNumber(true);
        return message;
      };

      /**
       * Creates a plain object from an InitMarket message. Also converts values to other types if specified.
       * @function toObject
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {openpredict.Instruction.InitMarket} message InitMarket
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      InitMarket.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String)
            object.cid = "";
          else {
            object.cid = [];
            if (options.bytes !== Array)
              object.cid = $util.newBuffer(object.cid);
          }
          if (options.bytes === String)
            object.ammAddress = "";
          else {
            object.ammAddress = [];
            if (options.bytes !== Array)
              object.ammAddress = $util.newBuffer(object.ammAddress);
          }
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.subsidy = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.subsidy = options.longs === String ? "0" : 0;
        }
        if (message.cid != null && message.hasOwnProperty("cid"))
          object.cid = options.bytes === String ? $util.base64.encode(message.cid, 0, message.cid.length) : options.bytes === Array ? Array.prototype.slice.call(message.cid) : message.cid;
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          object.ammAddress = options.bytes === String ? $util.base64.encode(message.ammAddress, 0, message.ammAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ammAddress) : message.ammAddress;
        if (message.subsidy != null && message.hasOwnProperty("subsidy"))
          if (typeof message.subsidy === "number")
            object.subsidy = options.longs === String ? String(message.subsidy) : message.subsidy;
          else
            object.subsidy = options.longs === String ? $util.Long.prototype.toString.call(message.subsidy) : options.longs === Number ? new $util.LongBits(message.subsidy.low >>> 0, message.subsidy.high >>> 0).toNumber(true) : message.subsidy;
        return object;
      };

      /**
       * Converts this InitMarket to JSON.
       * @function toJSON
       * @memberof openpredict.Instruction.InitMarket
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      InitMarket.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for InitMarket
       * @function getTypeUrl
       * @memberof openpredict.Instruction.InitMarket
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      InitMarket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/openpredict.Instruction.InitMarket";
      };

      return InitMarket;
    })();

    Instruction.InitMarketAccount = (function () {

      /**
       * Properties of an InitMarketAccount.
       * @memberof openpredict.Instruction
       * @interface IInitMarketAccount
       * @property {Uint8Array|null} [ammAddress] InitMarketAccount ammAddress
       */

      /**
       * Constructs a new InitMarketAccount.
       * @memberof openpredict.Instruction
       * @classdesc Represents an InitMarketAccount.
       * @implements IInitMarketAccount
       * @constructor
       * @param {openpredict.Instruction.IInitMarketAccount=} [properties] Properties to set
       */
      function InitMarketAccount(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * InitMarketAccount ammAddress.
       * @member {Uint8Array} ammAddress
       * @memberof openpredict.Instruction.InitMarketAccount
       * @instance
       */
      InitMarketAccount.prototype.ammAddress = $util.newBuffer([]);

      /**
       * Creates a new InitMarketAccount instance using the specified properties.
       * @function create
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {openpredict.Instruction.IInitMarketAccount=} [properties] Properties to set
       * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount instance
       */
      InitMarketAccount.create = function create(properties) {
        return new InitMarketAccount(properties);
      };

      /**
       * Encodes the specified InitMarketAccount message. Does not implicitly {@link openpredict.Instruction.InitMarketAccount.verify|verify} messages.
       * @function encode
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {openpredict.Instruction.IInitMarketAccount} message InitMarketAccount message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      InitMarketAccount.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.ammAddress != null && Object.hasOwnProperty.call(message, "ammAddress"))
          writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ammAddress);
        return writer;
      };

      /**
       * Encodes the specified InitMarketAccount message, length delimited. Does not implicitly {@link openpredict.Instruction.InitMarketAccount.verify|verify} messages.
       * @function encodeDelimited
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {openpredict.Instruction.IInitMarketAccount} message InitMarketAccount message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      InitMarketAccount.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an InitMarketAccount message from the specified reader or buffer.
       * @function decode
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      InitMarketAccount.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction.InitMarketAccount();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.ammAddress = reader.bytes();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an InitMarketAccount message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      InitMarketAccount.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an InitMarketAccount message.
       * @function verify
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      InitMarketAccount.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          if (!(message.ammAddress && typeof message.ammAddress.length === "number" || $util.isString(message.ammAddress)))
            return "ammAddress: buffer expected";
        return null;
      };

      /**
       * Creates an InitMarketAccount message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {openpredict.Instruction.InitMarketAccount} InitMarketAccount
       */
      InitMarketAccount.fromObject = function fromObject(object) {
        if (object instanceof $root.openpredict.Instruction.InitMarketAccount)
          return object;
        let message = new $root.openpredict.Instruction.InitMarketAccount();
        if (object.ammAddress != null)
          if (typeof object.ammAddress === "string")
            $util.base64.decode(object.ammAddress, message.ammAddress = $util.newBuffer($util.base64.length(object.ammAddress)), 0);
          else if (object.ammAddress.length >= 0)
            message.ammAddress = object.ammAddress;
        return message;
      };

      /**
       * Creates a plain object from an InitMarketAccount message. Also converts values to other types if specified.
       * @function toObject
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {openpredict.Instruction.InitMarketAccount} message InitMarketAccount
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      InitMarketAccount.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        let object = {};
        if (options.defaults)
          if (options.bytes === String)
            object.ammAddress = "";
          else {
            object.ammAddress = [];
            if (options.bytes !== Array)
              object.ammAddress = $util.newBuffer(object.ammAddress);
          }
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          object.ammAddress = options.bytes === String ? $util.base64.encode(message.ammAddress, 0, message.ammAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ammAddress) : message.ammAddress;
        return object;
      };

      /**
       * Converts this InitMarketAccount to JSON.
       * @function toJSON
       * @memberof openpredict.Instruction.InitMarketAccount
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      InitMarketAccount.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for InitMarketAccount
       * @function getTypeUrl
       * @memberof openpredict.Instruction.InitMarketAccount
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      InitMarketAccount.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/openpredict.Instruction.InitMarketAccount";
      };

      return InitMarketAccount;
    })();

    Instruction.BuyShares = (function () {

      /**
       * Properties of a BuyShares.
       * @memberof openpredict.Instruction
       * @interface IBuyShares
       * @property {Uint8Array|null} [ammAddress] BuyShares ammAddress
       * @property {number|Long|null} [microUsdc] BuyShares microUsdc
       * @property {boolean|null} [direction] BuyShares direction
       * @property {number|Long|null} [expectedAmount] BuyShares expectedAmount
       * @property {number|Long|null} [drift] BuyShares drift
       */

      /**
       * Constructs a new BuyShares.
       * @memberof openpredict.Instruction
       * @classdesc Represents a BuyShares.
       * @implements IBuyShares
       * @constructor
       * @param {openpredict.Instruction.IBuyShares=} [properties] Properties to set
       */
      function BuyShares(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * BuyShares ammAddress.
       * @member {Uint8Array} ammAddress
       * @memberof openpredict.Instruction.BuyShares
       * @instance
       */
      BuyShares.prototype.ammAddress = $util.newBuffer([]);

      /**
       * BuyShares microUsdc.
       * @member {number|Long} microUsdc
       * @memberof openpredict.Instruction.BuyShares
       * @instance
       */
      BuyShares.prototype.microUsdc = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

      /**
       * BuyShares direction.
       * @member {boolean} direction
       * @memberof openpredict.Instruction.BuyShares
       * @instance
       */
      BuyShares.prototype.direction = false;

      /**
       * BuyShares expectedAmount.
       * @member {number|Long} expectedAmount
       * @memberof openpredict.Instruction.BuyShares
       * @instance
       */
      BuyShares.prototype.expectedAmount = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

      /**
       * BuyShares drift.
       * @member {number|Long} drift
       * @memberof openpredict.Instruction.BuyShares
       * @instance
       */
      BuyShares.prototype.drift = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

      /**
       * Creates a new BuyShares instance using the specified properties.
       * @function create
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {openpredict.Instruction.IBuyShares=} [properties] Properties to set
       * @returns {openpredict.Instruction.BuyShares} BuyShares instance
       */
      BuyShares.create = function create(properties) {
        return new BuyShares(properties);
      };

      /**
       * Encodes the specified BuyShares message. Does not implicitly {@link openpredict.Instruction.BuyShares.verify|verify} messages.
       * @function encode
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {openpredict.Instruction.IBuyShares} message BuyShares message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      BuyShares.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.ammAddress != null && Object.hasOwnProperty.call(message, "ammAddress"))
          writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ammAddress);
        if (message.microUsdc != null && Object.hasOwnProperty.call(message, "microUsdc"))
          writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.microUsdc);
        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
          writer.uint32(/* id 3, wireType 0 =*/24).bool(message.direction);
        if (message.expectedAmount != null && Object.hasOwnProperty.call(message, "expectedAmount"))
          writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.expectedAmount);
        if (message.drift != null && Object.hasOwnProperty.call(message, "drift"))
          writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.drift);
        return writer;
      };

      /**
       * Encodes the specified BuyShares message, length delimited. Does not implicitly {@link openpredict.Instruction.BuyShares.verify|verify} messages.
       * @function encodeDelimited
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {openpredict.Instruction.IBuyShares} message BuyShares message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      BuyShares.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a BuyShares message from the specified reader or buffer.
       * @function decode
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {openpredict.Instruction.BuyShares} BuyShares
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      BuyShares.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction.BuyShares();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.ammAddress = reader.bytes();
              break;
            }
            case 2: {
              message.microUsdc = reader.uint64();
              break;
            }
            case 3: {
              message.direction = reader.bool();
              break;
            }
            case 4: {
              message.expectedAmount = reader.uint64();
              break;
            }
            case 5: {
              message.drift = reader.uint64();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a BuyShares message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {openpredict.Instruction.BuyShares} BuyShares
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      BuyShares.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a BuyShares message.
       * @function verify
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      BuyShares.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          if (!(message.ammAddress && typeof message.ammAddress.length === "number" || $util.isString(message.ammAddress)))
            return "ammAddress: buffer expected";
        if (message.microUsdc != null && message.hasOwnProperty("microUsdc"))
          if (!$util.isInteger(message.microUsdc) && !(message.microUsdc && $util.isInteger(message.microUsdc.low) && $util.isInteger(message.microUsdc.high)))
            return "microUsdc: integer|Long expected";
        if (message.direction != null && message.hasOwnProperty("direction"))
          if (typeof message.direction !== "boolean")
            return "direction: boolean expected";
        if (message.expectedAmount != null && message.hasOwnProperty("expectedAmount"))
          if (!$util.isInteger(message.expectedAmount) && !(message.expectedAmount && $util.isInteger(message.expectedAmount.low) && $util.isInteger(message.expectedAmount.high)))
            return "expectedAmount: integer|Long expected";
        if (message.drift != null && message.hasOwnProperty("drift"))
          if (!$util.isInteger(message.drift) && !(message.drift && $util.isInteger(message.drift.low) && $util.isInteger(message.drift.high)))
            return "drift: integer|Long expected";
        return null;
      };

      /**
       * Creates a BuyShares message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {openpredict.Instruction.BuyShares} BuyShares
       */
      BuyShares.fromObject = function fromObject(object) {
        if (object instanceof $root.openpredict.Instruction.BuyShares)
          return object;
        let message = new $root.openpredict.Instruction.BuyShares();
        if (object.ammAddress != null)
          if (typeof object.ammAddress === "string")
            $util.base64.decode(object.ammAddress, message.ammAddress = $util.newBuffer($util.base64.length(object.ammAddress)), 0);
          else if (object.ammAddress.length >= 0)
            message.ammAddress = object.ammAddress;
        if (object.microUsdc != null)
          if ($util.Long)
            (message.microUsdc = $util.Long.fromValue(object.microUsdc)).unsigned = true;
          else if (typeof object.microUsdc === "string")
            message.microUsdc = parseInt(object.microUsdc, 10);
          else if (typeof object.microUsdc === "number")
            message.microUsdc = object.microUsdc;
          else if (typeof object.microUsdc === "object")
            message.microUsdc = new $util.LongBits(object.microUsdc.low >>> 0, object.microUsdc.high >>> 0).toNumber(true);
        if (object.direction != null)
          message.direction = Boolean(object.direction);
        if (object.expectedAmount != null)
          if ($util.Long)
            (message.expectedAmount = $util.Long.fromValue(object.expectedAmount)).unsigned = true;
          else if (typeof object.expectedAmount === "string")
            message.expectedAmount = parseInt(object.expectedAmount, 10);
          else if (typeof object.expectedAmount === "number")
            message.expectedAmount = object.expectedAmount;
          else if (typeof object.expectedAmount === "object")
            message.expectedAmount = new $util.LongBits(object.expectedAmount.low >>> 0, object.expectedAmount.high >>> 0).toNumber(true);
        if (object.drift != null)
          if ($util.Long)
            (message.drift = $util.Long.fromValue(object.drift)).unsigned = true;
          else if (typeof object.drift === "string")
            message.drift = parseInt(object.drift, 10);
          else if (typeof object.drift === "number")
            message.drift = object.drift;
          else if (typeof object.drift === "object")
            message.drift = new $util.LongBits(object.drift.low >>> 0, object.drift.high >>> 0).toNumber(true);
        return message;
      };

      /**
       * Creates a plain object from a BuyShares message. Also converts values to other types if specified.
       * @function toObject
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {openpredict.Instruction.BuyShares} message BuyShares
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      BuyShares.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String)
            object.ammAddress = "";
          else {
            object.ammAddress = [];
            if (options.bytes !== Array)
              object.ammAddress = $util.newBuffer(object.ammAddress);
          }
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.microUsdc = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.microUsdc = options.longs === String ? "0" : 0;
          object.direction = false;
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.expectedAmount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.expectedAmount = options.longs === String ? "0" : 0;
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.drift = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.drift = options.longs === String ? "0" : 0;
        }
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          object.ammAddress = options.bytes === String ? $util.base64.encode(message.ammAddress, 0, message.ammAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ammAddress) : message.ammAddress;
        if (message.microUsdc != null && message.hasOwnProperty("microUsdc"))
          if (typeof message.microUsdc === "number")
            object.microUsdc = options.longs === String ? String(message.microUsdc) : message.microUsdc;
          else
            object.microUsdc = options.longs === String ? $util.Long.prototype.toString.call(message.microUsdc) : options.longs === Number ? new $util.LongBits(message.microUsdc.low >>> 0, message.microUsdc.high >>> 0).toNumber(true) : message.microUsdc;
        if (message.direction != null && message.hasOwnProperty("direction"))
          object.direction = message.direction;
        if (message.expectedAmount != null && message.hasOwnProperty("expectedAmount"))
          if (typeof message.expectedAmount === "number")
            object.expectedAmount = options.longs === String ? String(message.expectedAmount) : message.expectedAmount;
          else
            object.expectedAmount = options.longs === String ? $util.Long.prototype.toString.call(message.expectedAmount) : options.longs === Number ? new $util.LongBits(message.expectedAmount.low >>> 0, message.expectedAmount.high >>> 0).toNumber(true) : message.expectedAmount;
        if (message.drift != null && message.hasOwnProperty("drift"))
          if (typeof message.drift === "number")
            object.drift = options.longs === String ? String(message.drift) : message.drift;
          else
            object.drift = options.longs === String ? $util.Long.prototype.toString.call(message.drift) : options.longs === Number ? new $util.LongBits(message.drift.low >>> 0, message.drift.high >>> 0).toNumber(true) : message.drift;
        return object;
      };

      /**
       * Converts this BuyShares to JSON.
       * @function toJSON
       * @memberof openpredict.Instruction.BuyShares
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      BuyShares.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for BuyShares
       * @function getTypeUrl
       * @memberof openpredict.Instruction.BuyShares
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      BuyShares.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/openpredict.Instruction.BuyShares";
      };

      return BuyShares;
    })();

    Instruction.ResolveMarket = (function () {

      /**
       * Properties of a ResolveMarket.
       * @memberof openpredict.Instruction
       * @interface IResolveMarket
       * @property {Uint8Array|null} [ammAddress] ResolveMarket ammAddress
       * @property {boolean|null} [direction] ResolveMarket direction
       */

      /**
       * Constructs a new ResolveMarket.
       * @memberof openpredict.Instruction
       * @classdesc Represents a ResolveMarket.
       * @implements IResolveMarket
       * @constructor
       * @param {openpredict.Instruction.IResolveMarket=} [properties] Properties to set
       */
      function ResolveMarket(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * ResolveMarket ammAddress.
       * @member {Uint8Array} ammAddress
       * @memberof openpredict.Instruction.ResolveMarket
       * @instance
       */
      ResolveMarket.prototype.ammAddress = $util.newBuffer([]);

      /**
       * ResolveMarket direction.
       * @member {boolean} direction
       * @memberof openpredict.Instruction.ResolveMarket
       * @instance
       */
      ResolveMarket.prototype.direction = false;

      /**
       * Creates a new ResolveMarket instance using the specified properties.
       * @function create
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {openpredict.Instruction.IResolveMarket=} [properties] Properties to set
       * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket instance
       */
      ResolveMarket.create = function create(properties) {
        return new ResolveMarket(properties);
      };

      /**
       * Encodes the specified ResolveMarket message. Does not implicitly {@link openpredict.Instruction.ResolveMarket.verify|verify} messages.
       * @function encode
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {openpredict.Instruction.IResolveMarket} message ResolveMarket message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      ResolveMarket.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.ammAddress != null && Object.hasOwnProperty.call(message, "ammAddress"))
          writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ammAddress);
        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
          writer.uint32(/* id 2, wireType 0 =*/16).bool(message.direction);
        return writer;
      };

      /**
       * Encodes the specified ResolveMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.ResolveMarket.verify|verify} messages.
       * @function encodeDelimited
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {openpredict.Instruction.IResolveMarket} message ResolveMarket message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      ResolveMarket.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a ResolveMarket message from the specified reader or buffer.
       * @function decode
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      ResolveMarket.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction.ResolveMarket();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.ammAddress = reader.bytes();
              break;
            }
            case 2: {
              message.direction = reader.bool();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a ResolveMarket message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      ResolveMarket.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a ResolveMarket message.
       * @function verify
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      ResolveMarket.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          if (!(message.ammAddress && typeof message.ammAddress.length === "number" || $util.isString(message.ammAddress)))
            return "ammAddress: buffer expected";
        if (message.direction != null && message.hasOwnProperty("direction"))
          if (typeof message.direction !== "boolean")
            return "direction: boolean expected";
        return null;
      };

      /**
       * Creates a ResolveMarket message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {openpredict.Instruction.ResolveMarket} ResolveMarket
       */
      ResolveMarket.fromObject = function fromObject(object) {
        if (object instanceof $root.openpredict.Instruction.ResolveMarket)
          return object;
        let message = new $root.openpredict.Instruction.ResolveMarket();
        if (object.ammAddress != null)
          if (typeof object.ammAddress === "string")
            $util.base64.decode(object.ammAddress, message.ammAddress = $util.newBuffer($util.base64.length(object.ammAddress)), 0);
          else if (object.ammAddress.length >= 0)
            message.ammAddress = object.ammAddress;
        if (object.direction != null)
          message.direction = Boolean(object.direction);
        return message;
      };

      /**
       * Creates a plain object from a ResolveMarket message. Also converts values to other types if specified.
       * @function toObject
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {openpredict.Instruction.ResolveMarket} message ResolveMarket
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      ResolveMarket.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String)
            object.ammAddress = "";
          else {
            object.ammAddress = [];
            if (options.bytes !== Array)
              object.ammAddress = $util.newBuffer(object.ammAddress);
          }
          object.direction = false;
        }
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          object.ammAddress = options.bytes === String ? $util.base64.encode(message.ammAddress, 0, message.ammAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ammAddress) : message.ammAddress;
        if (message.direction != null && message.hasOwnProperty("direction"))
          object.direction = message.direction;
        return object;
      };

      /**
       * Converts this ResolveMarket to JSON.
       * @function toJSON
       * @memberof openpredict.Instruction.ResolveMarket
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      ResolveMarket.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for ResolveMarket
       * @function getTypeUrl
       * @memberof openpredict.Instruction.ResolveMarket
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      ResolveMarket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/openpredict.Instruction.ResolveMarket";
      };

      return ResolveMarket;
    })();

    Instruction.RedeemShares = (function () {

      /**
       * Properties of a RedeemShares.
       * @memberof openpredict.Instruction
       * @interface IRedeemShares
       * @property {Uint8Array|null} [ammAddress] RedeemShares ammAddress
       */

      /**
       * Constructs a new RedeemShares.
       * @memberof openpredict.Instruction
       * @classdesc Represents a RedeemShares.
       * @implements IRedeemShares
       * @constructor
       * @param {openpredict.Instruction.IRedeemShares=} [properties] Properties to set
       */
      function RedeemShares(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * RedeemShares ammAddress.
       * @member {Uint8Array} ammAddress
       * @memberof openpredict.Instruction.RedeemShares
       * @instance
       */
      RedeemShares.prototype.ammAddress = $util.newBuffer([]);

      /**
       * Creates a new RedeemShares instance using the specified properties.
       * @function create
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {openpredict.Instruction.IRedeemShares=} [properties] Properties to set
       * @returns {openpredict.Instruction.RedeemShares} RedeemShares instance
       */
      RedeemShares.create = function create(properties) {
        return new RedeemShares(properties);
      };

      /**
       * Encodes the specified RedeemShares message. Does not implicitly {@link openpredict.Instruction.RedeemShares.verify|verify} messages.
       * @function encode
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {openpredict.Instruction.IRedeemShares} message RedeemShares message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      RedeemShares.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.ammAddress != null && Object.hasOwnProperty.call(message, "ammAddress"))
          writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ammAddress);
        return writer;
      };

      /**
       * Encodes the specified RedeemShares message, length delimited. Does not implicitly {@link openpredict.Instruction.RedeemShares.verify|verify} messages.
       * @function encodeDelimited
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {openpredict.Instruction.IRedeemShares} message RedeemShares message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      RedeemShares.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a RedeemShares message from the specified reader or buffer.
       * @function decode
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {openpredict.Instruction.RedeemShares} RedeemShares
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      RedeemShares.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction.RedeemShares();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.ammAddress = reader.bytes();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a RedeemShares message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {openpredict.Instruction.RedeemShares} RedeemShares
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      RedeemShares.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a RedeemShares message.
       * @function verify
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      RedeemShares.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          if (!(message.ammAddress && typeof message.ammAddress.length === "number" || $util.isString(message.ammAddress)))
            return "ammAddress: buffer expected";
        return null;
      };

      /**
       * Creates a RedeemShares message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {openpredict.Instruction.RedeemShares} RedeemShares
       */
      RedeemShares.fromObject = function fromObject(object) {
        if (object instanceof $root.openpredict.Instruction.RedeemShares)
          return object;
        let message = new $root.openpredict.Instruction.RedeemShares();
        if (object.ammAddress != null)
          if (typeof object.ammAddress === "string")
            $util.base64.decode(object.ammAddress, message.ammAddress = $util.newBuffer($util.base64.length(object.ammAddress)), 0);
          else if (object.ammAddress.length >= 0)
            message.ammAddress = object.ammAddress;
        return message;
      };

      /**
       * Creates a plain object from a RedeemShares message. Also converts values to other types if specified.
       * @function toObject
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {openpredict.Instruction.RedeemShares} message RedeemShares
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      RedeemShares.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        let object = {};
        if (options.defaults)
          if (options.bytes === String)
            object.ammAddress = "";
          else {
            object.ammAddress = [];
            if (options.bytes !== Array)
              object.ammAddress = $util.newBuffer(object.ammAddress);
          }
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          object.ammAddress = options.bytes === String ? $util.base64.encode(message.ammAddress, 0, message.ammAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ammAddress) : message.ammAddress;
        return object;
      };

      /**
       * Converts this RedeemShares to JSON.
       * @function toJSON
       * @memberof openpredict.Instruction.RedeemShares
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      RedeemShares.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for RedeemShares
       * @function getTypeUrl
       * @memberof openpredict.Instruction.RedeemShares
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      RedeemShares.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/openpredict.Instruction.RedeemShares";
      };

      return RedeemShares;
    })();

    Instruction.CreateAccount = (function () {

      /**
       * Properties of a CreateAccount.
       * @memberof openpredict.Instruction
       * @interface ICreateAccount
       * @property {string|null} [username] CreateAccount username
       * @property {Uint8Array|null} [cid] CreateAccount cid
       */

      /**
       * Constructs a new CreateAccount.
       * @memberof openpredict.Instruction
       * @classdesc Represents a CreateAccount.
       * @implements ICreateAccount
       * @constructor
       * @param {openpredict.Instruction.ICreateAccount=} [properties] Properties to set
       */
      function CreateAccount(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * CreateAccount username.
       * @member {string} username
       * @memberof openpredict.Instruction.CreateAccount
       * @instance
       */
      CreateAccount.prototype.username = "";

      /**
       * CreateAccount cid.
       * @member {Uint8Array} cid
       * @memberof openpredict.Instruction.CreateAccount
       * @instance
       */
      CreateAccount.prototype.cid = $util.newBuffer([]);

      /**
       * Creates a new CreateAccount instance using the specified properties.
       * @function create
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {openpredict.Instruction.ICreateAccount=} [properties] Properties to set
       * @returns {openpredict.Instruction.CreateAccount} CreateAccount instance
       */
      CreateAccount.create = function create(properties) {
        return new CreateAccount(properties);
      };

      /**
       * Encodes the specified CreateAccount message. Does not implicitly {@link openpredict.Instruction.CreateAccount.verify|verify} messages.
       * @function encode
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {openpredict.Instruction.ICreateAccount} message CreateAccount message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CreateAccount.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.username != null && Object.hasOwnProperty.call(message, "username"))
          writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
        if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
          writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.cid);
        return writer;
      };

      /**
       * Encodes the specified CreateAccount message, length delimited. Does not implicitly {@link openpredict.Instruction.CreateAccount.verify|verify} messages.
       * @function encodeDelimited
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {openpredict.Instruction.ICreateAccount} message CreateAccount message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CreateAccount.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a CreateAccount message from the specified reader or buffer.
       * @function decode
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {openpredict.Instruction.CreateAccount} CreateAccount
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CreateAccount.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction.CreateAccount();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.username = reader.string();
              break;
            }
            case 2: {
              message.cid = reader.bytes();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a CreateAccount message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {openpredict.Instruction.CreateAccount} CreateAccount
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CreateAccount.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a CreateAccount message.
       * @function verify
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      CreateAccount.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.username != null && message.hasOwnProperty("username"))
          if (!$util.isString(message.username))
            return "username: string expected";
        if (message.cid != null && message.hasOwnProperty("cid"))
          if (!(message.cid && typeof message.cid.length === "number" || $util.isString(message.cid)))
            return "cid: buffer expected";
        return null;
      };

      /**
       * Creates a CreateAccount message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {openpredict.Instruction.CreateAccount} CreateAccount
       */
      CreateAccount.fromObject = function fromObject(object) {
        if (object instanceof $root.openpredict.Instruction.CreateAccount)
          return object;
        let message = new $root.openpredict.Instruction.CreateAccount();
        if (object.username != null)
          message.username = String(object.username);
        if (object.cid != null)
          if (typeof object.cid === "string")
            $util.base64.decode(object.cid, message.cid = $util.newBuffer($util.base64.length(object.cid)), 0);
          else if (object.cid.length >= 0)
            message.cid = object.cid;
        return message;
      };

      /**
       * Creates a plain object from a CreateAccount message. Also converts values to other types if specified.
       * @function toObject
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {openpredict.Instruction.CreateAccount} message CreateAccount
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      CreateAccount.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        let object = {};
        if (options.defaults) {
          object.username = "";
          if (options.bytes === String)
            object.cid = "";
          else {
            object.cid = [];
            if (options.bytes !== Array)
              object.cid = $util.newBuffer(object.cid);
          }
        }
        if (message.username != null && message.hasOwnProperty("username"))
          object.username = message.username;
        if (message.cid != null && message.hasOwnProperty("cid"))
          object.cid = options.bytes === String ? $util.base64.encode(message.cid, 0, message.cid.length) : options.bytes === Array ? Array.prototype.slice.call(message.cid) : message.cid;
        return object;
      };

      /**
       * Converts this CreateAccount to JSON.
       * @function toJSON
       * @memberof openpredict.Instruction.CreateAccount
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      CreateAccount.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for CreateAccount
       * @function getTypeUrl
       * @memberof openpredict.Instruction.CreateAccount
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      CreateAccount.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/openpredict.Instruction.CreateAccount";
      };

      return CreateAccount;
    })();

    Instruction.SubsidizeMarket = (function () {

      /**
       * Properties of a SubsidizeMarket.
       * @memberof openpredict.Instruction
       * @interface ISubsidizeMarket
       * @property {Uint8Array|null} [ammAddress] SubsidizeMarket ammAddress
       * @property {number|Long|null} [subsidy] SubsidizeMarket subsidy
       */

      /**
       * Constructs a new SubsidizeMarket.
       * @memberof openpredict.Instruction
       * @classdesc Represents a SubsidizeMarket.
       * @implements ISubsidizeMarket
       * @constructor
       * @param {openpredict.Instruction.ISubsidizeMarket=} [properties] Properties to set
       */
      function SubsidizeMarket(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * SubsidizeMarket ammAddress.
       * @member {Uint8Array} ammAddress
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @instance
       */
      SubsidizeMarket.prototype.ammAddress = $util.newBuffer([]);

      /**
       * SubsidizeMarket subsidy.
       * @member {number|Long} subsidy
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @instance
       */
      SubsidizeMarket.prototype.subsidy = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

      /**
       * Creates a new SubsidizeMarket instance using the specified properties.
       * @function create
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {openpredict.Instruction.ISubsidizeMarket=} [properties] Properties to set
       * @returns {openpredict.Instruction.SubsidizeMarket} SubsidizeMarket instance
       */
      SubsidizeMarket.create = function create(properties) {
        return new SubsidizeMarket(properties);
      };

      /**
       * Encodes the specified SubsidizeMarket message. Does not implicitly {@link openpredict.Instruction.SubsidizeMarket.verify|verify} messages.
       * @function encode
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {openpredict.Instruction.ISubsidizeMarket} message SubsidizeMarket message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      SubsidizeMarket.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.ammAddress != null && Object.hasOwnProperty.call(message, "ammAddress"))
          writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ammAddress);
        if (message.subsidy != null && Object.hasOwnProperty.call(message, "subsidy"))
          writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.subsidy);
        return writer;
      };

      /**
       * Encodes the specified SubsidizeMarket message, length delimited. Does not implicitly {@link openpredict.Instruction.SubsidizeMarket.verify|verify} messages.
       * @function encodeDelimited
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {openpredict.Instruction.ISubsidizeMarket} message SubsidizeMarket message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      SubsidizeMarket.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a SubsidizeMarket message from the specified reader or buffer.
       * @function decode
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {openpredict.Instruction.SubsidizeMarket} SubsidizeMarket
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      SubsidizeMarket.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.openpredict.Instruction.SubsidizeMarket();
        while (reader.pos < end) {
          let tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.ammAddress = reader.bytes();
              break;
            }
            case 3: {
              message.subsidy = reader.uint64();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a SubsidizeMarket message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {openpredict.Instruction.SubsidizeMarket} SubsidizeMarket
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      SubsidizeMarket.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a SubsidizeMarket message.
       * @function verify
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      SubsidizeMarket.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          if (!(message.ammAddress && typeof message.ammAddress.length === "number" || $util.isString(message.ammAddress)))
            return "ammAddress: buffer expected";
        if (message.subsidy != null && message.hasOwnProperty("subsidy"))
          if (!$util.isInteger(message.subsidy) && !(message.subsidy && $util.isInteger(message.subsidy.low) && $util.isInteger(message.subsidy.high)))
            return "subsidy: integer|Long expected";
        return null;
      };

      /**
       * Creates a SubsidizeMarket message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {openpredict.Instruction.SubsidizeMarket} SubsidizeMarket
       */
      SubsidizeMarket.fromObject = function fromObject(object) {
        if (object instanceof $root.openpredict.Instruction.SubsidizeMarket)
          return object;
        let message = new $root.openpredict.Instruction.SubsidizeMarket();
        if (object.ammAddress != null)
          if (typeof object.ammAddress === "string")
            $util.base64.decode(object.ammAddress, message.ammAddress = $util.newBuffer($util.base64.length(object.ammAddress)), 0);
          else if (object.ammAddress.length >= 0)
            message.ammAddress = object.ammAddress;
        if (object.subsidy != null)
          if ($util.Long)
            (message.subsidy = $util.Long.fromValue(object.subsidy)).unsigned = true;
          else if (typeof object.subsidy === "string")
            message.subsidy = parseInt(object.subsidy, 10);
          else if (typeof object.subsidy === "number")
            message.subsidy = object.subsidy;
          else if (typeof object.subsidy === "object")
            message.subsidy = new $util.LongBits(object.subsidy.low >>> 0, object.subsidy.high >>> 0).toNumber(true);
        return message;
      };

      /**
       * Creates a plain object from a SubsidizeMarket message. Also converts values to other types if specified.
       * @function toObject
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {openpredict.Instruction.SubsidizeMarket} message SubsidizeMarket
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      SubsidizeMarket.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        let object = {};
        if (options.defaults) {
          if (options.bytes === String)
            object.ammAddress = "";
          else {
            object.ammAddress = [];
            if (options.bytes !== Array)
              object.ammAddress = $util.newBuffer(object.ammAddress);
          }
          if ($util.Long) {
            let long = new $util.Long(0, 0, true);
            object.subsidy = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.subsidy = options.longs === String ? "0" : 0;
        }
        if (message.ammAddress != null && message.hasOwnProperty("ammAddress"))
          object.ammAddress = options.bytes === String ? $util.base64.encode(message.ammAddress, 0, message.ammAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.ammAddress) : message.ammAddress;
        if (message.subsidy != null && message.hasOwnProperty("subsidy"))
          if (typeof message.subsidy === "number")
            object.subsidy = options.longs === String ? String(message.subsidy) : message.subsidy;
          else
            object.subsidy = options.longs === String ? $util.Long.prototype.toString.call(message.subsidy) : options.longs === Number ? new $util.LongBits(message.subsidy.low >>> 0, message.subsidy.high >>> 0).toNumber(true) : message.subsidy;
        return object;
      };

      /**
       * Converts this SubsidizeMarket to JSON.
       * @function toJSON
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      SubsidizeMarket.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for SubsidizeMarket
       * @function getTypeUrl
       * @memberof openpredict.Instruction.SubsidizeMarket
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      SubsidizeMarket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/openpredict.Instruction.SubsidizeMarket";
      };

      return SubsidizeMarket;
    })();

    return Instruction;
  })();

  return openpredict;
})();
