importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCfqpUo9qRf_dJ1mapiE5MchkeOEJa_yMo",
  authDomain: "notification-3455b.firebaseapp.com",
  projectId: "notification-3455b",
  storageBucket: "notification-3455b.firebasestorage.app",
  messagingSenderId: "497538357952",
  appId: "1:497538357952:web:34595a8b102c9bc8f5ab25",
  measurementId: "G-JMN9DGJXQZ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/assets/icons/icon-72x72.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
