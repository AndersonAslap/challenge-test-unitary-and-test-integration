
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory : InMemoryUsersRepository;
let authenticateUserUseCase : AuthenticateUserUseCase;

describe("User Profile", () => {


    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    });

    it("should be able to authenticate user", async () => {

        const user = await usersRepositoryInMemory.create({
            name:"anderson", 
            email:"anderson@gmail.com", 
            password: "123456"
        });

        const infoUserLogger = await authenticateUserUseCase.execute(
            {
                email: user.email,
                password: user.password
            }
        )

        console.log(infoUserLogger)
    })
})