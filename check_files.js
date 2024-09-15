const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts');

function getAllFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let fileList = [];

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      fileList = [...fileList, ...getAllFiles(filePath)];
    } else if (file.name.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

const allFiles = getAllFiles(postsDirectory);
console.log('All Markdown files:');
allFiles.forEach(file => {
  console.log(file);
  // 尝试读取文件内容
  try {
    fs.readFileSync(file, 'utf8');
    console.log('  - File can be read successfully');
  } catch (error) {
    console.error(`  - Error reading file: ${error.message}`);
  }
});
