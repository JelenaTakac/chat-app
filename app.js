import { Chatroom } from "./chat.js";
import { ChatUI } from "./ui.js";

const body = document.getElementsByTagName("body")[0];
let ulChats = document.getElementById("inbox");
let btnSend = document.getElementById("btnSend");
let btnUpdate = document.getElementById("btnUpdate");
let textMessage = document.getElementById("message");
let inputUsername = document.getElementById("username");
let formMessage = document.getElementById("formMessage");
let formUsername = document.getElementById("formUsername");
let rooms = document.getElementById("rooms");
const roomsBtn = document.querySelectorAll("#rooms .btn");
const inputColor = document.getElementById("colorTheme");
const btnUpdateColor = document.getElementById("updateColor");

let username = "anonymus";

if (localStorage.username) {
    username = localStorage.username;
} 

let chatroom = new Chatroom("#general", username);
let chatui = new ChatUI(ulChats);

chatroom.getChats(data => { 
    chatui.templateLI(data); 
});

btnSend.addEventListener("click", (e) => {
    e.preventDefault();
    if (textMessage.value !== "") {
        chatroom.addChat(textMessage.value); 
        formMessage.reset();
        chatui.organizeMessages();
    } else {
        alert("You can not send an empty message!")
    }
});

btnUpdate.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputUsername.value.trim().length > 2 && inputUsername.value.trim().length < 10) {
        chatroom.username = inputUsername.value;
        localStorage.setItem("username", inputUsername.value);
        formUsername.reset();


        let notification = document.createElement("div");
        notification.setAttribute("class", "notificationBox");
        notification.textContent = `Username is updated! New username is: ${localStorage.username}`
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    } else {
        alert("Invalid username!")
    }
});

rooms.addEventListener("click", (e) => {
    if (e.target.tagName == "BUTTON") {
        activeRoomBtn(e.target);
        chatroom.room = e.target.innerText;
        chatui.delete();
        chatroom.getChats(data => {
            chatui.templateLI(data);
        });
    }
});

function activeRoomBtn(currentBtn) {
    roomsBtn.forEach(btn => {
        if (btn.classList.contains("activeRoom")) {
            btn.classList.remove("activeRoom");
            currentBtn.classList.add("activeRoom");
        }
    })
}

btnUpdateColor.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(inputColor.value);
    localStorage.setItem("colorTheme", inputColor.value);
    body.style.backgroundColor = inputColor.value;
});

body.style.backgroundColor = localStorage.colorTheme;
if (localStorage.colorTheme) {
    inputColor.value= localStorage.colorTheme;
}
