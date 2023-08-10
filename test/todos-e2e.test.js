const request = require("supertest");
const db = require("../src/db");
const app = require("../src/app");

describe("Todos E2E", () => {
  let token;
  let list;
  let todo;
  beforeAll(async () => {
    await db.connect();
    db.clean();
    await request(app)
      .post("/users/register/")
      .set("Accept", "application/json")
      .send({
        first_name: "muhammadjon",
        last_name: "a",
        username: "megacoder",
        password: "1234",
      });
    const resToken = await request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        username: "megacoder",
        password: "1234",
      });
    token = resToken.body.data;

    const resList = await request(app)
      .post("/lists")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({
        name: "muhammadjon",
      });
    list = resList.body.data;
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe("POST /todos", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app).get("/todos").set("Authorization", null).expect(401, done);
    });

    it('"list_id" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/todos")
        .set("Accept", "application/json")
        .set("Authorization", token)
        .send({
          text: "qwerty",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it('"text" yuborilmasa xatolik qaytaradi.', (done) => {
      request(app)
        .post("/todos")
        .set("Accept", "application/json")
        .set("Authorization", token)
        .send({
          list: "list_id",
        })
        .expect("Content-Type", /json/)
        .expect(400, done);
    });

    it('"list" topilmasa xatolik qaytarishi kerak.', (done) => {
      request(app)
        .post("/todos")
        .set("Accept", "application/json")
        .set("Authorization", token)
        .send({
          text: "foobar",
          list: "64d26ca635996d834cb896a1",
        })
        .expect("Content-Type", /json/)
        .expect(404, done);
    });

    it("Todo ro'yxatdan o'tkazishi kerak.", async () => {
      const responce = await request(app)
        .post("/todos/")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send({
          text: "qwerty~",
          list: list._id,
        });

      todo = responce.body.data;
      expect(responce.body.data).toBeDefined();
      expect(responce.status).toBe(201);
    });
  });

  describe("GET /todos", () => {
    it("Foydalanuvchi token jo'natmasa xatolik qaytarishi kerak", (done) => {
      request(app).get("/todos").set("Authorization", null).expect(401, done);
    });

    it("Foydalanuvchi token jo'natsa todolarni qaytarish kerak", (done) => {
      request(app).get("/todos").set("Authorization", token).expect(200, done);
    });
  });

  describe("GET, /todos/:id", () => {
    it("Foydalanuvchi token jo'natmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .get(`/todos/${todo._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it("todo topilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .get(`/todos/64d26ca635096d834a896a11`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it("todo topilsa qaytarishi kerak", (done) => {
      request(app)
        .get(`/todos/${todo._id}`)
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("PATCH /todos", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .patch("/todos/64d26ca635096d834a892a")
        .set("Authorization", null)
        .expect(401, done);
    });

    it("todo topilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .patch(`/todos/64d26ca635096d834a896a11`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it("todo topilsa update bo'lishi kerak", (done) => {
      request(app)
        .patch(`/todos/${todo._id}`)
        .set("Authorization", token)
        .expect(201, done);
    });
  });

  describe("DELETE /todos", () => {
    it("Foydalanuvchi tokeni jo'natilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .delete(`/todos/${todo._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it("todo topilmasa xatolik qaytarishi kerak", (done) => {
      request(app)
        .delete(`/todos/64d26ca635096d834a896a11`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it("todo topilsa delete bo'lishi kerak", (done) => {
      request(app)
        .delete(`/todos/${todo._id}`)
        .set("Authorization", token)
        .expect(201, done);
    });
  });
});
