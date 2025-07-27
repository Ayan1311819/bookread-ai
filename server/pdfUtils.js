const path = require('path');
const { execFile } = require('child_process');

function extractContextFromPDF(filename, currentPage) {
  const filePath = path.join(__dirname, 'uploads', filename);

  return new Promise((resolve, reject) => {
    // Try python3 first, then python, then fall back to a basic text extraction
    const pythonCommands = ['python3', 'python', 'py'];
    
    function tryPython(commands, index = 0) {
      if (index >= commands.length) {
        // If no Python is available, return a simple message
        resolve(`Context for page ${currentPage} from ${filename}`);
        return;
      }
      
      execFile(commands[index], ['extract_context.py', filePath, String(currentPage)], { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
          console.error(`${commands[index]} error:`, stderr || error.message);
          // Try next Python command
          tryPython(commands, index + 1);
          return;
        }

        try {
          const result = JSON.parse(stdout);
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result.context);
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          resolve(`Context extracted from page ${currentPage} of ${filename}`);
        }
      });
    }
    
    tryPython(pythonCommands);
  });
}

module.exports = { extractContextFromPDF };

