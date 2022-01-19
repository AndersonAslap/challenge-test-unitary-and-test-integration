import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase : ShowUserProfileUseCase;
let showUserProfileRepository : InMemoryUsersRepository;

describe("Show user profile", () => {

    beforeEach(() => {
        showUserProfileRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(showUserProfileRepository)
    })

    it("should be able to show user profile.", async () => {

        let password = await hash("123456", 8);

        const user = await showUserProfileRepository.create({
            name:"anderson", 
            email:"anderson@gmail.com", 
            password: password
        });

        const userProfile = await showUserProfileUseCase.execute(user.id)

        expect(userProfile).toHaveProperty("id");

    })

    it("should be able to no show user profile.", async () => {

        expect(async () => {
            await showUserProfileUseCase.execute("xxx")
        }).rejects.toBeInstanceOf(ShowUserProfileError)

    })

})