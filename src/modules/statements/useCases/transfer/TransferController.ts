import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferUseCase } from "./TransferUseCase";

class TransferController {
    async handle(request: Request, response: Response) : Promise<Response> {
        const { user_id : sender_id } = request.params;
        const { id: user_id  } = request.user;
        const { amount, description } = request.body;

        let transferUseCase = container.resolve(TransferUseCase);

        const statement = await transferUseCase.execute({sender_id, user_id, amount, description});
        
        return response.json(statement);
    }
}

export { TransferController }