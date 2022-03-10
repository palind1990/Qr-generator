window.addEventListener("load", function () {
  console.log("Loaded.");

  // Service Worker registreren.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log("Registerd:", registration);
      })
      .catch((error) => console.log(error));
  } else {
    console.log("No service worker support in this browser.");
  }

  // Click events opvangen.
  document
    .querySelector("#btnGrantPermission")
    .addEventListener("click", function () {
      console.log("clicked");

      // Controleer of notifications mogelijk zijn met deze browser...
      if (!("Notification" in window)) {
        console.log("Notifications are not supported by your browser.");
      } else {
        if (Notification.permission == "granted") {
          console.log("Permission granted before.");
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission == "granted") {
              console.log("Permission granted.");
            }
          });
        } else {
          console.log("Permission denied. No Notifications will be send.");
        }
      }
    });

  document
    .querySelector("#btnShowNotification")
    .addEventListener("click", function () {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then((registration) => {
          registration.showNotification("Printing", {
            vibrate: [
              300,
              100,
              100,
              50,
              100,
              50,
              100,
              100,
              150,
              250,
              100,
              700,
              200,
              150,
              200,
            ],
            body: "Qr codes send to print",
            icon: "./js/printer.png",
          });

          console.log("New notification was send.");
        });
      }
    });

  if ("PushManager" in window) console.log("Pushing possible.");

  // push events opvangen.
  document
    .querySelector("#btnGrantPermission")
    .addEventListener("click", function () {
      console.log("clicked");

      // Controleer of notifications mogelijk zijn met deze browser...
      if (!("Notification" in window)) {
        console.log("Notifications are not supported by your browser.");
      } else {
        if (Notification.permission == "granted") {
          console.log("Permission granted before.");
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission == "granted") {
              console.log("Permission granted.");
            }
          });
        } else {
          console.log("Permission denied. No Notifications will be send.");
        }
      }
    });

  document
    .querySelector("#btnSubscribeToPushNotification")
    .addEventListener("click", function () {
      console.log("Clicked to subscribe.");

      navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlB64ToUint8Array(
                "BGR9dUZ-UlIFfVWIfSfkZ3lFP52RuXUPvXFE5fsL0CAXnawPKoQDLMKguQSTW6DCaCfEwMlVz9HPkXH8IztuMIM"
              ),
            })
            .then((subscription) => {
              console.log("Subscripton: ", JSON.stringify(subscription));

              var options = {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(subscription),
              };
              fetch("/api/save-subscription", options)
                .then((response) => {
                  console.log("Response:", response);
                  return response.json();
                })
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    });
});

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
