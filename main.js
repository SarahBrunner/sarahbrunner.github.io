(() => {
  const particleCount = 300;
  const particleMax   = 1000;
  const sky           = document.querySelector('.sky');
  const canvas        = document.createElement('canvas');
  const ctx           = canvas.getContext('2d');
  let width         = sky.clientWidth;
  let height        = sky.clientHeight;
  let active        = false;
  let snowflakes    = [];
  let snowflake;

  canvas.style.position = 'absolute';
  canvas.style.left = canvas.style.top = '0';

  const Snowflake = function () {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.r = 0;

    this.reset();
  };

  Snowflake.prototype.reset = function() {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.vy = 1 + Math.random() * 3;
    this.vx = 0.5 - Math.random();
    this.r = 1 + Math.random() * 2;
    this.o = 0.5 + Math.random() * 0.5;
  };
  
  function generateSnowFlakes() {
    snowflakes = [];
    for (i = 0; i < particleMax; i++) {
      snowflake = new Snowflake();
      snowflake.reset();
      snowflakes.push(snowflake);
    }
  }
  
  generateSnowFlakes();

  function update() {
    ctx.clearRect(0, 0, width, height);

    if (!active) {      
      return;
    }

    for (i = 0; i < particleCount; i++) {
      snowflake = snowflakes[i];
      snowflake.y += snowflake.vy;
      snowflake.x += snowflake.vx;

      ctx.globalAlpha = snowflake.o;
      ctx.beginPath();
      ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      if (snowflake.y > height) {
        snowflake.reset();
      }
    }

    requestAnimFrame(update);
  }

  function onResize() {
      width = sky.clientWidth;
      height = sky.clientHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#FFF';
    
      var wasActive = active;
      active = width > 600;
    
      if (!wasActive && active) {
        requestAnimFrame(update);
      }
    }
    
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function() {
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    onResize();
  window.addEventListener('resize', onResize, false);

  const videoElement = document.getElementById('video');
  const adjustCameraSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Set video element size to fill the screen
    videoElement.width = screenWidth;
    videoElement.height = screenHeight;
  };
  
  window.addEventListener('resize', adjustCameraSize);
  adjustCameraSize();  // Initialize on load

  navigator.mediaDevices
      .getUserMedia({ video: {
        facingMode: { exact: "environment" }
      }
       })
      .then((localMediaStream) => {
        sky.appendChild(canvas);

        const video = document.querySelector("video");
        video.srcObject = localMediaStream;

        const element = document.getElementById("container");
        element.remove();

        playAudio();
      })
      .catch(() => {
        const myElement = document.getElementById("container");
        myElement.innerHTML = "Der Zugriff auf die Kamera wurde blockiert.<br></br> Bitte erlauben Sie den Zugriff, um die Funktionen dieser Webseite nutzen zu können."
      });

  const para = document.createElement("p");
  para.innerHTML = "Um die Funktionen dieser Webseite nutzen zu können, müssen Sie die Kamera aktivieren.<br></br> Bitte erlauben Sie den Zugriff auf Ihre Kamera.";
  document.getElementById("container").appendChild(para);

  const x = document.getElementById("Audio");

  function playAudio() {
    x.play();
  }

  function pauseAudio() {
    x.pause();
  }
})()
