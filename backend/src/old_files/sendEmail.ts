import * as nodemailer from "nodemailer";
function sendEmailNotification(
  toEmail: string,
  subject: string,
  text: string
): void {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourEmail@gmail.com",
      pass: "yourPassword",
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: "yourEmail@gmail.com",
    to: toEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Usage example
sendEmailNotification(
  "recipient@example.com",
  "Test Subject",
  "This is a test email."
);
