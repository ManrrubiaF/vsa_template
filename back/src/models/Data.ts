import { DataType, Table, Column, Model } from 'sequelize-typescript';
import 'reflect-metadata';


@Table
export class Data extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
    @Column({ type: 'text' })
    aboutText!:string;
    @Column(DataType.ARRAY(DataType.STRING))
    videos!:string[];
    @Column(DataType.ARRAY(DataType.STRING))
    photos!:string[];
    @Column(DataType.BIGINT)
    phone!:number;
    @Column(DataType.BIGINT)
    whatsapp!:number;
    @Column
    email!:string;
    @Column(DataType.ARRAY(DataType.STRING))
    socialLinks!: string[];
    
}
   
