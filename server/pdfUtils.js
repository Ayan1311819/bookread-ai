const path = require('path');
const { execFile } = require('child_process');

function extractContextFromPDF(filename, currentPage) {
  const filePath = path.join(__dirname, 'uploads', filename);

  return new Promise((resolve, reject) => {
    execFile('C:\\Users\\Hp\\anaconda3\\envs\\bookread\\python.exe', ['extract_context.py', filePath, String(currentPage)], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python error:', stderr || error.message);
        return reject(error);
      }

      try {
        const result = JSON.parse(stdout);
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result.context);
        }
      } catch (e) {
        reject('Invalid JSON from Python script');
      }
    });
  });
}

module.exports = { extractContextFromPDF };

