import { app } from "../../../../app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { userDTO } from "../../dtos/userDTO";

let connection: Connection;

describe("User Authenticate", () => {

    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send(userDTO);
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a token user", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: userDTO.email,
            password: userDTO.password
        });

        expect(response.body).toHaveProperty("token");
    });

    it("should be able to create a token user, incorrect email", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email:"",
            password: userDTO.password
        });

        expect(response.status).toBe(401);
    });

    it("should be able to create a token user, incorrect password", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email:userDTO.email,
            password: ""
        });

        expect(response.status).toBe(401);
    });

});