import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class transfersTable1644279189281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transfers",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "sender_id",
                        type: "uuid",
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 5,
                        scale: 2
                    },
                    {
                        name: "description",
                        type: "varchar"
                    },
                    {
                        name: "type",
                        type: "string"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropDatabase("transfers");
    }

}
