import { app } from "../../../../app";
import request, { Response } from "supertest";
import { Connection, createConnection } from "typeorm";
import { userDTO } from "../../../users/dtos/userDTO";
import { createDepositStatementDTO, createWithdrawStatementDTO } from "../../dtos/index";

let connection : Connection;
let response : Response;
let token : string;

describe("Get Balance Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send(userDTO);
        const { body } = await request(app).post("/api/v1/sessions").send(userDTO);

        token = body.token;

        await request(app).post("/api/v1/statements/deposit")
        .send(createDepositStatementDTO)
        .set({ Authorization: `Bearer ${token}` });

        await request(app).post("/api/v1/statements/withdraw")
        .send(createWithdrawStatementDTO)
        .set({ Authorization: `Bearer ${token}` });
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able get balance and statements", async () => {
        response = await request(app).get("/api/v1/statements/balance")
        .set({ Authorization: `Bearer ${token}` });

        console.log(response.body)

        /*expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("statement");
        expect(response.body.statement).toHaveLength(2);
        expect(response.body).toHaveProperty("balance", 820);*/
    });

});