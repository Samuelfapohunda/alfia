export enum TransactionStatus {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  PENDING = 'pending',
}

export enum TransactionPaymentTypeEnum {
  Wallet = 'wallet',
  Paystack = 'paystack',
}

export enum TransactionTypeEnum {
  Credit = 'credit',
  Debit = 'debit',
}
