function validateForm(event) {
  event.preventDefault();

  // Clear previous errors
  document.getElementById("usernameError").textContent = "";
  document.getElementById("emailError").textContent  = "";
  document.getElementById("phoneError").textContent  = "";

  let valid = true;

  const username = document.getElementById("name").value.trim();
  if (!username) {
    document.getElementById("usernameError").textContent = "Введіть ваше ім'я.";
    valid = false;
  }

  const email = document.getElementById("email").value.trim();
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Введіть коректну email-адресу.";
    valid = false;
  }

  // Allow spaces, dashes, parentheses — strip them before checking digits
  const phone = document.getElementById("phone").value.trim();
  const phoneDigits = phone.replace(/[\s\-().+]/g, "");
  if (!/^\d{7,15}$/.test(phoneDigits)) {
    document.getElementById("phoneError").textContent = "Введіть коректний номер телефону.";
    valid = false;
  }

  if (!valid) return;

  const sendButton = document.getElementById("sendButton");
  sendButton.disabled = true;
  sendButton.textContent = "Надсилаємо…";

  const params = {
    name:    username,
    email:   email,
    phone:   phone,
    message: document.getElementById("notes").value,
    level:   document.getElementById("level").value
  };

  emailjs.send("service_jgex8hj", "template_w7m91ya", params)
    .then(function (response) {
      console.log("Email sent successfully", response);

      // Facebook Pixel conversion event
      if (typeof fbq === "function") fbq("track", "Lead");

      document.getElementById("registrationForm").classList.add("form-hidden");
      document.getElementById("registration-title").classList.add("form-hidden");
      document.getElementById("successMessage").style.display = "block";
      history.pushState(null, "", "#thank-you");
    })
    .catch(function (err) {
      console.error("EmailJS error:", err);
      sendButton.disabled = false;
      sendButton.textContent = "Надіслати";
      alert("Помилка відправки. Спробуйте ще раз або напишіть нам на email: slovakklab@gmail.com\n\nДеталі: " + JSON.stringify(err));
    });
}

// Single event listener — no onclick needed on the button
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("registrationForm").addEventListener("submit", validateForm);
});
