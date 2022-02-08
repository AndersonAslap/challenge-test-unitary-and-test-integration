import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO"

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

export const createDepositStatementDTO: ICreateStatementDTO = {
    user_id: null,
    type: OperationType.DEPOSIT,
    description: "Description Test Deposit",
    amount: 900,
}
  
export const createWithdrawStatementDTO: ICreateStatementDTO = {
    user_id: null,
    type: OperationType.WITHDRAW,
    description: "Description Test Withdraw",
    amount: 80,
}