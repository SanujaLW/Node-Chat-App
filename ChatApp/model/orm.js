class ORM {
  constructor() {
    this.knex = require("knex")({
      client: "mysql",
      connection: process.env.MYSQL_CONNECTION_STR
    });

    this.bookshelf = require("bookshelf")(this.knex);

    this.schema = {
      ChatUser: this.bookshelf.model("ChatUser", {
        tableName: "ChatUser",
        threads() {
          return this.belongsToMany("ChatThread").through("ThreadUser");
        },
        messages() {
          return this.hasMany("ChatMessage");
        }
      }),
      ChatThread: this.bookshelf.model("ChatThread", {
        tableName: "ChatThread",
        threads() {
          return this.belongsToMany("ChatUser").through("ThreadUser");
        }
      }),
      ThreadUser: this.bookshelf.model("ThreadUser", {
        tableName: "ThreadUser",
        thread() {
          return this.belongsTo("ChatThread");
        },
        user() {
          return this.belongsTo("ChatUser");
        }
      }),
      ChatMessage: this.bookshelf.model("ChatMessage", {
        tableName: "ChatMessage",
        thread() {
          return this.belongsTo("ChatThread");
        },
        user() {
          return this.belongsTo("ChatUser");
        }
      })
    };
  }

  async up() {
    await this.knex.schema.hasTable("ChatUser").then(async exists => {
      if (exists == false) {
        await this.knex.schema.createTable("ChatUser", table => {
          table.increments("id");
          table.string("firstName");
          table.string("lastName");
          table.string("email").unique();
        });
      }
    });

    await this.knex.schema.hasTable("ChatThread").then(async exists => {
      if (exists == false) {
        await this.knex.schema.createTable("ChatThread", table => {
          table.increments("id");
          table.string("threadName");
        });
      }
    });

    await this.knex.schema.hasTable("ThreadUser").then(async exists => {
      if (exists == false) {
        await this.knex.schema.createTable("ThreadUser", table => {
          table.increments("id");
          table
            .integer("userId")
            .unsigned()
            .references("id")
            .inTable("ChatUser");
          table
            .integer("threadId")
            .unsigned()
            .references("id")
            .inTable("ChatThread");
        });
      }
    });

    await this.knex.schema.hasTable("ChatMessage").then(async exists => {
      if (exists == false) {
        await this.knex.schema.createTable("ChatMessage", table => {
          table.increments("id");
          table.string("msg");
          table.bigInteger("timeSent");
          table
            .integer("userId")
            .unsigned()
            .references("id")
            .inTable("ChatUser");
          table
            .integer("threadId")
            .unsigned()
            .references("id")
            .inTable("ChatThread");
        });
      }
    });

    return "DB_UP";
  }

  async down() {
    await this.knex.schema.hasTable("ChatMessage").then(async exists => {
      if (exists == true) {
        await this.knex.schema.dropTable("ChatMessage");
      }
    });
    await this.knex.schema.hasTable("ThreadUser").then(async exists => {
      if (exists == true) {
        await this.knex.schema.dropTable("ThreadUser");
      }
    });
    await this.knex.schema.hasTable("ChatThread").then(async exists => {
      if (exists == true) {
        await this.knex.schema.dropTable("ChatThread");
      }
    });
    await this.knex.schema.hasTable("ChatUser").then(async exists => {
      if (exists == true) {
        await this.knex.schema.dropTable("ChatUser");
      }
    });
    return "DB_DOWN";
  }

  close() {
    this.knex.destroy();
  }
}

module.exports = ORM;
