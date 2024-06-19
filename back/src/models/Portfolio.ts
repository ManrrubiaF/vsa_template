import { DataType, Table, Column, Model } from "sequelize-typescript";
import 'reflect-metadata';

@Table
export class Portfolio extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    id!: number;
    @Column({type: 'text'})
    description!: string;
    @Column(DataType.ARRAY(DataType.STRING))
    links!: string[]
}