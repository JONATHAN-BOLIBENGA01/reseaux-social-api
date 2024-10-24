import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";



@Injectable()
export class MailerService {
  // configuration de la methode pour envoyer l'email
  private async transporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    return transport;
  }
  // methode pour envoyer l'eamil
  async sendingSingupConfirmation(userEmail) {
    (await this.transporter()).sendMail({
      from: "@appLocalhost.com",
      to: userEmail,
      subject: "Inscription",
      text: "<h3>confirmation inscription</h3>",
    });
  }

  async sendResetPasswordConfirmation(userEmail: string, url: string, code: string) {
    (
      await this.transporter()).sendMail({
      from: "@appLocalhost.com",
      to: userEmail,
      subject: "reset password",
        html: `
         <a href="${url}"> reset your password</a>
         <p>your code is : ${code}</p>
         <P>your password is expires in 10 minutes </p>
      `
    })
  }
}


