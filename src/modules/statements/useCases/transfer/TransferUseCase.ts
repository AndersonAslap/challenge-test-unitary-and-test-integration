import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { Statement } from "modules/statements/entities/Statement";

interface IRequest {
    sender_id: string;
    user_id: string;
    amount: number;
    description: string;
}

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

@injectable()
class TransferUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository : IUsersRepository,

        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository
    ) {}

    async execute({
        sender_id,
        user_id,
        amount,
        description
    } : IRequest) : Promise<Statement> {

        const sender_user = await this.usersRepository.findById(sender_id);

        if (!sender_user) {
            throw new Error("Sender user does not exists!");
        }

        const balanceUser = await this.statementsRepository.getUserBalance({user_id});

        if (balanceUser.balance < amount) {
            throw new Error("balance user insuficients!");
        }

        const statement = await this.statementsRepository.create({
            user_id,
            description,
            amount,
            type: OperationType.TRANSFER,
            sender_id
        });

        return statement;

    }
}

export { TransferUseCase }