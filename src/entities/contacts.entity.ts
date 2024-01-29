import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Client } from "./client.entity";


@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string

    @Column()
    telefone: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(()=>Client)
    client: Client
    
}