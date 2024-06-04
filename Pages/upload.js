document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const files = document.getElementById('fileInput').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    await fetch('http://your-server-address/upload', { // Update server address here
        method: 'POST',
        body: formData
    });
    alert('Files uploaded successfully!');
});
