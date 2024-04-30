import { DataType, Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './Product';
import 'reflect-metadata';


@Table
export class ProductDetail extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!:number;
  @Column({allowNull: true})
  color!: string;
  @Column
  stock!: number;
  @Column(DataType.ARRAY(DataType.STRING))
  size!:string[];
  @Column(DataType.ARRAY(DataType.STRING))
  image!: string[];

  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}
