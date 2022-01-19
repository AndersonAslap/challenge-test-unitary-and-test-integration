
import { hash } from "bcryptjs";
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

        let password = await hash("123456", 8);

        const user = await usersRepositoryInMemory.create({
            name:"anderson", 
            email:"anderson@gmail.com", 
            password: password
        });

        const infoUserLogger = await authenticateUserUseCase.execute(
            {
                email: user.email,
                password: "123456"
            }
        )

        expect(infoUserLogger).toHaveProperty("token")
    })
})