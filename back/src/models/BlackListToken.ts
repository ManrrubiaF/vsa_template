import { Table, Column, Model } from "sequelize-typescript";
import 'reflect-metadata';

@Table
export class BlackListToken extends Model {
    @Column({ primaryKey:true, autoIncrement: true})
    id!: number;
    @Column({ type: 'text' })
    token!:string;
}