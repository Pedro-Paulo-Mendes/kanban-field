import { Module } from '@nestjs/common';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [ColumnsModule, CardsModule],
})
export class AppModule {}
