class ChatMessage {
    constructor(sentBy, thread, msg, timeSent) {
        this.sentBy = sentBy;
        this.thread = thread;
        this.msg = msg;
        this.timeSent = timeSent;
        this.id = 0;
    }

    getResource() {
        return {
            sentBy: this.sentBy,
            thread: this.thread,
            msg: this.msg,
            timeSent: this.timeSent
        }
    }

    getDBResource() {
        return {
            ChatUserId: this.sentBy.id,
            ChatThreadId: this.thread.id,
            msg: this.msg,
            timeSent: this.timeSent
        }
    }

    setFromResource(resource) {
        this.sentBy = resource.sentBy;
        this.thread = resource.thread;
        this.msg = resource.msg;
        this.timeSent = resource.timeSent;
        this.id = resource.id;
    }
}

module.exports = ChatMessage;