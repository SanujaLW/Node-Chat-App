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
        },
        auth: {
          type: this.Sequelize.STRING(),
          allowNull: false,
          comment: "user authentication"
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

  addRecord(model, data, additional, callback) {
    for (let prop in additional) {
      data[prop] = additional[prop];
    }

    model
      .build(data)
      .save()
      .then(() => {
        callback("ok");
      })
      .catch(err => {
        callback(err);
      });
  }

  findAll(model, callback) {
    model
      .findAll({ raw: true })
      .then(list => {
        callback(list);
      })
      .catch(err => {
        callback(err);
      });
  }

  search(model, filters, callback) {
    model
      .findAll({ raw: true, where: filters })
      .then(result => {
        callback(result);
      })
      .catch(err => {
        callback(err);
      });
  }

  update(model, filters, newData, callback) {
    model
      .update(newData, { where: filters })
      .then(result => {
        callback(result);
      })
      .catch(err => {
        callback(err);
      });
  }

  delete(model, filters, callback) {
    model
      .destroy({ where: filters })
      .then(result => {
        callback(result);
      })
      .catch(err => {
        callback(err);
      });
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
