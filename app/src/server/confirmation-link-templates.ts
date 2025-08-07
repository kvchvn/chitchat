type Args = {
  url: string;
  expiredIn: string;
};

export const ConfirmationLinkHTMLTemplate = ({ url, expiredIn }: Args) => `
<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your sign-in link</title>
  </head>
  <body
    style="
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    ">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #f7f7f7">
      <tr>
        <td align="center" style="padding: 30px 0">
          <img
            src="cid:favicon"
            alt="Chit-Chat logo"
            style="width: 100px; height: auto; display: block" />
        </td>
      </tr>
      <tr>
        <td
          style="
            background-color: #ffffff;
            padding: 40px 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          ">
          <h1 style="margin-top: 0; color: #2d3748; font-size: 24px; font-weight: 600">
            Your sign-in link
          </h1>
          <p style="font-size: 14px; color: #2d3748">
            Click the button below to sign in to Chit-Chat.
          </p>
          <p style="font-size: 14px; color: #2d3748">This link will expire in ${expiredIn}.</p>
          <a
            href="${url}"
            target="_blank"
            style="
              display: inline-block;
              margin: 30px 0;
              padding: 8px 32px;
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #ffffff;
              text-decoration: none;
              font-weight: 600;
              border-radius: 6px;
              background-color: #7dd3fc;
            "
            >Sign in</a
          >
          <p style="color: #718096; font-size: 14px">
            If you didn't request this link, please ignore this email.
          </p>
          <p style="color: #718096; font-size: 14px">Or copy this link to your browser:</p>
          <a
            href="${url}"
            target="_blank"
            style="color: #4f46e5; word-break: break-all; font-size: 14px"
            >
            ${url}
            </a
          >
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 25px 0; color: #718096; font-size: 13px">
          <p style="margin: 0">&copy; ${new Date().getFullYear()} Chit-Chat. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const ConfirmationLinkTextTemplate = ({ url, expiredIn }: Args) => `
Your sign-in link to Chit-Chat. Copy it to your browser:
${url}

This link will expire in ${expiredIn}.
If you didn't request this link, please ignore this email.
`;
