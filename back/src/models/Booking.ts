import { DataType, BelongsTo, ForeignKey, Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { User } from './User';
import 'reflect-metadata';



@Table({paranoid:true})
export class Booking extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
    @ForeignKey(() => User)
    @Column
    userId!: number;
    @Column
    userName!: string;
    @BelongsTo(()=> User)
    user!: User;
    @Column(DataType.JSONB)
    details!: {
        productId: number;
        color:string | null;
        stock:number;
        size:string | null;
    };
    @CreatedAt
    createdAt!: Date;
    @UpdatedAt
    updatedAt!: Date;
    @DeletedAt
    deletedAt!: Date; 
}

