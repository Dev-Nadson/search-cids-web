import z from "zod";
import "dotenv/config"

const env_schema = z.object({
    PORT: z.number().default(5000),
    BASE_URL: z.string().default("http://localhost:3333")
})

const env = env_schema.parse(process.env)

export { env }