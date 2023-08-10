const request = require("supertest");
const db = require("../src/db");
const app = require("../src/app");

describe("Lists E2E", () => {
  let token;
  let list;
  beforeAll(async () => {
    await db.connect();
    const resToken = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        username: "megacoder",
        password: "1234",
      });
    token = resToken.body.data;
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe("POST /lists", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app).get("/lists").set("Authorization", null).expect(401, done);
    });

    it('"name" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/lists")
        .set("Accept", "application/json")
        .set("Authorization", token)
        .send({
          name: null,
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it("list qo'shilishi kerak", async () => {
      const responce = await request(app)
        .post("/lists")
        .set("Accept", "application/json")
        .set("Authorization", token)
        .send({
          name: "foobaz",
        });
      list = responce.body.data;
      expect(responce.status).toBe(201);
    });
  });

  describe("GET /lists", () => {
    it("Foydalanuvchi token jo'natmasa xatolik qaytarishi kerak", (done) => {
      request(app).get("/lists").set("Authorization", null).expect(401, done);
    });

    it("Foydalanuvchi token jo'natsa list qaytarish kerak", (done) => {
      request(app).get("/lists").set("Authorization", token).expect(200, done);
    });
  });

  describe("GET, /lists/:id", () => {
    it("Foydalanuvchi token jo'natmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .get(`/lists/${list._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it("list topilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .get(`/lists/64d26ca635096d834a896a11`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it("list topilsa qaytarishi kerak", (done) => {
      request(app)
        .get(`/lists/${list._id}`)
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("PATCH /lists", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .patch("/lists/64d26ca635096d834a892a")
        .set("Authorization", null)
        .expect(401, done);
    });

    it("list topilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .patch(`/lists/64d26ca635096d834a896a11`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it("lists topilsa update bo'lishi kerak", (done) => {
      request(app)
        .patch(`/lists/${list._id}`)
        .set("Authorization", token)
        .expect(201, done);
    });
  });

  describe("DELETE /lists", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .delete(`/lists/${list._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it("list topilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .delete(`/lists/64d26ca635096d834a896a11`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it("list topilsa delete bo'lishi kerak", (done) => {
      request(app)
        .delete(`/lists/${list._id}`)
        .set("Authorization", token)
        .expect(201, done);
    });
  });
});
