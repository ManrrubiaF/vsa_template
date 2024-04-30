import { Table, HasMany, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { Booking } from './Booking';
import 'reflect-metadata';



@Table({paranoid:true})
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;
  @Column
  email!: string;
  @Column({allowNull: true})
  pass!:string;
  @Column
  name!:string;
  @Column
  lastName!:string;
  @Column({defaultValue:'normal'})
  access!:string;
  @CreatedAt
  createdAt!: Date;
  @UpdatedAt
  updatedAt!: Date;
  @DeletedAt
  deletedAt!: Date;

  @HasMany(() => Booking)
  Bookings!: Booking[];

}
