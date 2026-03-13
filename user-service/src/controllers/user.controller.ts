import { registerSchema, loginSchema } from "../schemas/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { Request, Response } from "express";

export class UserController {
    async login (req: Request, res: Response) {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: result.error,
            });
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" },
        );

        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    }

    async register (req: Request, res: Response) {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: result.error,
            });
        }

        const { name, email, password } = result.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser)
            return res.status(409).json({ error: "Email already registered" });

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            },
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" },
        );

        return res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    }
}