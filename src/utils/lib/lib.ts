import bcrypt from "bcryptjs";
import * as admin from "firebase-admin";
import fs from "fs";
import jwt, { SignOptions } from "jsonwebtoken";
import { Knex } from "knex";
import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
import path from "path";
import puppeteer from "puppeteer";
import QRCode from "qrcode";
import config from "../../app/config";
import {
  TDB,
  TypeUser,
} from "../../features/public/utils/types/publicCommon.types";
import CommonModel from "../../models/commonModel/commonModel";
import { GENERATE_AUTO_UNIQUE_ID } from "../miscellaneous/constants";
class Lib {
  public static async sendEmailDefault({
    email,
    emailBody,
    emailSub,
    attachments,
    cc,
  }: {
    email: string;
    emailSub: string;
    emailBody: string;
    attachments?: Attachment[];
    cc?: string[];
  }) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: config.EMAIL_SEND_EMAIL_ID,
          pass: config.EMAIL_SEND_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: `BPI Management <${config.EMAIL_SEND_EMAIL_ID}>`,
        cc,
        to: email,
        subject: emailSub,
        html: emailBody,
        attachments: attachments || undefined,
      });

      console.log("Message send: %s", info);

      return true;
    } catch (err: any) {
      console.log({ err });
      return false;
    }
  }

  public static async generateHtmlToPdfBuffer(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/snap/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      await page.setContent(html, {
        waitUntil: ["load", "domcontentloaded", "networkidle0"],
      });

      const pdfUint8Array = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      return Buffer.from(pdfUint8Array);
    } finally {
      await browser.close();
    }
  }

  public static async generateQRCode(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 200,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    } catch (err) {
      console.error("Failed to generate QR code", err);
      throw err;
    }
  }

  public static dataURLtoBuffer(dataURL: string): Buffer {
    const base64Data = dataURL.split(",")[1];
    return Buffer.from(base64Data, "base64");
  }

  // Create hash string
  public static async hashValue(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // JSON safe parse
  public static safeParseJSON(payload: unknown) {
    try {
      if (typeof payload === "string") {
        return JSON.parse(payload);
      } else {
        return payload;
      }
    } catch (err) {
      return payload;
    }
  }

  // remainingRetrySeconds
  public static remainingRetrySeconds(
    date: Date,
    seconds: number = 60
  ): number {
    const createdAt = new Date(date).getTime();
    return Math.max(seconds - Math.floor((Date.now() - createdAt) / 1000), 0);
  }

  // verify hash string
  public static async compareHashValue(
    password: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // create token
  public static createToken(
    payload: object,
    secret: string,
    expiresIn: SignOptions["expiresIn"]
  ) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  // verify token
  public static verifyToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return false;
    }
  }

  // generate random Number
  public static otpGenNumber(length: number) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let otp = "";

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * 10);

      otp += numbers[randomNumber];
    }

    return otp;
  }

  // compare object
  public static compareObj(a: any, b: any) {
    return JSON.stringify(a) == JSON.stringify(b);
  }

  //get total amount after adding percentage
  public static getPaymentAmount(storeAmount: number, percentage: number) {
    return storeAmount / (1 - percentage / 100);
  }

  // Write file
  public static writeJsonFile(name: string, data: any) {
    const reqFilePath = path.join(`json/${name}.json`);

    fs.writeFile(reqFilePath, JSON.stringify(data, null, 4), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("JSON data has been written to", reqFilePath);
      }
    });
    // Write response in json data file======================
  }

  // generate Random pass
  public static generateRandomPassword(length: number) {
    const letters = `abc+[]{}|;depqrstuvwxyzABCDEFGH!@#$%^&*()_:',.<>?/IJKLMNOPQRSTUVWXYZ01234fghijklmno56789`;

    let randomNums = "";

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * letters.length);

      randomNums += letters[randomNumber];
    }

    return randomNums;
  }

  //remove country code from phone number
  public static removeCountryCodeFromPhoneNumber(phone: string) {
    if (phone.startsWith("0") && phone.length === 11) {
      return phone.slice(1); // Remove the first '0'
    } else if (phone.startsWith("+880")) {
      return phone.slice(4); // Remove the '+880'
    } else if (phone.startsWith("880")) {
      return phone.slice(3); // Remove the '880'
    } else {
      return phone; // Return the whole phone number if none of the conditions are met
    }
  }

  public static generateUsername(full_name: string) {
    const newName = full_name.split(" ").join("");
    return newName.toLowerCase();
  }

  public static async generateNo({ trx, type }: IGenNoParams) {
    let newId = 10001;
    const currYear = new Date().getFullYear();
    const commonModel = new CommonModel(trx);
    let NoCode = "";

    const lastId = await commonModel.getLastId({ type });

    if (lastId) {
      newId = Number(lastId.last_id) + 1;
      await commonModel.updateLastNo(
        { last_id: newId, last_updated: new Date() },
        lastId?.id
      );
    } else {
      await commonModel.insertLastNo({
        last_id: newId,
        last_updated: new Date(),
        type,
      });
    }

    switch (type) {
      case GENERATE_AUTO_UNIQUE_ID.VISITOR:
        NoCode = "IN";
        break;

        break;
      default:
        break;
    }

    return "AS" + NoCode + currYear + newId;
  }

  public static gibberishChecker = (value: string): boolean => {
    const word = value.trim();

    // Must contain at least one vowel
    if (!/[aeioauEIOU]/.test(word)) return true;

    // Avoid long nonsense strings
    if (word.length > 20) return true;

    // Reject excessive repeated characters
    if (/(.)\1{2,}/.test(word)) return true;

    // Reject repeated substrings like 'asdfasdf'
    const half = Math.floor(word.length / 2);
    const firstHalf = word.slice(0, half);
    const secondHalf = word.slice(half);
    if (firstHalf === secondHalf && firstHalf.length > 2) return true;

    // Vowel/consonant ratio check: require at least 1 vowel per 4 letters
    const vowels = word.match(/[aeiou]/gi)?.length || 0;
    const ratio = vowels / word.length;
    if (ratio < 0.2) return true;

    return false;
  };

  public static async sendNotificationToMobile(params: {
    to: string;
    title: string;
    content: string;
    data?: any;
  }) {
    try {
      const serviceAccountPath = path.join(__dirname, "../../../fcm.json");
      const serviceAccount = await Lib.safeParseJSON(
        fs.readFileSync(serviceAccountPath, "utf-8")
      );
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            ...(serviceAccount as admin.ServiceAccount),
            privateKey: config.PRIVATE_KEY,
          }),
        });
      }

      const { to, title, content, data } = params;
      const stringData = {} as Record<string, string>;
      for (const key in data || {}) {
        stringData[key] = String(data[key]);
      }
      const message = {
        token: to,
        notification: {
          title,
          body: content,
        },
        data: stringData,
      };

      const response = await admin.messaging().send(message);
      console.log("Notification sent successfully userID:", to);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  public static async generateLoginIdForTeacher({
    institute_code,
    db,
    userType,
    schema,
  }: {
    institute_code: string;
    db: Knex;
    userType: TypeUser;
    schema: string;
  }) {
    const year = new Date().getFullYear().toString().slice(-2);

    const lastUser = await db("users")
      .withSchema(schema)
      .whereRaw("split_part(login_id, '.', 1) = ?", [institute_code])
      .andWhere("user_type", userType)
      .andWhereRaw("split_part(login_id, '.', 2) = ?", [year])
      .orderByRaw("CAST(split_part(login_id, '.', 3) AS INTEGER) DESC")
      .first();

    let nextSerial = 1001;
    if (lastUser && lastUser.login_id) {
      const lastSerial = parseInt(lastUser.login_id.split(".")[2], 10);
      nextSerial = lastSerial + 1;
    }

    const randomNum = Math.floor(Math.random() * 9) + 1;

    return `${institute_code}.${year}.${nextSerial}${randomNum}`;
  }
  public static async generateLoginCodeForStudent({
    institute_code,
    db,
    userType,
    schema,
    dpt_code,
    sessionYear,
  }: {
    institute_code: string;
    db: Knex;
    userType: TypeUser;
    schema: string;
    dpt_code: number;
    sessionYear: string;
  }) {
    const lastUser = await db("users")
      .withSchema(schema)
      .where("is_deleted", false)
      .whereRaw("split_part(code, '.', 1) = ?", [institute_code])
      .andWhere("user_type", userType)
      .andWhereRaw("split_part(code, '.', 2) = ?", [sessionYear])
      .andWhereRaw("split_part(code, '.', 3) = ?", [dpt_code.toString()])
      .orderByRaw("CAST(split_part(code, '.', 4) AS INTEGER) DESC")
      .first();

    const generateRandom = Math.floor(Math.random() * 9) + 1;
    let nextSerial = 1001;
    if (lastUser && lastUser.code) {
      const lastSerial = parseInt(lastUser.code.split(".")[3].slice(0, -1), 10);
      nextSerial = lastSerial + 1;
    }

    return `${institute_code}.${sessionYear}.${dpt_code}.${nextSerial}${generateRandom}`;
  }
}

export default Lib;

interface IGenNoParams {
  trx: TDB;
  type: (typeof GENERATE_AUTO_UNIQUE_ID)[keyof typeof GENERATE_AUTO_UNIQUE_ID];
}
