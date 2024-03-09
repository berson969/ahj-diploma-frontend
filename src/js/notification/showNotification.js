export default function showNotification(message) {

    const notification = new Notification('Новое сообщение в чате', {
      tag: 'newMessage',
      body: message.textBody,
      icon: './dist/img/messenger-icon.png',
      requireInteraction: true,
      hasReply: true,

    });
    console.log(notification);

    notification.addEventListener('click', () => {
      console.log('Notification closed');
      notification.close()
    });
}
