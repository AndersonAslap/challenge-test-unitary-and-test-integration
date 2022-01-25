import { app } from "../../../../app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;

describe("User Authenticate", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });


    it("should be able to create a token user", async () => {

        await request(app)
            .post("/api/v1/users")
            .send({
                name: "Anderson",
                email:"admin@ignite.com.br",
                password: "123456"
        });

        const responseToken = await request(app)
                                .post("/api/v1/sessions")
                                .send({
                                    email:"admin@ignite.com.br",
                                    password: "123456"
                                });

        expect(responseToken.body).toHaveProperty("token");

    });
});