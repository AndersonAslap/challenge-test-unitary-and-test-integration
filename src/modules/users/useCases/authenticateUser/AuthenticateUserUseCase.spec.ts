import { userDTO } from "../../dtos/userDTO";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory : InMemoryUsersRepository;
let authenticateUserUseCase : AuthenticateUserUseCase;
let createUserUseCase : CreateUserUseCase;

describe("User Profile", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        
        await createUserUseCase.execute(userDTO);
    });

    it("should be able to authenticate user", async () => {
        const response = await authenticateUserUseCase.execute({
            email: userDTO.email,
            password: userDTO.password
        });

        expect(response).toHaveProperty("token");
    })
})