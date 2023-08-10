const { NotFoundError } = require("../../shared/errors");
const makeShowUser = require("./show-user");

describe("Show User", () => {
  it("agar user bo'lmasa xatolik qaytarishi kerak", () => {
    const User = {
      findOne: jest.fn(() => ({
        select: jest.fn().mockResolvedValue(null),
      })),
    };
    const showUser = makeShowUser({ User });

    showUser({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
    });
  });

  it("agar user bo'lsa userni qaytarishi kerak", () => {
    const User = {
      findOne: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ _id: 1 }),
      })),
    };
    const showUser = makeShowUser({ User });

    showUser({ id: 1 }).then((result) => {
      expect(result).toBeDefined();
    });
  });

  it("o'chirilgan userni qaytarmasligi kerak", () => {
    const User = {
      findOne: jest.fn(() => ({
        select: jest.fn().mockResolvedValue(null),
      })),
    };
    const showUser = makeShowUser({ User });

    showUser({ id: 1 }).catch((err) => {
      expect(err instanceof NotFoundError).toBe(true);
      expect(User.findOne).toBeCalledTimes(1);
      expect(User.findOne).toBeCalledWith({ _id: 1, is_deleted: false });
    });
  });
});
