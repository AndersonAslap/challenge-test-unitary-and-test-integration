import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory : InMemoryUsersRepository;
let statementsRepositoryInMemory : InMemoryStatementsRepository;
let getBalanceUseCase : GetBalanceUseCase;

describe("Balance", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();

        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    })

    it("should be able get balance", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "anderson",
            email: "anderson2021@gmail.com",
            password: "564565"
        });

        const statementObject : ICreateStatementDTO= {
            user_id: user.id,
            type: 'deposit',
            amount: 100,
            description: "Transferência pix"
        }

        await statementsRepositoryInMemory.create(statementObject);

        const balance = await getBalanceUseCase.execute({user_id:user.id});

        expect(balance).toHaveProperty("balance");

    })

    it("should be able not get balance because user not exists", () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id:"xxxx"});
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
})