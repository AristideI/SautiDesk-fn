export interface IOTP {
  id: string;
  documentId: string;
  otp: string;
  createdAt: Date;
}

export interface ICreaterOTP {
  otp: string;
}
