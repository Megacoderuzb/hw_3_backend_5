const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");

describe("Users E2E", () => {
  let token;
  beforeAll(async () => {
    await db.connect();
    return db.clean();
  });

  afterAll(() => {
    return db.disconnect();
  });

  describe("POST /users/register", () => {
    it('"first_name" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/users/register/")
        .set("Accept", "application/json")
        .send({
          last_name: "Bar",
          username: "megacoder",
          password: "1234",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it('"last_name" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/users/register/")
        .set("Accept", "application/json")
        .send({
          first_name: "Foo",
          username: "megacoder",
          password: "1234",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it('"username" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/users/register/")
        .set("Accept", "application/json")
        .send({
          first_name: "Foo",
          last_name: "Bar",
          password: "1234",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it('"password" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/users/register/")
        .set("Accept", "application/json")
        .send({
          first_name: "Foo",
          last_name: "Bar",
          username: "megacoder",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it("foydalanuvchini ro'yxatdan o'tkazishi kerak.", (done) => {
      request(app)
        .post("/users/register/")
        .set("Accept", "application/json")
        .send({
          first_name: "Foo",
          last_name: "Bar",
          username: "megacoder",
          password: "1234",
        })
        .expect("Content-Type", /json/)
        .expect(201, done);
    });
  });

  describe("POST /users/login", () => {
    it('"username" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/users/login/")
        .set("Accept", "application/json")
        .send({
          password: "1234",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it('"password" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/users/login/")
        .set("Accept", "application/json")
        .send({
          username: "megacoder",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it("foydalanuvchi topilmasa xatolik qaytarishi kerak.", (done) => {
      request(app)
        .post("/users/login/")
        .set("Accept", "application/json")
        .send({
          username: "user_404",
          password: "1234",
        })
        .expect("Content-Type", /json/)
        .expect(401, done);
    });

    it("parol noto'g'ri bo'lsa xatolik qaytarishi kerak.", (done) => {
      request(app)
        .post("/users/login/")
        .set("Accept", "application/json")
        .send({
          username: "megacoder",
          password: "1234_xato",
        })
        .expect("Content-Type", /json/)
        .expect(401, done);
    });

    it("login & parol to'g'ri bo'lsa token qaytarishi kerak.", async () => {
      const response = await request(app)
        .post("/users/login/")
        .set("Accept", "application/json")
        .send({
          username: "megacoder",
          password: "1234",
        });
      token = response.body.data;
      expect(response.body.data).toBeDefined();
      expect(response.status).toBe(200);
    });
  });

  describe("GET /users/me", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .get("/users/me")
        .set("Authorization", null)
        .expect(401, done);
    });

    it("Foyalanuvchi tokeni bo'lsa userni qaytarishi kerak", (done) => {
      request(app)
        .get("/users/me")
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("PATCH /users/me", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .patch("/users/me")
        .set("Authorization", null)
        .expect(401, done);
    });

    it("Foydalanuvchi topilsa update bo'lishi kerak", (done) => {
      request(app)
        .patch("/users/me")
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("DELETE /users/me", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .delete("/users/me")
        .set("Authorization", null)
        .expect(401, done);
    });

    it("Foydalanuvchi topilsa delete bo'lishi kerak", (done) => {
      request(app)
        .delete("/users/me")
        .set("Authorization", token)
        .expect(200, done);
    });
  });
});
