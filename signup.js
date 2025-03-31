document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const passwordInput = document.getElementById("password");
    const passwordFeedback = document.getElementById("password-feedback");
  
    // Evaluate password strength as the user types
    passwordInput.addEventListener("input", function () {
      const password = passwordInput.value;
      const result = evaluatePasswordStrength(password);
      passwordFeedback.textContent =
        "Password Strength: " + result.strength +
        (result.valid ? "" : " — Must be at least 8 characters, include one uppercase letter, one digit, and one special character (!@#$%^&*).");
    });
  
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = passwordInput.value;
      const confirmPassword = document.getElementById("confirm-password").value;
  
      const result = evaluatePasswordStrength(password);
      if (!result.valid) {
        passwordFeedback.textContent =
          "Password does not meet requirements. Must be at least 8 characters, include one uppercase letter, one digit, and one special character (!@#$%^&*).";
        return;
      }
  
      if (password !== confirmPassword) {
        passwordFeedback.textContent = "Passwords do not match.";
        return;
      }
  
      // Create user with Firebase Authentication
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User signed up:", user.uid);
          // Save additional user details, including chosen username
          db.collection("users").doc(user.uid).set({
            username: username,
            name: name,
            email: email,
            createdAt: new Date().toISOString()
          })
          .then(() => {
            alert("Sign up successful!");
            window.location.href = "index.html";
          })
          .catch((error) => {
            console.error("Error storing user data:", error);
          });
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          passwordFeedback.textContent = error.message;
        });
    });
  
    function evaluatePasswordStrength(password) {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[!@#$%^&*]/.test(password)) score++;
  
      const valid = password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password);
      let strength = "Weak";
      if (score === 4) {
        strength = "Very Strong";
      } else if (score === 3) {
        strength = "Strong";
      } else {
        strength = "Weak";
      }
      return { valid, strength };
    }
  });