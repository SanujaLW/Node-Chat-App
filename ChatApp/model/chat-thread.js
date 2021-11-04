class ChatThread {
    constructor(threadName) {
        this.threadName = threadName;
        this.users = [];
        this.messages = [];
        this.id = 0;
    }

    setFromResource(resource) {
        this.threadName = resource.threadName;
        this.users = resource.users;
        this.messages = resource.messages;
        this.id = resource.id;
    }

    getResource() {
        return {
            threadName: this.threadName,
            users: this.users,
            messages: this.messages
        }
    }
}

module.exports = ChatThread;