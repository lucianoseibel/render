import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { availableParallelism } from "os";
import { REPL_MODE_SLOPPY } from "repl";
import { z } from "zod";

const app = fastify()

const prisma = new PrismaClient()

app.get('/users', async () => {
    const users = await prisma.user.findMany()

    return {users}
})

app.post('/users', async (request, reply) => {

    const createdUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
    })

    const { name, email} = createdUserSchema.parse(request.body)

    await prisma.user.create({
        data: {
            name,
            email,
        }
    })

    return reply.status(201)
})

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('HTTP SERVER running at 3333')
})