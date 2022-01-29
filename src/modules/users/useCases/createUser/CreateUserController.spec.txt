import { app } from "../../../../app";
import { Connection, createConnection } from "typeorm";
import request, { Response } from "supertest";
import { userDTO } from "../../dtos/userDTO";

let connection : Connection;
let response : Response;

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
        response = await request(app).post("/api/v1/users").send(userDTO);
        
        expect(response.status).toBe(201);
    });

    it("should not be able create a new user", async () => {
        await request(app).post("/api/v1/users").send(userDTO);
        
        response = await request(app).post("/api/v1/users").send(userDTO);

        expect(response.status).toBe(400);
    });

});