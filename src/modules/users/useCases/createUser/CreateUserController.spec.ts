import { app } from "../../../../app";
import { Connection, createConnection } from "typeorm";
import request from "supertest";

let connection : Connection;

describe("Create User", () => {

    beforeAll(async () => {
        connection = await createConnection();
        connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new user", async () => {

        const response = await request(app)
            .post("/api/v1/users")
            .send({
                name: "Anderson",
                email:"admin3@ignite.com.br",
                password: "123456"
            });

        expect(response.status).toBe(201)
    });

    
});