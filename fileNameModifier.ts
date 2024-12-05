import * as fs from "fs";
import * as path from "path";

function Main(folderPath: string, matchStr: string, replaceStr: string) {
  const regex = new RegExp(matchStr);
  console.log("开始检测文件夹:", folderPath);

  const stack = [folderPath]; // 使用栈来管理遍历的文件夹
  while (stack.length) {
    const currentPath = stack.pop()!; // 获取当前文件夹路径
    const files = fs.readdirSync(currentPath); // 读取文件夹中的文件和子文件夹

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // 如果是文件夹，加入栈中进行递归遍历
        stack.push(filePath);
      } else if (stat.isFile()) {
        // 如果是文件，检查是否匹配
        if (file.match(regex)) {
          console.log("原文件名:", file);
          console.log("新文件名:", file.replace(regex, replaceStr));

          // 如果需要修改文件名，可以取消注释以下代码
          // fs.renameSync(filePath, path.join(currentPath, file.replace(regex, replaceStr)));
        }
      }
    });
  }
}

// 获取命令行参数
var folderPath = process.argv[2];
if (!folderPath) {
  console.error("缺少必要的参数[folderPath]");
  process.exit(1);
}
console.log("参数[folderPath]:", folderPath);

var matchStr = process.argv[3];
if (!matchStr) {
  console.error("缺少必要的参数[matchStr]");
  process.exit(1);
}
console.log("参数[matchStr]:", matchStr);

var replaceStr = process.argv[4];
if (!replaceStr) {
  replaceStr = "";
}
console.log("参数[replaceStr]:", replaceStr);

// 调用主函数
Main(folderPath, matchStr, replaceStr);

// 等待输入任意字符结束
console.log("按任意键退出...");
process.stdin.setRawMode(true); // 设置为原始模式
process.stdin.resume(); // 恢复输入流
