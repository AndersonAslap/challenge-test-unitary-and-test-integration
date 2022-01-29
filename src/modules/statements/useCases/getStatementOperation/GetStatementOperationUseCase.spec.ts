import { createDepositStatementDTO } from "../../dtos/index";
import { userDTO } from "../../../users/dtos/userDTO";
import { User } from "../../../users/entities/User";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepositoryInMemory : InMemoryStatementsRepository;
let usersRepositoryInMemory : InMemoryUsersRepository;

let getStatementOperationUseCase : GetStatementOperationUseCase;
let createUserUseCase : CreateUserUseCase;
let createStatementUseCase : CreateStatementUseCase;

let user: User;

describe("Statements", () => {
    beforeEach(async () => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();

        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);

        user = await createUserUseCase.execute(userDTO);
    });

    it("should be able get statement", async () => {
        const statement = await createStatementUseCase.execute({...createDepositStatementDTO, user_id: user.id});
        const getStatement = await getStatementOperationUseCase.execute({user_id:user.id, statement_id:statement.id});

        expect(getStatement).toHaveProperty("id");
    });


    it("should be able get statement error user not found", () => {
        expect(async () => {   
            const statement = await createStatementUseCase.execute({...createDepositStatementDTO, user_id: user.id});
            await getStatementOperationUseCase.execute({user_id:"", statement_id:statement.id});
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it("should be able get statement error statement not found", () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({user_id:user.id, statement_id:""});
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });

});