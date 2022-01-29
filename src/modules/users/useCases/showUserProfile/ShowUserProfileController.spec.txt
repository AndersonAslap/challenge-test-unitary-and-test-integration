import { app } from "../../../../app";
import request, { Response } from "supertest";
import { Connection, createConnection } from "typeorm";
import { userDTO } from "../../../users/dtos/userDTO";

let connection: Connection;
let response : Response;

describe("Show User Profile Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send(userDTO);

        response = await request(app).post("/api/v1/sessions").send({
            email: userDTO.email,
            password: userDTO.password
        });
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able show profile user", async () => {
        const { status, body } = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer `
        });

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "JWT invalid token!");
    });

    it("should be able show profile user", async () => {
        const { token } = response.body;

        const { status, body } = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`
        });

        expect(status).toBe(200);
        expect(body).toHaveProperty("id");
        expect(body).toHaveProperty("name", userDTO.name);
    });

});