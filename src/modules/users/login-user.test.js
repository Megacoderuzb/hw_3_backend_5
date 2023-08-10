const { UnauthorizedError } = require("../../shared/errors");
const makeLoginUser = require("./login-user");

describe("Login User", () => {
  it("user mavjud bo'lmasa xatolik qaytaradi", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const bcryptjs = {};
    const jwt = {};
    const loginUser = makeLoginUser({ User, bcryptjs, jwt });
  });

  it("o'chirilgan user login qilolmasligi kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const bcryptjs = {};
    const jwt = {};
    const loginUser = makeLoginUser({ User, bcryptjs, jwt });

    const credentials = {
      username: "megacoder",
      password: "1234",
    };

    loginUser(credentials).catch((err) => {
      expect(err instanceof UnauthorizedError).toBe(true);
      expect(User.findOne).toBeCalledWith({
        username: "megacoder",
        is_deleted: false,
      });
    });
  });

  it("agar parol noto'g'ri bo'lsa xatolik qaytaradi", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue({ _id: 1 }),
    };
    const bcryptjs = {
      compare: jest.fn().mockResolvedValue(false),
    };
    const jwt = {};
    const loginUser = makeLoginUser({ User, bcryptjs, jwt });
  });

  it("agar parol to'g'ri bo'lsa jwt token qaytarishi kerak", () => {
    const User = {
      findOne: jest.fn().mockResolvedValue({ _id: 1 }),
    };
    const bcryptjs = {
      compare: jest.fn().mockResolvedValue(true),
    };
    const jwt = {
      sign: jest.fn(() => "jwt_token"),
    };
    const loginUser = makeLoginUser({ User, bcryptjs, jwt });
  });
});
