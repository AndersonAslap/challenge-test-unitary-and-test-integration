import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepositoryInMemory : InMemoryStatementsRepository;
let usersRepositoryInMemory : InMemoryUsersRepository;
let getStatementOperationUseCase : GetStatementOperationUseCase;

describe("Statements", () => {

    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    })

    it("should be able get statement", async () => {

        const user = await usersRepositoryInMemory.create({
            name: "anderson",
            email: "anderson2021@gmail.com",
            password: "564565"
        });

        const statementObject : ICreateStatementDTO = {
            user_id: user.id,
            type: 'deposit',
            amount: 100,
            description: "Transferência pix"
        }

        const statement = await statementsRepositoryInMemory.create(statementObject);

        const getStatement = await getStatementOperationUseCase.execute({user_id:user.id, statement_id:statement.id});

        expect(getStatement).toHaveProperty("id");

    });


    it("should be able get statement error user not found", () => {
        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                name: "anderson",
                email: "anderson2021@gmail.com",
                password: "564565"
            });
    
            const statementObject : ICreateStatementDTO = {
                user_id: user.id,
                type: 'deposit',
                amount: 100,
                description: "Transferência pix"
            }
    
            const statement = await statementsRepositoryInMemory.create(statementObject);
    
            await getStatementOperationUseCase.execute({user_id:"123456", statement_id:statement.id});
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it("should be able get statement error statement not found", () => {
        expect(async () => {
            const user = await usersRepositoryInMemory.create({
                name: "anderson",
                email: "anderson2021@gmail.com",
                password: "564565"
            });
    
            const statementObject : ICreateStatementDTO = {
                user_id: user.id,
                type: 'deposit',
                amount: 100,
                description: "Transferência pix"
            }
    
            const statement = await statementsRepositoryInMemory.create(statementObject);
    
            await getStatementOperationUseCase.execute({user_id:user.id, statement_id:"123456"});
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })
})