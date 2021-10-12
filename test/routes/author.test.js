const authorRoutes = require("../../src/routes/author");
const Author = require("../../src/models/author");

const { appSetup } = require("../../config/app/appSetup");
const { mongooseDisconnect, mongooseConnect, populateDB } = require("../../config/mongoose/mongooseSetupTest");

const request = require("supertest");
const app = appSetup();
app.use("/api", authorRoutes);

beforeAll(async () => {
    jest.setTimeout(10000);
    await mongooseConnect();
    await populateDB();
});

afterAll(async () => {
    await mongooseDisconnect();
});

describe("GET /authors endpoint", () => {
    const url = "/api/authors";
    it("should return 200", async () => {
        const response = await request(app).get(url);
        expect(response.statusCode).toBe(200);
    });
    it("should not have an empty response", async () => {
        const response = await request(app).get(url);
        expect(response.body.length).not.toEqual(0);
    });
});

describe("GET /authors/:id endpoint", () => {
    const url = "/api/authors/";
    it("should respond error for an nonexistent id", async () => {
        const response = await request(app).get(url + "1231");
        expect(response.statusCode).toBe(400);
    });
    it("should respond 200 with data for an existent id", async () => {
        const author = await Author.findOne();
        const response = await request(app).get(url + author.id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("biography");
        expect(response.body).toHaveProperty("twitterLink");
        expect(response.body).toHaveProperty("facebookLink");
        expect(response.body).toHaveProperty("instagramLink");
        expect(response.body).toHaveProperty("hasPhoto");
    });
});
