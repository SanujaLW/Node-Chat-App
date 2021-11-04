const ORM = require("./orm.js");
const orm = new ORM();


let resources = {
  Users: [
    new orm.schema.ChatUser({
      firstName: "firstName 1",
      lastName: "lastName 1",
      email: "email 2"
    }),
    new orm.schema.ChatUser({
      firstName: "firstName 2",
      lastName: "lastName 2",
      email: "email 2"
    }),
    new orm.schema.ChatUser({
      firstName: "firstName 3",
      lastName: "lastName 3",
      email: "email 3"
    }),
    new orm.schema.ChatUser({
      firstName: "firstName 4",
      lastName: "lastName 4",
      email: "email 4"
    })
  ],
  Threads: [
    new orm.schema.ChatThread({
      threadName: "Thread 1"
    }),
    new orm.schema.ChatThread({
      threadName: "Thread 2"
    })
  ]
}


beforeAll(async () => {
  await orm.up();
});


describe("Model -> User DB Test", function () {
  jest.setTimeout(20000);

  test("User add", async () => {
    const resultAdd = await resources.Users[0].save();
    expect(resultAdd.toJSON()).toEqual(
      expect.objectContaining(resources.Users[0].toJSON())
    );
  });

  test("User get", async () => {
    let testId = resources.Users[0].get("id");
    const resultGet = await new orm.schema.ChatUser({
      id: testId
    }).fetch();
    expect(resultGet.toJSON()).toEqual(
      expect.objectContaining(resources.Users[0].toJSON())
    );
  });

  test("User update", async () => {
    let testUser = resources.Users[0].clone();
    testUser.set({
      firstName: "newFirstName"
    });
    const resultUpdate = await testUser.save();
    expect(resultUpdate.toJSON()).toEqual(
      expect.objectContaining(testUser.toJSON())
    );
  });

  test("User delete", async () => {
    let testId = resources.Users[0].get("id");
    const resultDelete = await new orm.schema.ChatUser({
      id: testId
    }).destroy();
    expect(resultDelete.toJSON()).toEqual(
      expect.objectContaining(resources.Users[0].clear().toJSON())
    );

    await orm.knex.raw("DELETE FROM ChatUser");
  });
});

describe("Model -> Thread DB Test", function () {
  jest.setTimeout(20000);

  test("Thread add", async () => {
    const resultAdd = await resources.Threads[0].save();
    expect(resultAdd.toJSON()).toEqual(
      expect.objectContaining(resources.Threads[0].toJSON())
    );
  });

  test("Thread get", async () => {
    let testId = resources.Threads[0].get("id");
    const resultGet = await new orm.schema.ChatThread({
      id: testId
    }).fetch();
    expect(resultGet.toJSON()).toEqual(
      expect.objectContaining(resources.Threads[0].toJSON())
    );
  });

  test("Thread update", async () => {
    let testThread = resources.Threads[0].clone();
    testThread.set({
      threadName: "newThreadName"
    });
    const resultUpdate = await testThread.save();
    expect(resultUpdate.toJSON()).toEqual(
      expect.objectContaining(testThread.toJSON())
    );
  });

  test("Thread delete", async () => {
    let testId = resources.Threads[0].get("id");
    const resultDelete = await new orm.schema.ChatThread({
      id: testId
    }).destroy();
    expect(resultDelete.toJSON()).toEqual(
      expect.objectContaining(resources.Threads[0].clear().toJSON())
    );

    await orm.knex.raw("DELETE FROM ChatThread");
  });
});

afterAll(async () => {
  await orm.knex.raw("DELETE FROM ThreadUser");
  await orm.knex.raw("DELETE FROM ChatUser");
  await orm.knex.raw("DELETE FROM ChatThread");
  orm.close();
});