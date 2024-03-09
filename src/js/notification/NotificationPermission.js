export async function requestNotificationPermission() {
  if (!window.Notification) {
    return;
  }

  if (Notification.permission === 'granted') {
    console.log('Notification permission already granted');
    return true;
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted after request');
      return true;
    }

    console.log('Notification permission denied');
    return false;
  }
}
