import path from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function extractContextFromPDF(filename, currentPage) {
  const filePath = path.join(__dirname, 'uploads', filename);

  return new Promise((resolve, reject) => {
    const pythonCommands = ['python3', 'python', 'py'];

    function tryPython(commands, index = 0) {
      if (index >= commands.length) {
        resolve(`Context for page ${currentPage} from ${filename}`);
        return;
      }

      execFile(commands[index], ['extract_context.py', filePath, String(currentPage)], { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
          console.error(`${commands[index]} error:`, stderr || error.message);
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

export { extractContextFromPDF };


