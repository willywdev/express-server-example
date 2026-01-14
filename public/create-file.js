function deleteFile(filename) {
  fetch('/api/delete-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          showSuccess('File deleted successfully!');
          refreshFiles();
        } else {
          showError('Error deleting file: ' + data.error);
        }
      })
      .catch(error => showError('Error: ' + error.message));

}

function refreshFiles() {
  fetch('/api/temp-files')
    .then(res => res.json())
    .then(data => {
      const fileList = document.getElementById('fileList');
      const filteredFiles = data.files.filter(file => file !== '.gitkeep');
      if (filteredFiles.length === 0) {
        fileList.innerHTML = '<p class="empty">No files yet</p>';
      } else {
        fileList.innerHTML = filteredFiles
          .map(file => '<div class="file-item"><span>📄 ' + file + '</span><button class="delete-btn" onclick="deleteFile(\'' + file + '\')">Delete</button></div>')
          .join('');
      }
    });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const filename = document.getElementById('filename').value;
  const content = document.getElementById('content').value;

  fetch('/api/create-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        showSuccess('✅ File created successfully!');
        document.getElementById('createFileForm').reset();
        refreshFiles();
      } else {
        throw new Error(data.error);
      }
    })
    .catch(error => {
      showError('❌ Error: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('createFileForm').addEventListener('submit', handleFormSubmit);
  refreshFiles();
  setInterval(refreshFiles, 1000);

  // 🎉 EASTER EGG: Type "AM" to trigger server-side Easter egg
  let keySequence = '';
  const easterEggCode = 'am';

  document.addEventListener('keypress', (e) => {
    keySequence += e.key.toLowerCase();
    if (keySequence.length > 2) {
      keySequence = keySequence.slice(-2);
    }

    if (keySequence === easterEggCode) {
      triggerEasterEgg();
      keySequence = '';
    }
  });
});

// Call the Easter egg API endpoint
function triggerEasterEgg() {
  fetch('/api/easter-egg')
    .then(res => res.json())
    .catch(error => console.error('Easter egg error:', error));
}
