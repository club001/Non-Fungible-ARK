export interface Transaction {
  description: string,
  hash: string,
  receipt?: any,
}

export interface TransactionsMap {
  [key: string]: Transaction
}