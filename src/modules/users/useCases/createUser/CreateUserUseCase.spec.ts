import { userDTO } from "../../dtos/userDTO";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    })

    it("should be able to create a new user.", async () => {
        const user = await createUserUseCase.execute(userDTO);

        expect(user).toHaveProperty("id");
    });

    it("should be able not create a user if user exists.", async () => {
        await createUserUseCase.execute(userDTO);

        expect(async () => {
            await createUserUseCase.execute(userDTO);
        }).rejects.toBeInstanceOf(CreateUserError);
    });
})