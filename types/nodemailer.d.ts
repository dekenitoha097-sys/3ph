declare module 'nodemailer' {
  interface TransportOptions {
    service?: string;
    auth?: {
      user: string;
      pass: string;
    };
    [key: string]: any;
  }

  interface SendMailOptions {
    from?: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
    [key: string]: any;
  }

  interface Transporter {
    sendMail(options: SendMailOptions): Promise<any>;
    verify(): Promise<boolean>;
  }

  export function createTransport(options: TransportOptions): Transporter;
}
