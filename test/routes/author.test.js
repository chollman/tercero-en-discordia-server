const authorRoutes = require("../../src/routes/author");
const { appSetup } = require("../../config/app/appSetup");
const { mongooseDisconnect, mongooseConnect } = require("../../config/mongoose/mongooseSetupTest");

const request = require("supertest");
const app = appSetup();
app.use("/api", authorRoutes);

beforeAll(async () => {
    jest.setTimeout(10000);
    await mongooseConnect();
});

afterAll(async () => {
    await mongooseDisconnect();
});

test("testing route works", async () => {
    const response = await request(app).get("/api/authors");
    expect(response.statusCode).toBe(200);
});
