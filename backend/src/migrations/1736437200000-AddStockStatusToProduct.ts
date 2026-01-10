import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStockStatusToProduct1736437200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('products', new TableColumn({
            name: 'stock_status',
            type: 'enum',
            enum: ['in_stock', 'out_of_stock', 'discontinued'],
            default: "'in_stock'",
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('products', 'stock_status');
    }
}
