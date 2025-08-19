"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bip39 = require("bip39");
var mnemonic = bip39.generateMnemonic();
console.log(mnemonic);
