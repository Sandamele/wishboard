export const otpEmailTemplate = (otp, title, heading, subHeading) => {
    const date = new Date();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f7fa;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .container {
    max-width: 480px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    padding: 40px 30px;
    text-align: center;
  }
  h1 {
    color: #333333;
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 10px;
  }
  p {
    color: #555555;
    font-size: 16px;
    line-height: 1.5;
    margin-top: 0;
    margin-bottom: 24px;
  }
  .otp-code {
    display: inline-block;
    background-color: #e0f4ff;
    color: #007bff;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 8px;
    padding: 14px 28px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,123,255,0.2);
    user-select: all;
    margin: 20px auto;
  }
  .note {
    font-size: 13px;
    color: #999999;
    margin-top: 30px;
  }
  .footer {
    margin-top: 40px;
    font-size: 12px;
    color: #bbbbbb;
  }
  @media (max-width: 500px) {
    .container {
      margin: 20px 15px;
      padding: 30px 20px;
    }
    .otp-code {
      font-size: 28px;
      padding: 12px 20px;
      letter-spacing: 6px;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <h1>${heading}</h1>
    <p>${subHeading}</p>
    <div class="otp-code">${otp}</div>
    <p class="note">If you did not request this, please ignore this email.</p>
    <div class="footer">
      &copy; ${date.getFullYear()} Wishboard. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};
