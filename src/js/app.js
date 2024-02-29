import { faker } from "@faker-js/faker";
import RenderMessage from "./renderMessage";


// const baseUrl = 'ws://localhost:7072/ws';
const baseUrl = 'wss:///ahj-diploma-server-4b9ecd1ed842.herokuapp.com';

let userId = localStorage.getItem('userId');
if (!userId) {
  userId = faker.string.uuid();
  localStorage.setItem('userId', userId);
}
const messages = [];

const ws = new WebSocket(baseUrl);


const chatMessages = document.querySelector('.chat-messages');
const messageText = document.querySelector(".input-wrapper");
const sendMessage = document.getElementById('button-addon');
const fileContainer = document.querySelector('.custom-file');
const fileInput = fileContainer.querySelector('.custom-file-input');
const geoButton = document.getElementById('geo')

const render = new RenderMessage(chatMessages, userId);
const sendMessageHandler = () => {
  const text = messageText.textContent.trim();
  console.log('text',text)
  if (text) {
    const textArray = text.split(/\s+/).map(item => {
      return (item.startsWith('http')) ? `<a href=${item}>${item}</a>` : item;
    })
    const message = {
      user: userId,
      type: 'text',
      textBody: textArray.join(' ')
    }
    console.log('message', text)
    ws.send(JSON.stringify(message));
    messageText.textContent = '';
  }
};

const sendFileHandler = (file) => {
  const reader = new FileReader()

  reader.addEventListener('load', (e) => {
    const content = e.target.result;
    let type;
    if (content.includes('application/')) {
       type = content.slice(17, 21).toString();
      console.log('TYPE', type)
    } else {
       type = content.slice(5, 10).toString();
    }

    const message = {
      user: userId,
      type: type,
      textBody: file.name,
      blobContent: content
    }
    ws.send(JSON.stringify(message));
  });
 reader.readAsDataURL(file);
}

const sendGeoPositionHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const message = {
        user: userId,
        type: 'geo',
        textBody: `${latitude}  :  ${longitude}`,
      }

      ws.send(JSON.stringify(message));
    });
  }
};


sendMessage.addEventListener('click', (event) => {
  event.preventDefault();
  sendMessageHandler()
});

messageText.addEventListener('keydown', (event) => {
  if(event.key === 'Enter') {
    event.preventDefault();
    sendMessageHandler()
  }
});

fileContainer.addEventListener('click', (e) => {
  console.log(e)

  console.log('click')
  fileInput.dispatchEvent(new MouseEvent('click'))
});

fileInput.addEventListener("change", (e) => {
  if (fileInput.files) {
    if (fileInput.files.length > 1) {
      Array.from(fileInput.files).forEach(file => sendFileHandler(file))
    } else {
      const file = fileInput.files[0]
      sendFileHandler(file)
    }
  }
});

geoButton.addEventListener('click', (e) => {
  e.preventDefault();
  sendGeoPositionHandler();
});




ws.addEventListener("open",  (e) => {
  console.log("WebSocket открыт и готов к использованию.");
});

ws.addEventListener("close", ((e) => {
  console.log("WebSocket закрыт.");
}));

ws.addEventListener("error", (e) => {
  console.log("Произошла ошибка в WebSocket:", e);
});

ws.addEventListener("message", async (e) => {
  const data = JSON.parse(e.data);

  console.log("Message from message", data, Array.isArray(data))

  if (Array.isArray(data)) {

    messages.push(...data);
    console.log('messages before sort', messages)
    messages.sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));


    console.log('messagesGET', messages)
    render.clearChat()
    messages.forEach(message => {
      render.renderChat(message)
    })
  } else if (data) {
    render.renderChat(data)
  } else {
    console.error('Неизвестное сообщение', data);
  }
})




