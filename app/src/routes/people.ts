import express, { Express, Request, Response } from "express";
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAll(req: Request, res: Response): Promise<void> {
    const all = await prisma.person.findMany();
    res.json(all);
}

/**
 * Get person by ID
 * @param req 
 * @param res 
 */
export async function getById(req: Request, res: Response): Promise<void> {
    let id = req.params.id;
    try {
        const first = await prisma.person.findFirst({
            where: {
                id: id,
            }
        });
        if (first) {
            res.json(first);
        } else {
            res.status(404).json({
                message: "Not Found",
            });
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
            res.status(500).json({
                message: "Bad Request. Check your payload.",
            });
        }
    }
}

/**
 * Create person from POST request
 * @param req
 * @param res 
 */
export async function createRecord(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const { name, favoriteFood, favoriteMovie, status } = req.body;
    try {
        const result = await prisma.person.create({
            data: {
                name,
                favoriteFood,
                favoriteMovie,
                status
            }
        })
        res.json(result);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
            res.status(500).json({
                message: "Known client error ocurred. Check your payload."
            });
        }
        throw error;
    }
}

/**
 * Create a batch of records in a single request
 * @param req 
 * @param res 
 */
export async function createRecordsBatch(req: Request, res: Response): Promise<void> {
    const batch = req.body.map((person: Prisma.PersonCreateInput) => {
        return {
            "name": person.name,
            "favoriteFood": person.favoriteFood,
            "favoriteMovie": person.favoriteMovie,
            "status": person.status
        }
    })
    try {
        const result = await prisma.person.createMany({
            data: batch
        })
        res.json(result);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
            res.status(500).json({
                message: "Known client error ocurred. Check your payload."
            });
        }
        throw error;
    }
}

/**
 * Update record by ID
 * @param req 
 * @param res 
 */
export async function updateById(req: Request, res: Response): Promise<void> {
    let id = req.params.id;
    try {
        const updated = await prisma.person.update({
            where: {
                id,
            },
            data: req.body
        })
        if (updated) {
            res.json(updated);
        } else {
            res.status(500).json({
                message: "Error Updating Record",
            });
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
            res.status(500).json({
                message: "Known client error ocurred. Check your payload."
            });
        }
        throw error;
    }
}

export async function deleteById(req: Request, res: Response): Promise<void> {
    let id = req.params.id;
    try {
        const deleted = await prisma.person.delete({
            where: {
                id
            }
        })
        res.json(deleted);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
            res.status(500).json({
                message: "Known client error ocurred. Check your payload."
            });
        }
        throw error;
    }
}

/**
 * Search records by text property, sort them by another property and order asc or desc
 * @param req 
 * @param res 
 */
export async function search(req: Request, res: Response): Promise<void> {
    const { property, query, sortBy, order } = req.body;
    const constraints: Prisma.PersonFindManyArgs = {};
    if (property && query) {
        constraints.where = {
            [property]: {
                contains: query
            }
        }
    }
    if (sortBy && order) {
        constraints.orderBy = {
            [sortBy]: order,
        }
    };
    try {
        const results = await prisma.person.findMany(constraints);
        res.json(results);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
            res.status(500).json({
                message: "Known client error ocurred. Check your payload."
            });
        }
        throw error;
    }
}