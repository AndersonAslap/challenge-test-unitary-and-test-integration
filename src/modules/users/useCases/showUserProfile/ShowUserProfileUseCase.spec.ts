import { User } from "modules/users/entities/User";
import { userDTO } from "../../dtos/userDTO";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase : ShowUserProfileUseCase;
let usersRepositories : InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;
let user : User;

describe("Show user profile", () => {
    beforeEach(async () => {
        usersRepositories = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositories);
        createUserUseCase = new CreateUserUseCase(usersRepositories);
    
        user = await createUserUseCase.execute(userDTO);
    });

    it("should be able to show user profile.", async () => {
        const userProfile = await showUserProfileUseCase.execute(user.id)

        expect(userProfile).toHaveProperty("id", userProfile.id);
    });

    it("should be able to no show user profile.", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("")
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    });
});