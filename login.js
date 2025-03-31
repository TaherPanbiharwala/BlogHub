document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const loginFeedback = document.getElementById("login-feedback");
  
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
  
      // Sign in using Firebase Authentication
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("User logged in:", userCredential.user.uid);
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          loginFeedback.textContent = error.message;
        });
    });
  });