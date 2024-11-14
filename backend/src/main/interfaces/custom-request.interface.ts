interface RequestInterface extends Request {
  custom: {
    tsStart: number;
    transactionId?: string;
  };
}

export type {
  RequestInterface
}