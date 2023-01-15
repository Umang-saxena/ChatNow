var socket = io();

const name = prompt("Enter Name");
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var receive_message = new Audio('media/Receive.mp3')
var sent_message = new Audio('media/Send.mp3')

// -------------------------------------------------------------------FUNCTIONS USED------------------------------------------------------
const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == "left"){
        receive_message.play();
    }
    if(position == 'right'){
        sent_message.play();
    }
};

// ----------------------------------------------------------EVENT LISTENERS--------------------------------------------------------------------
form.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
});


// ---------------------------------------------------------------------------------------------------------------
socket.emit("new-user-joined", name );

socket.on("user-joined", (name) => {
    append(`${name} joined the Chat`, "right");

});

socket.on("receive", (data) => {
    append(`${data.name}: ${data.message}`, "left");
});
socket.on("leave", (name) => {
    append(`${name} Left the Chat`, "left");
});
