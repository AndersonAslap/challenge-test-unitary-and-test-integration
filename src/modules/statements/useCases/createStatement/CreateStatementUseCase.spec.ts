import { createDepositStatementDTO, createWithdrawStatementDTO } from "../../dtos/index";
import { userDTO } from "../../../users/dtos/userDTO";
import { User } from "../../../users/entities/User";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory : InMemoryUsersRepository;
let statementsRepositoryInMemory : InMemoryStatementsRepository;
let createStatementsUseCase : CreateStatementUseCase;
let createUserUseCase : CreateUserUseCase;

let user : User;

describe("Statements User", () => {
    beforeEach( async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementsUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

        user = await createUserUseCase.execute(userDTO);
    });

    it("should be able now create a withdraw because insufficient funds.", () => {
        expect(async () => {
            await createStatementsUseCase.execute({...createWithdrawStatementDTO, user_id:user.id});
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });

    it("should be able to create a deposit.", async () => {
        const statement = await createStatementsUseCase.execute({...createDepositStatementDTO, user_id:user.id});
        
        expect(statement).toHaveProperty("id");
    });

    it("should be able to create a withdraw.", async () => {
        await createStatementsUseCase.execute({...createDepositStatementDTO, user_id:user.id});
        const statement = await createStatementsUseCase.execute({...createWithdrawStatementDTO, user_id:user.id});

        expect(statement).toHaveProperty("id");
    });

});


