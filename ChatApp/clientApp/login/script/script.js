function confirmPass(input) {
  if (input.value != document.getElementById("signUpPassword").value) {
    input.setCustomValidity("Passwords do not match");
  } else {
    input.setCustomValidity("");
  }
}
