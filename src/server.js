// ===== IMPORT LIBRARIES =====
// These are tools we use to build the server
import express from 'express';           // Web server framework
import { fileURLToPath } from 'url';     // Get current file path
import path from 'path';                 // Work with folder paths
import fs from 'fs';                     // Read/write files on computer

// ===== SETUP =====
// Get the folder where this file is located
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a web server
const app = express();

// Set the port (like a door number for the server)
const PORT = 3000;

// Tell the server to accept JSON data from the website
app.use(express.json());

// Tell the server where the website files are (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// ===== ROUTES (URLs the website can visit) =====

// When you visit http://localhost:3000/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'test.html'));
});

// When the website asks: "What files are in the temp folder?"
app.get('/api/temp-files', (req, res) => {
  const tempDir = path.join(__dirname, '../temp');
  
  // Read all files from the temp folder
  fs.readdir(tempDir, (err, files) => {
    // If something goes wrong, send an error message
    if (err) {
      res.status(500).json({ error: 'Failed to read directory' });
      return;
    }
    // Send the list of files back to the website
    res.json({ files: files || [] });
  });
});

// When the website asks: "Create a new file for me"
app.post('/api/create-file', (req, res) => {
  // Get filename and content from the website
  const { filename, content } = req.body;
  
  // Check if filename is empty
  if (!filename || !filename.trim()) {
    res.status(400).json({ error: 'Filename is required' });
    return;
  }
  
  // Create the full path for the new file
  const filePath = path.join(__dirname, '../temp', filename);
  
  // Write the file to disk
  fs.writeFile(filePath, content || '', (err) => {
    // If something goes wrong, send an error message
    if (err) {
      res.status(500).json({ error: 'Failed to create file' });
      return;
    }
    // File created successfully! Send success message
    res.json({ message: 'File created successfully', filename });
  });
});

// When the website asks: "Delete a file for me"
app.post('/api/delete-file', (req, res) => {
  // Get filename from the website
  const { filename } = req.body;
  
  // Check if filename is empty
  if (!filename || !filename.trim()) {
    res.status(400).json({ error: 'Filename is required' });
    return;
  }
  
  // Protect the .gitkeep file - don't allow deletion
  if (filename === '.gitkeep') {
    res.status(403).json({ error: 'Cannot delete .gitkeep' });
    return;
  }
  
  // Create the full path for the file to delete
  const filePath = path.join(__dirname, '../temp', filename);
  
  // Delete the file from disk
  fs.unlink(filePath, (err) => {
    // If something goes wrong, send an error message
    if (err) {
      res.status(500).json({ error: 'Failed to delete file' });
      return;
    }
    // File deleted successfully! Send success message
    res.json({ message: 'File deleted successfully', filename });
  });
});

// 🎉 EASTER EGG ENDPOINT - Calls a free API and logs to server console
app.get('/api/easter-egg', async (req, res) => {
  try {
    // Call a free API (Advice Slip API - gives random advice)
    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    const advice = data.slip.advice;

    // Log fun message to the server console
    console.log('\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║     🎉 EASTER EGG TRIGGERED! 🎉      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('\n💡 Advice for the programmer:');
    console.log(`   "${advice}"`);
    console.log('\n✨ Keep coding, you\'re doing great!\n');

    // Send response back to browser
    res.json({ 
      message: 'Easter egg found!',
      advice: advice
    });
  } catch (error) {
    console.log('❌ Easter egg error:', error.message);
    res.status(500).json({ error: 'Easter egg failed' });
  }
});

// ===== START THE SERVER =====
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
