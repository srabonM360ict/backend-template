export const origin: string[] = [
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
export const PROJECT_NAME = "Asian Tourism Fair";
export const PROJECT_LOGO = "";
("https://m360ict-data.s3.ap-south-1.amazonaws.com/asian-tourism-fair-fair/main/asian-tourism-fair-fair_logo.png");
export const PROJECT_ICON =
  "https://m360ict-data.s3.ap-south-1.amazonaws.com/asian-tourism-fair-fair/main/asian-tourism-fair-fair_icon.png";
export const PROJECT_EMAIL = "asiantourismfair@yopmail.com";
export const PROJECT_NUMBER = "+880 1752798373";
export const PROJECT_ADDRESS =
  "House # 59, Road # 7, Block # H, Banani, Dhaka-1212";

// Email subject
export const OTP_EMAIL_SUBJECT = "Your One Time Password For Verification";

// Default data get limit
export const DATA_LIMIT = 100;
export const OTP_DEFAULT_EXPIRY = 15;

//error logs level
export const ERROR_LEVEL_DEBUG = "DEBUG";
export const ERROR_LEVEL_INFO = "INFO";
export const ERROR_LEVEL_WARNING = "WARNING";
export const ERROR_LEVEL_ERROR = "ERROR";
export const ERROR_LEVEL_CRITICAL = "CRITICAL";

//panel source
export const SOURCE_VISITOR = "VISITOR" as const;
export const SOURCE_EXHIBITOR = "EXHIBITOR" as const;
export const SOURCE_EXTERNAL = "EXTERNAL" as const;

//generate auto unique id
export const GENERATE_AUTO_UNIQUE_ID = {
  VISITOR: "visitor",
} as const;

//user type
export const USER_TYPE = {
  VISITOR: "visitor",
  EXHIBITOR: "exhibitor",
} as const;

//payment gateways
export const PAYMENT_GATEWAYS = {
  SSL: "SSL",
};

// user status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  BLOCKED: "blocked",
} as const;

//Login Expiry
export const LOGIN_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days
