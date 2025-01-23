import express, { Express } from "express";
import { createRecord, createRecordsBatch, deleteById, getAll, getById, search, updateById } from "../../routes/people";
import { describe } from "node:test";
import request from "supertest";
import bodyParser from "body-parser";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/people", getAll);
app.get("/people/:id", getById);
app.patch("/people/:id", updateById);
app.post("/people", createRecord);
app.post("/people/batch/create", createRecordsBatch);
app.post("/people/search", search);
app.delete("/people/:id", deleteById);

describe('POST /people create a person', () => {
    it('POST /people should return an object of the created record', async () => {
        return request(app)
            .post('/people')
            .send({
                "name": "Rocky",
                "favoriteFood": "Sushi",
                "favoriteMovie": "Back to The Future",
                "status": "Inactive"
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        name: "Rocky",
                        favoriteFood: "Sushi",
                        favoriteMovie: "Back to The Future",
                        status: "Inactive",
                        active: true,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    })
                );
            })
    });
});

describe('POST /people/batch/create create a batch of person records', () => {
    it('POST /people/batch/create should return an array of records created', async () => {
        return request(app)
            .post('/people/batch/create')
            .send([
                {
                    "name": "Miroslav",
                    "favoriteFood": "Sushi",
                    "favoriteMovie": "American Psycho",
                    "status": "Active"
                },
                {
                    "name": "Donny",
                    "favoriteFood": "Singapore chow mei fun",
                    "favoriteMovie": "The Princess Bride",
                    "status": "Active"
                },
                {
                    "name": "Matt",
                    "favoriteFood": "Brisket Tacos",
                    "favoriteMovie": "The Princess Bride",
                    "status": "Inactive"
                }
            ])
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        count: 3
                    })
                );
            })
    });
});

describe('GET /people', () => {
    it('GET /people should return a list of people', async () => {
        return request(app)
            .get('/people')
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            name: expect.any(String),
                            favoriteFood: expect.any(String),
                            favoriteMovie: expect.any(String),
                            status: expect.any(String),
                            active: expect.any(Boolean),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        })
                    ])
                );
            })
    });
});

describe('GET /people/id by ID', () => {
    it('GET /people/id should return a person', async () => {
        return request(app)
            .get('/people/6791db6989fc60849edef70a')
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        name: expect.any(String),
                        favoriteFood: expect.any(String),
                        favoriteMovie: expect.any(String),
                        status: expect.any(String),
                        active: expect.any(Boolean),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    })
                );
            })
    });
});

describe('GET /people not found ID', () => {
    it('GET /people/id should return a 404 error', async () => {
        return request(app)
            .get('/people/67908c4c94bd0d93d9300c00')
            .expect(404);
    });
});

describe('POST /people/search by inactive status sorted by name', () => {
    it('POST /people/search should return a list of inactive people sorted by name', async () => {
        return request(app)
            .post('/people/search')
            .send({
                "property": "status",
                "query": "Inactive",
                "sortBy": "name",
                "order": "asc"
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            name: expect.any(String),
                            favoriteFood: expect.any(String),
                            favoriteMovie: expect.any(String),
                            status: 'Inactive',
                            active: expect.any(Boolean),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        })
                    ])
                );
            })
    });
});

describe('POST /people/search by active status sorted by name', () => {
    it('POST /people/search should return a list of active people sorted by name', async () => {
        return request(app)
            .post('/people/search')
            .send({
                "property": "status",
                "query": "Active",
                "sortBy": "name",
                "order": "asc"
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            name: expect.any(String),
                            favoriteFood: expect.any(String),
                            favoriteMovie: expect.any(String),
                            status: 'Active',
                            active: expect.any(Boolean),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        })
                    ])
                );
            })
    });
});

describe('POST /people/search by inactive status sorted by name', () => {
    it('POST /people/search should return a list of inactive people sorted by name', async () => {
        return request(app)
            .post('/people/search')
            .send({
                "property": "status",
                "query": "Inactive",
                "sortBy": "name",
                "order": "asc"
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            name: expect.any(String),
                            favoriteFood: expect.any(String),
                            favoriteMovie: expect.any(String),
                            status: 'Inactive',
                            active: expect.any(Boolean),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        })
                    ])
                );
            })
    });
});

describe('POST /people/search by active status without sort', () => {
    it('POST /people/search should return a list of active people', async () => {
        return request(app)
            .post('/people/search')
            .send({
                "property": "status",
                "query": "Active"
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            name: expect.any(String),
                            favoriteFood: expect.any(String),
                            favoriteMovie: expect.any(String),
                            status: 'Active',
                            active: expect.any(Boolean),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        })
                    ])
                );
            })
    });
});
