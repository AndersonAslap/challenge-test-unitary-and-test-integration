import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let usersRepositoryInMemory : InMemoryUsersRepository;
let statementsRepositoryInMemory : InMemoryStatementsRepository;
let createStatementsUseCase : CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}


describe("Statements User", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementsUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    })

    it("should be able to create a deposit.", async () => {
        
        const user = await usersRepositoryInMemory.create({
            name: "anderson",
            email: "anderson2021@gmail.com",
            password: "564565"
        });

        const statementObject : ICreateStatementDTO= {
            user_id: user.id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Transferência pix"
        }

        const statement = await createStatementsUseCase.execute(statementObject);

        expect(statement).toHaveProperty("id");

    })


    it("should be able to create a withdraw.", async () => {
        
        const user = await usersRepositoryInMemory.create({
            name: "anderson",
            email: "anderson2021@gmail.com",
            password: "564565"
        });

        const statementDeposit : ICreateStatementDTO= {
            user_id: user.id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Transferência pix"
        }

        await createStatementsUseCase.execute(statementDeposit);

        const statementWIthdraw : ICreateStatementDTO= {
            user_id: user.id,
            type: OperationType.DEPOSIT,
            amount: 10,
            description: "Pagamento amazon prime"
        }

        const statement = await createStatementsUseCase.execute(statementWIthdraw);

        expect(statement).toHaveProperty("id");

    })

    it("should be able now create a withdraw because insufficient funds.", () => {
        
        

        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                name: "anderson",
                email: "anderson2021@gmail.com",
                password: "564565"
            });
    
            const statementDeposit : ICreateStatementDTO = {
                user_id: user.id,
                type: OperationType.DEPOSIT,
                amount: 10,
                description: "Transferência pix"
            }
    
            await createStatementsUseCase.execute(statementDeposit);
    
            const statementWIthdraw : ICreateStatementDTO = {
                user_id: user.id,
                type: OperationType.WITHDRAW,
                amount: 100,
                description: "Pagamento amazon prime"
            }
    
            const statement = await createStatementsUseCase.execute(statementWIthdraw);

            console.log(statement)

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

    })

})


