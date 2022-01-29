import { createDepositStatementDTO } from "../../../statements/dtos/index";
import { userDTO } from "../../../users/dtos/userDTO";
import { User } from "../../../users/entities/User";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory : InMemoryUsersRepository;
let statementsRepositoryInMemory : InMemoryStatementsRepository;
let getBalanceUseCase : GetBalanceUseCase;
let createUserUseCase : CreateUserUseCase;
let createStatementUseCase : CreateStatementUseCase;

let user : User;

describe("Balance", () => {

    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);

        user = await createUserUseCase.execute(userDTO);
    });

    it("should be able get balance", async () => {
        await createStatementUseCase.execute({...createDepositStatementDTO, user_id: user.id});
        const balance = await getBalanceUseCase.execute({user_id:user.id});

        expect(balance).toHaveProperty("balance");
    });

    it("should be able not get balance because user not exists", () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id:""});
        }).rejects.toBeInstanceOf(GetBalanceError)
    });

});