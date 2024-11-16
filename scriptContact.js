 function validateForm(event) {
      event.preventDefault();

      let valid = true;

      document.getElementById("usernameError").textContent = "";
      document.getElementById("emailError").textContent = "";
      document.getElementById("phoneError").textContent = "";


      const username = document.getElementById("name").value;
      if (username.trim() === "") {
        document.getElementById("usernameError").textContent = "Username is required.";
        valid = false;
      }

      const phone = document.getElementById("phone").value;
      const phonePattern = /^(\+?\d{1,4})?\d{9}$/;
      if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").textContent = "Please enter a valid phone number in the format: +380XXXXXXXXX";
        valid = false;
      }

      const email = document.getElementById("email").value;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Please enter a valid email.";
        valid = false;
      }



      if (valid) {
        const name = document.getElementById("name").value;
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value


      let params = {
        name: name,
        email: email,
        phone: phone,
        message: document.getElementById("notes").value,
        level: document.getElementById("level").value
      }
       emailjs.send("service_l1xnl8i", "template_w7m91ya", params)

        document.getElementById("registrationForm").classList.add("form-hidden");
        document.getElementById("registration-title").classList.add("form-hidden");


        const successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";
      }
    }


    document.getElementById("registrationForm").addEventListener("submit", validateForm);
