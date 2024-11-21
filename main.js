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

const playButton = document.getElementById("playButton");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;

// Load MP3 file
async function loadAudio() {
  const response = await fetch("we-wish-you-a-merry-christmas-125995.mp3"); // Replace with your MP3 file URL
  const arrayBuffer = await response.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// Play audio
function playAudio() {
  if (!audioBuffer) {
    console.error("Audio buffer not loaded.");
    return;
  }

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

// Event listener
playButton.addEventListener("click", async () => {
  // Resume audio context if it's suspended (Safari constraint)
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  // Load and play audio
  if (!audioBuffer) {
    await loadAudio();
  }
  playAudio();
});
