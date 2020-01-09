class ORM {
  constructor() {
    let path = "mysql://hx0PbWTsGR:2rP1JveNmZ@remotemysql.com:3306/hx0PbWTsGR";
    this.Sequelize = require("sequelize");
    this.sequelize = new this.Sequelize(path);

    this.schema = {
      ChatUser: this.sequelize.define("ChatUser", {
        firstName: {
          type: this.Sequelize.STRING(100),
          allowNull: false,
          comment: "user first name"
        },
        lastName: {
          type: this.Sequelize.STRING(100),
          allowNull: false,
          comment: "user last name"
        },
        email: {
          type: this.Sequelize.STRING(320),
          allowNull: false,
          comment: "user email"
        }
      })
    };
  }

  initiate() {
    this.sequelize
      .authenticate()
      .then(async () => {
        console.log("Connection established successfully.");
        for (let model in this.schema) {
          await this.schema[model].sync().catch(err => {
            throw err;
          });
        }
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });
  }

  async addRecord(model, data, additional) {
    for (let prop in additional) {
      data[prop] = additional[prop];
    }
    try {
      return await model.build(data).save();
    } catch (ex) {
      throw ex;
    }
  }

  async findAll(model, callback) {
    try {
      return await model.findAll({ raw: true });
    } catch (ex) {
      throw ex;
    }
  }

  async search(model, filters) {
    try {
      return model.findAll({ raw: true, where: filters });
    } catch (ex) {
      throw ex;
    }
  }

  async update(model, filters, newData, callback) {
    try {
      return await model.update(newData, { where: filters });
    } catch (ex) {
      throw ex;
    }
  }

  async delete(model, filters, callback) {
    try {
      return await model.destroy({ where: filters });
    } catch (ex) {
      throw ex;
    }
  }

  shutdown() {
    this.sequelize
      .close()
      .then(() => {
        console.log("Connection closed");
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = new ORM();

////////////////////////////////////Tests//////////////////////////////////
/*
let tempUser = new User("firstName2", "lastName2", "email2", null);
  db.addRecord(
    db.schema.ChatUser,
    tempUser.getResource(),
    { auth: "tempauth2" },
    result => {
      console.log(result);
    }
  );
  db.update(db.schema.ChatUser, { id: 15 }, { auth: "newAuth" }, result => {
    console.log(result);
  });
  db.delete(db.schema.ChatUser, { id: 15 }, result => {
    console.log(result);
  });
  db.search(db.schema.ChatUser, { id: 15 }, result => {
    console.log(result);
  });
*/
