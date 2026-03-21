import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '/../migrations/*{.ts,.js}')],
    synchronize: false,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
