function showMessage() {
  const msg = document.getElementById('message');
  msg.textContent = '✅ App is running! Deployed via Jenkins Pipeline.';
  msg.classList.remove('hidden');
}
