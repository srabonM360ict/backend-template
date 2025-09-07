"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeCompletedTemplate = void 0;
const constants_1 = require("../miscellaneous/constants");
const welcomeCompletedTemplate = (name, creds, TypeUser) => {
    const userTypeLabelMap = {
        [constants_1.USER_TYPE.VISITOR]: "Visitor",
        [constants_1.USER_TYPE.EXHIBITOR]: "Exhibitor",
    };
    const roleLabel = userTypeLabelMap[constants_1.USER_TYPE] || "users";
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome - ${name}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; margin: 0; padding: 0;">
      <tr>
        <td align="center" style="padding: 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="
              max-width: 400px;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border: 1px solid gray;
            ">
            <tr>
              <td align="center" style="padding: 20px;">
                <img
                  src="${constants_1.PROJECT_LOGO}"
                  alt="${constants_1.PROJECT_NAME}"
                  style="display: block; width: 80px; margin-bottom: 10px;"
                />
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 20px;">
                <h1 style="font-size: 19px; color: #000000; font-weight: normal; margin: 0 0 20px;">
                  Welcome, ${name}!
                </h1>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 20px 10px;">
                <p style="font-size: 14px; color: #555555; margin: 0 0 20px; line-height: 1.5;">
                  Your ${roleLabel} account has been created by the management.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 20px;">
                <p style="font-size: 12px; color: #7c7b7b; margin: 0; line-height: 1.5;">
                  <b>Login credentials:</b>
                </p>
                <p style="font-size: 12px; color: #7c7b7b; margin: 0; line-height: 1.5;">
                  <b>User ID:</b> ${creds.login_id}<br />
                  <b>Password:</b> ${creds.password}
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 20px 20px;">
                <p style="font-size: 12px; color: #7c7b7b; margin: 0; line-height: 1.5;">
                  This login link is valid for 24 hours. Please keep your credentials secure.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
       <tr>
        <td align="center" style="padding: 15px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #555; margin: 5px 0;">
            Need help? Contact us at
            <a href="mailto:${constants_1.PROJECT_EMAIL}" style="color: #0073e6; text-decoration: none;">
              ${constants_1.PROJECT_EMAIL}
            </a>
          </p>
          <p style="font-size: 11px; color: #888; margin: 5px 0;">
            Developed by <b><a href="https://m360ict.com" target="_blank">M360ICT</a></b>
          </p>
          <p style="font-size: 11px; color: #888; margin: 5px 0;">
            © ${new Date().getFullYear()} ${constants_1.PROJECT_NAME}. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};
exports.welcomeCompletedTemplate = welcomeCompletedTemplate;
