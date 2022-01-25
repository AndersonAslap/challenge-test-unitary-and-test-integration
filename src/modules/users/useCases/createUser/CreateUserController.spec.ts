import { app } from "../../../../app";
import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { CreateUserError } from "./CreateUserError";

let connection : Connection;

describe("Create User", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
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

        expect(response.status).toBe(201);
    });

    it("should not be able create a new user", async () => {
        expect(async () => {
            
            await request(app)
            .post("/api/v1/users")
            .send({
                name: "Anderson 1",
                email:"admin3@ignite.com.br",
                password: "123456"
            });

            await request(app)
            .post("/api/v1/users")
            .send({
                name: "Anderson 2",
                email:"admin3@ignite.com.br",
                password: "123456"
            });
            
        }).rejects.toBeInstanceOf(CreateUserError);
    });

    
});