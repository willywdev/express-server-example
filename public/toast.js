// Toast notification utility
// This file handles all success and error messages

// Create the toast instance (Notyf is loaded from CDN)
const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' }
});

// Success message
function showSuccess(message) {
  notyf.success(message);
}

// Error message
function showError(message) {
  notyf.error(message);
}
