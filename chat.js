export class Chatroom {
    constructor(r, n) {
        this.room = r;
        this.username = n;
        this.chats = db.collection("chats");
        this.unsub = false;
    }

    set room(r) {
        this._room = r;
        if (this.unsub) {
            this.unsub();
        }
    }

    set username(n) {
        if ((n.length > 2 && n.length < 10) && n.trim() != "" ) { 
            this._username = n;
        } else {
            alert("Korisnicko ime je nevalidno")
        }
        // if (this.unsub) {
        //     this.unsub();
        // }
    }

    get room() {
        return this._room;
    }

    get username() {
        return this._username;
    }

    async addChat(m) {
        try { 
            let docChat = {
                message: m,
                username: this.username,
                room: this.room,
                created_at: new Date()
            };
            let response = await this.chats.add(docChat);
            return response;
        } catch (error) {
            console.error("Doslo je do greske", error);
        }
    }

    getChats(callback) {
        this.unsub = this.chats
        .where("room", "==", this.room)
        .orderBy("created_at")
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type == "added") {
                    callback(change.doc.data());
                } 
            });
        });
    }
}