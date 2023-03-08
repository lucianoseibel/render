import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify()

const prisma = new PrismaClient()

app.get('/users', async () => {
    const users = await prisma.user.findMany()

    return {users}
})

app.post('/users', async (request, response) => {

    const createdUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
    })

    const { name, email} = createdUserSchema.parse(request.body)

    console.log(request.body)
    console.log(name,email)

    await prisma.user.create({
        data: {
            name,
            email,
        }
    })

    console.log('after')

    response.status(201)

    console.log('final')
})

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('HTTP SERVER running at 3333')
})