import { app } from "../../../../app";
import request, { Response } from "supertest";
import { Connection, createConnection } from "typeorm";
import { userDTO } from "../../../users/dtos/userDTO";
import { createDepositStatementDTO, createWithdrawStatementDTO } from "../../dtos/index";

let connection : Connection;
let response : Response;
let token : string;

describe("Create Statement Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send(userDTO);

        const { body } = await request(app).post("/api/v1/sessions").send(userDTO);
        token = body.token;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should not be able to create a deposit statement because token invalid", async () => {
        response = await request(app)
        .post("/api/v1/statements/deposit")
        .send(createDepositStatementDTO)
        .set({ Authorization: `Bearer tokenInvalid` });

        expect(response.status).toBe(401);
    });

    it("should not be able to create a withdraw statement because Insufficient funds", async () => {
        response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send(createWithdrawStatementDTO)
        .set({ Authorization: `Bearer ${token}` });

        expect(response.status).toBe(400);
    });

    it("should be able to create a deposit statement", async () => {
        response = await request(app)
        .post("/api/v1/statements/deposit")
        .send(createDepositStatementDTO)
        .set({ Authorization: `Bearer ${token}` });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("amount", createDepositStatementDTO.amount);
    });

    it("should be able to create a withdraw statement", async () => {
        response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send(createWithdrawStatementDTO)
        .set({ Authorization: `Bearer ${token}` });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("amount", createWithdrawStatementDTO.amount);
    });

});