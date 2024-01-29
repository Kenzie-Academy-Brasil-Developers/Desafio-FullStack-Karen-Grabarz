import { Request, Response } from "express";

import crypto from "crypto";
import { TClient, TClientCreate, TClientResponse, TClientUpdate } from "../interfaces/clients.interfaces";
import { AppDataSource } from "../data-source";
import { Client } from "../entities/client.entity";
import { AppError } from "../errors/AppError";
import { hash } from "bcryptjs";
import { clientSchemaResponse, clientUpdateSchema, clientsArraySchema } from "../schemas/clients.schemas";

export class ClientService {
    async createClient(data:TClientCreate): Promise<TClientResponse>{
        const { email, name, password, telefone } = data
        const clientRepository = AppDataSource.getRepository(Client)
        const foundClient = await clientRepository.findOne({
            where: {
                email
            }
        })

        if (foundClient) {
            throw new AppError(409,"Email already exists")
        }

        const hashedPassword = await hash(password, 10)
        const client = clientRepository.create({
            name, email, password: hashedPassword, telefone
        })
        await clientRepository.save(client)
        return clientSchemaResponse.parse(client)
    }
    async readClients(){
        const clientRepository = AppDataSource.getRepository(Client)
        const clients = await clientRepository.find()
        return clientsArraySchema.parse(clients)
    }
    async retriveClient(clientId:string) {
        const clientRepository = AppDataSource.getRepository(Client)
        const foundClient = await clientRepository.findOne({
            where: {id:clientId}
        })
        if(!foundClient){
            throw new AppError(404,'Client not found')
        }
        return clientSchemaResponse.parse(foundClient) 
    }
    async updateClient(clientId:string, data:TClientUpdate):Promise<any> {
        const clientRepository = AppDataSource.getRepository(Client)
        const foundClient = await clientRepository.findOne({
            where: {id:clientId}
        })
        if(!foundClient){
            throw new AppError(404,'Client not found')
        }
        if(data.password){
            const hashedPassword = await hash(data.password, 10)
            data.password = hashedPassword
        }

        const updateClient = clientRepository.create({
            ...foundClient,
            ...data,

        })
        await clientRepository.save(updateClient)
        return clientSchemaResponse.parse(updateClient)
    }
    async deleteClient(clientId:string):Promise<void> {
        const clientRepository = AppDataSource.getRepository(Client)
        const foundClient = await clientRepository.findOne({
            where: {id:clientId}
        })
        if(!foundClient){
            throw new AppError(404,'Client not found')
        }
        await clientRepository.remove(foundClient)
        return 
    }
}

