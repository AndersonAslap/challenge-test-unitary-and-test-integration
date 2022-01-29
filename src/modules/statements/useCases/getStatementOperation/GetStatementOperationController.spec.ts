import { app } from "../../../../app";
import request, { Response } from "supertest";
import { Connection, createConnection } from "typeorm";
import { userDTO } from "../../../users/dtos/userDTO";
import { createDepositStatementDTO } from "../../dtos/index";

let connection : Connection;
let response : Response;
let token : string;
let statementId : string;

describe("Get Statement Operation Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send(userDTO);
        
        const { body } = await request(app).post("/api/v1/sessions").send({
            email: userDTO.email,
            password: userDTO.password
        });

        token = body.token;

        response = await request(app)
        .post("/api/v1/statements/deposit")
        .send(createDepositStatementDTO)
        .set({ Authorization: `Bearer ${token}` });

        statementId = response.body.id;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should not be able get statement deposit because user not found", async () => {
        response = await request(app)
        .get(`/api/v1/statements/${statementId}`)
        .set({ Authorization: `Bearer tokenInvalid` });

        expect(response.status).toBe(401);
    });

    it("should be able get statement deposit", async () => {
        response = await request(app)
        .get(`/api/v1/statements/${statementId}`)
        .set({ Authorization: `Bearer ${token}` });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("type", "deposit");
    });

});