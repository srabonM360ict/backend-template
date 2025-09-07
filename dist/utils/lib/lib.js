"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const qrcode_1 = __importDefault(require("qrcode"));
const config_1 = __importDefault(require("../../app/config"));
const commonModel_1 = __importDefault(require("../../models/commonModel/commonModel"));
const constants_1 = require("../miscellaneous/constants");
class Lib {
    static sendEmailDefault(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, emailBody, emailSub, attachments, cc, }) {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    port: 465,
                    auth: {
                        user: config_1.default.EMAIL_SEND_EMAIL_ID,
                        pass: config_1.default.EMAIL_SEND_PASSWORD,
                    },
                });
                const info = yield transporter.sendMail({
                    from: `Asian Tourism Fair <${config_1.default.EMAIL_SEND_EMAIL_ID}>`,
                    cc,
                    to: email,
                    subject: emailSub,
                    html: emailBody,
                    attachments: attachments || undefined,
                });
                console.log("Message send: %s", info);
                return true;
            }
            catch (err) {
                console.log({ err });
                return false;
            }
        });
    }
    static generateHtmlToPdfBuffer(html) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch({
                headless: true,
                executablePath: "/snap/bin/chromium",
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            try {
                const page = yield browser.newPage();
                yield page.setViewport({ width: 1280, height: 800 });
                yield page.setContent(html, {
                    waitUntil: ["load", "domcontentloaded", "networkidle0"],
                });
                const pdfUint8Array = yield page.pdf({
                    format: "A4",
                    printBackground: true,
                });
                return Buffer.from(pdfUint8Array);
            }
            finally {
                yield browser.close();
            }
        });
    }
    static generateQRCode(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield qrcode_1.default.toDataURL(text, {
                    errorCorrectionLevel: "H",
                    margin: 2,
                    width: 200,
                    color: {
                        dark: "#000000",
                        light: "#ffffff",
                    },
                });
            }
            catch (err) {
                console.error("Failed to generate QR code", err);
                throw err;
            }
        });
    }
    static dataURLtoBuffer(dataURL) {
        const base64Data = dataURL.split(",")[1];
        return Buffer.from(base64Data, "base64");
    }
    // Create hash string
    static hashValue(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            return yield bcryptjs_1.default.hash(password, salt);
        });
    }
    // JSON safe parse
    static safeParseJSON(payload) {
        try {
            if (typeof payload === "string") {
                return JSON.parse(payload);
            }
            else {
                return payload;
            }
        }
        catch (err) {
            return payload;
        }
    }
    // remainingRetrySeconds
    static remainingRetrySeconds(date, seconds = 60) {
        const createdAt = new Date(date).getTime();
        return Math.max(seconds - Math.floor((Date.now() - createdAt) / 1000), 0);
    }
    // verify hash string
    static compareHashValue(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, hashedPassword);
        });
    }
    // create token
    static createToken(payload, secret, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    }
    // verify token
    static verifyToken(token, secret) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            return false;
        }
    }
    // generate random Number
    static otpGenNumber(length) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let otp = "";
        for (let i = 0; i < length; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            otp += numbers[randomNumber];
        }
        return otp;
    }
    // compare object
    static compareObj(a, b) {
        return JSON.stringify(a) == JSON.stringify(b);
    }
    //get total amount after adding percentage
    static getPaymentAmount(storeAmount, percentage) {
        return storeAmount / (1 - percentage / 100);
    }
    // Write file
    static writeJsonFile(name, data) {
        const reqFilePath = path_1.default.join(`json/${name}.json`);
        fs_1.default.writeFile(reqFilePath, JSON.stringify(data, null, 4), (err) => {
            if (err) {
                console.error("Error writing to file:", err);
            }
            else {
                console.log("JSON data has been written to", reqFilePath);
            }
        });
        // Write response in json data file======================
    }
    // generate Random pass
    static generateRandomPassword(length) {
        const letters = `abc+[]{}|;depqrstuvwxyzABCDEFGH!@#$%^&*()_:',.<>?/IJKLMNOPQRSTUVWXYZ01234fghijklmno56789`;
        let randomNums = "";
        for (let i = 0; i < length; i++) {
            const randomNumber = Math.floor(Math.random() * letters.length);
            randomNums += letters[randomNumber];
        }
        return randomNums;
    }
    //remove country code from phone number
    static removeCountryCodeFromPhoneNumber(phone) {
        if (phone.startsWith("0") && phone.length === 11) {
            return phone.slice(1); // Remove the first '0'
        }
        else if (phone.startsWith("+880")) {
            return phone.slice(4); // Remove the '+880'
        }
        else if (phone.startsWith("880")) {
            return phone.slice(3); // Remove the '880'
        }
        else {
            return phone; // Return the whole phone number if none of the conditions are met
        }
    }
    static generateUsername(full_name) {
        const newName = full_name.split(" ").join("");
        return newName.toLowerCase();
    }
    static generateNo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ trx, type }) {
            let newId = 10001;
            const currYear = new Date().getFullYear();
            const commonModel = new commonModel_1.default(trx);
            let NoCode = "";
            const lastId = yield commonModel.getLastId({ type });
            if (lastId) {
                newId = Number(lastId.last_id) + 1;
                yield commonModel.updateLastNo({ last_id: newId, last_updated: new Date() }, lastId === null || lastId === void 0 ? void 0 : lastId.id);
            }
            else {
                yield commonModel.insertLastNo({
                    last_id: newId,
                    last_updated: new Date(),
                    type,
                });
            }
            switch (type) {
                case constants_1.GENERATE_AUTO_UNIQUE_ID.VISITOR:
                    NoCode = "IN";
                    break;
                    break;
                default:
                    break;
            }
            return "AS" + NoCode + currYear + newId;
        });
    }
}
Lib.gibberishChecker = (value) => {
    var _a;
    const word = value.trim();
    // Must contain at least one vowel
    if (!/[aeioauEIOU]/.test(word))
        return true;
    // Avoid long nonsense strings
    if (word.length > 20)
        return true;
    // Reject excessive repeated characters
    if (/(.)\1{2,}/.test(word))
        return true;
    // Reject repeated substrings like 'asdfasdf'
    const half = Math.floor(word.length / 2);
    const firstHalf = word.slice(0, half);
    const secondHalf = word.slice(half);
    if (firstHalf === secondHalf && firstHalf.length > 2)
        return true;
    // Vowel/consonant ratio check: require at least 1 vowel per 4 letters
    const vowels = ((_a = word.match(/[aeiou]/gi)) === null || _a === void 0 ? void 0 : _a.length) || 0;
    const ratio = vowels / word.length;
    if (ratio < 0.2)
        return true;
    return false;
};
exports.default = Lib;
