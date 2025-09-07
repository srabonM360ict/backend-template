"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN_TOKEN_EXPIRES_IN = exports.USER_STATUS = exports.PAYMENT_GATEWAYS = exports.USER_TYPE = exports.GENERATE_AUTO_UNIQUE_ID = exports.SOURCE_EXTERNAL = exports.SOURCE_EXHIBITOR = exports.SOURCE_VISITOR = exports.ERROR_LEVEL_CRITICAL = exports.ERROR_LEVEL_ERROR = exports.ERROR_LEVEL_WARNING = exports.ERROR_LEVEL_INFO = exports.ERROR_LEVEL_DEBUG = exports.OTP_DEFAULT_EXPIRY = exports.DATA_LIMIT = exports.OTP_EMAIL_SUBJECT = exports.PROJECT_ADDRESS = exports.PROJECT_NUMBER = exports.PROJECT_EMAIL = exports.PROJECT_ICON = exports.PROJECT_LOGO = exports.PROJECT_NAME = exports.origin = void 0;
exports.origin = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://10.10.220.46:3000",
    "http://10.10.220.46:3001",
    "http://10.10.220.46:3002",
    "http://10.10.220.46:3004",
    "http://localhost:5001",
    "https://main.d2n94jltgh2sdu.amplifyapp.com",
    "https://www.main.d2n94jltgh2sdu.amplifyapp.com",
];
//Project Info
exports.PROJECT_NAME = "Asian Tourism Fair";
exports.PROJECT_LOGO = "";
("https://m360ict-data.s3.ap-south-1.amazonaws.com/asian-tourism-fair-fair/main/asian-tourism-fair-fair_logo.png");
exports.PROJECT_ICON = "https://m360ict-data.s3.ap-south-1.amazonaws.com/asian-tourism-fair-fair/main/asian-tourism-fair-fair_icon.png";
exports.PROJECT_EMAIL = "asiantourismfair@yopmail.com";
exports.PROJECT_NUMBER = "+880 1752798373";
exports.PROJECT_ADDRESS = "House # 59, Road # 7, Block # H, Banani, Dhaka-1212";
// Email subject
exports.OTP_EMAIL_SUBJECT = "Your One Time Password For Verification";
// Default data get limit
exports.DATA_LIMIT = 100;
exports.OTP_DEFAULT_EXPIRY = 15;
//error logs level
exports.ERROR_LEVEL_DEBUG = "DEBUG";
exports.ERROR_LEVEL_INFO = "INFO";
exports.ERROR_LEVEL_WARNING = "WARNING";
exports.ERROR_LEVEL_ERROR = "ERROR";
exports.ERROR_LEVEL_CRITICAL = "CRITICAL";
//panel source
exports.SOURCE_VISITOR = "VISITOR";
exports.SOURCE_EXHIBITOR = "EXHIBITOR";
exports.SOURCE_EXTERNAL = "EXTERNAL";
//generate auto unique id
exports.GENERATE_AUTO_UNIQUE_ID = {
    VISITOR: "visitor",
};
//user type
exports.USER_TYPE = {
    VISITOR: "visitor",
    EXHIBITOR: "exhibitor",
};
//payment gateways
exports.PAYMENT_GATEWAYS = {
    SSL: "SSL",
};
// user status
exports.USER_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BLOCKED: "blocked",
};
//Login Expiry
exports.LOGIN_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days
