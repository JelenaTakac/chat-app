export class ChatUI {
    constructor(l) {
        this.list = l;
    }

    set list(l) {
        this._list = l;
    }

    get list() {
        return this._list;
    }

   formatDate(timestamp) {
        const mesageDate = new Date(timestamp.toDate());
        const currentDate = new Date();
        let isToday = this.isSameDay(mesageDate, currentDate);

        if (isToday) {
            return this.formatTime(mesageDate);
        } else {
            return this.formatDateTime(mesageDate);
        }
    }

    isSameDay(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() == date2.getDate() 
        );
    }

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0'); 
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    formatDateTime(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} - ${hours}:${minutes}`;
    }

    templateLI(docFromDb) {
        const li = document.createElement("li");
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        const img = document.createElement("img");
        img.src = "delete.png";
        const time = this.formatDate(docFromDb.created_at);
        div1.textContent = `${docFromDb.username}: ${docFromDb.message}`;
        div2.textContent = `${time}`;

        if (docFromDb.username === localStorage.username) {
            li.classList.add("userMessage");
        } else {
            li.classList.add("otherMessage");
        }
        
        li.append(div1, div2, img);

        img.addEventListener("click", (e) => {
            console.log(`kliknuto na trash -> ${document.message}, user: ${document.username}`);
            this.deleteMessage(e, docFromDb);
        });
        return this.list.append(li);
    }

    delete() {
        this.list.innerHTML = "";
    }

    async deleteMessage(event, document) {
        if (document.username !== localStorage.username) {
            event.target.parentElement.remove();
        } else {
            if (confirm("Do you want to permanently delete this message") == true) {
                try {
                    const querySnapshot = await db.collection("chats")
                    .where("username", "==", document.username)
                    .where("message", "==", document.message)
                    .get();
                    querySnapshot.forEach(async (doc) => {
                    await doc.ref.delete(); // ref - predstavlja referencu na dokument u bazi
                    console.log("Document successfully deleted from Firestore!");
                });
                } catch (error) {
                    console.error("Error removing document: ", error);
                }
                event.target.parentElement.remove();
            }
        }
    }

    organizeMessages() {
        const messages = this.list.children; 
        const currentUser = localStorage.username;

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            const isCurrentUserMessage = message.innerText.includes(currentUser);

            if (isCurrentUserMessage) {
                message.classList.add("userMessage");
                message.classList.remove("otherMessage")
            } else {
                message.classList.remove("userMessage");
                message.classList.add("otherMessage");
            }
        }
    }
}