function MessageController(orm) {
  return {
    get_messages: async function(req, res) {
      try {
        let jsonMessages = [];
        let chatMessages = await new orm.schema.ChatMessage().fetchAll();
        chatMessages = chatMessages.toJSON();
        for (msg of chatMessages) {
          let sentBy = await new orm.schema.ChatUser({
            id: msg.userId
          }).fetch();
          msg.sentBy = sentBy.toJSON();
          jsonMessages.push(msg);
        }
        jsonMessages.sort((a, b) => {
          return b.timeSent - a.timeSent;
        });
        if (jsonMessages.length >= Number(req.query.upTo) + 10) {
          let messagesToSent = jsonMessages.slice(
            Number(req.query.upTo),
            Number(req.query.upTo) + 10
          );
          res.json({
            messages: messagesToSent,
            hasUpto: Number(req.query.upTo) + 10
          });
        } else if (jsonMessages.length > Number(req.query.upTo)) {
          let messagesToSent = jsonMessages.slice(
            Number(req.query.upTo),
            jsonMessages.length
          );
          res.json({
            messages: messagesToSent,
            hasUpto: jsonMessages.length
          });
        } else {
          res.json({
            messages: [],
            hasUpto: Number(req.query.upTo)
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
}

module.exports = MessageController;
