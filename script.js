const canvas = document.getElementById("captcha-canvas");
const ctx = canvas.getContext("2d");
const refreshButton = document.getElementById("refresh-button");
const form = document.getElementById("captcha-form");
const input = document.getElementById("captcha-input");
const message = document.getElementById("message");

const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
let currentCaptcha = "";

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateCaptchaText(length = 6) {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += characters[randomInt(characters.length)];
  }
  return result;
}

function drawCaptcha() {
  currentCaptcha = generateCaptchaText();
  input.value = "";
  message.textContent = "";
  message.className = "message";

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Light background dots add visual noise.
  for (let i = 0; i < 520; i += 1) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${randomInt(110)}, ${randomInt(130)}, ${randomInt(150)}, ${Math.random() * 0.55})`;
    ctx.arc(randomInt(width), randomInt(height), Math.random() * 1.4 + 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Crossing lines make simple automated reading less straightforward.
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath();
    ctx.moveTo(randomInt(width), randomInt(height));
    ctx.lineTo(randomInt(width), randomInt(height));
    ctx.strokeStyle = `hsla(${randomInt(360)}, 75%, 48%, 0.55)`;
    ctx.lineWidth = Math.random() * 1.7 + 0.6;
    ctx.stroke();
  }

  const colors = ["#2877e8", "#13a66a", "#8746cf", "#e44848", "#e99a18", "#087e9c"];
  const spacing = width / (currentCaptcha.length + 1);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 52px Georgia, serif";

  [...currentCaptcha].forEach((character, index) => {
    ctx.save();
    const x = spacing * (index + 1);
    const y = height / 2 + (Math.random() * 18 - 9);
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.35);
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillText(character, 0, 0);
    ctx.restore();
  });

  input.focus();
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

refreshButton.addEventListener("click", drawCaptcha);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entered = input.value.trim();

  if (!entered) {
    showMessage("Please enter the CAPTCHA characters first.", "error");
    input.focus();
    return;
  }

  if (entered.toLowerCase() === currentCaptcha.toLowerCase()) {
    showMessage("CAPTCHA verified successfully!", "success");
    currentCaptcha = ""; // Prevent reusing the same challenge.
    input.value = "";
    // Create a fresh challenge after a short pause.
    window.setTimeout(drawCaptcha, 1400);
  } else {
    showMessage("That doesn't match. Please try again or refresh the CAPTCHA.", "error");
    input.select();
  }
});

drawCaptcha();
