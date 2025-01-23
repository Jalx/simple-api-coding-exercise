import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { 
    getAll,
    getById,
    createRecord,
    createRecordsBatch,
    updateById,
    deleteById,
    search
} from './routes/people';
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get("/people", getAll);
app.get("/people/:id", getById);
app.patch("/people/:id", updateById);
app.post("/people", createRecord);
app.post("/people/batch/create", createRecordsBatch);
app.post("/people/search", search);
app.delete("/people/:id", deleteById);