import pug from 'pug';
import nodemailer from 'nodemailer';
import * as html2text from 'html-to-text';

export default class Email {
  constructor(user, data = {}) {
    this.from = 'Monekt <auth@monekt.com>';
    this.data = data;
    this.to = user.email;
  }

  #createNewTransport() {
    const env = process.env.NODE_ENV.trim();
    if (env === 'development') {
      return nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 25,
        auth: {
          user: '3529206228a76d',
          pass: '9188059d0957d3',
        },
      });
    }
    if (env === 'production')
      return nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
          user: process.env.MAILER_AUTH_USER,
          pass: process.env.MAILER_AUTH_PASS,
        },
      });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        data: { ...this.data, subject },
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html2text.htmlToText(html),
    };
    return await this.#createNewTransport().sendMail(mailOptions);
  }
}
