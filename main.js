navigator.mediaDevices
  .getUserMedia({
    video: {
      facingMode: "environment",
    },
    audio: false,
  })
  .then((localMediaStream) => {
    const video = document.querySelector("video");

    if ("srcObject" in video) {
      video.srcObject = localMediaStream;
    } else {
      video.src = window.URL.createObjectURL(localMediaStream);
    }

    video.play();

    const element = document.getElementById("container");
    element.remove();

    playAudio();
  })
  .catch(() => {
    const myElement = document.getElementById("container");
    myElement.innerHTML =
      "Der Zugriff auf die Kamera wurde blockiert.<br/> Bitte erlauben Sie den Zugriff, um die Funktionen dieser Webseite nutzen zu können.";
  });

const x = document.getElementById("Audio");

function playAudio() {
  x.play();
}
