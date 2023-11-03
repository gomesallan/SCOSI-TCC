"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Entity {
    constructor(props, id) {
        this.props = props;
        this._id = id !== null && id !== void 0 ? id : crypto_1.default.randomUUID();
    }
}
exports.Entity = Entity;
