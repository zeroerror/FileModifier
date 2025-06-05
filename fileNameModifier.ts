import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function Main(folderPath: string, matchStr: string, replaceStr: string) {
  const regex = new RegExp(matchStr);
  console.log("开始检测文件夹:", folderPath);

  // 先收集所有将被重命名的文件
  const pendingRenames: {
    dir: string;
    oldName: string;
    newName: string;
    fullPath: string;
  }[] = [];
  const stack = [folderPath];
  while (stack.length) {
    const currentPath = stack.pop()!;
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        stack.push(filePath);
      } else if (stat.isFile()) {
        if (file.match(regex)) {
          const newName = file.replace(regex, replaceStr);
          pendingRenames.push({
            dir: currentPath,
            oldName: file,
            newName,
            fullPath: filePath,
          });
        }
      }
    }
  }

  // 显示所有将要修改的文件
  if (pendingRenames.length === 0) {
    console.log("没有找到需要修改的文件。");
    return;
  }
  console.log("将要修改以下文件：");
  for (const item of pendingRenames) {
    console.log(`文件夹: ${item.dir}`);
    console.log(`  原文件名: ${item.oldName}`);
    console.log(`  新文件名: ${item.newName}`);
  }

  // 询问用户是否确认
  const answer = await askQuestion("是否确认重命名这些文件？(y/n): ");
  if (answer.trim().toLowerCase() !== "y") {
    console.log("已取消修改。");
    return;
  }

  // 执行重命名
  for (const item of pendingRenames) {
    fs.renameSync(item.fullPath, path.join(item.dir, item.newName));
    console.log(`已重命名: ${item.oldName} -> ${item.newName}`);
  }
  console.log("全部重命名完成。");
}

// 默认参数
const DEFAULT_FOLDER_PATH =
  "D:\\Maken6\\Assets\\Res\\GamePlay\\Config\\ActionOption";
const DEFAULT_MATCH_STR = "action_option";
const DEFAULT_REPLACE_STR = "build";

// 获取命令行参数或用默认值
const folderPath = process.argv[2] || DEFAULT_FOLDER_PATH;
const matchStr = process.argv[3] || DEFAULT_MATCH_STR;
const replaceStr = process.argv[4] || DEFAULT_REPLACE_STR;

console.log("参数[folderPath]:", folderPath);
console.log("参数[matchStr]:", matchStr);
console.log("参数[replaceStr]:", replaceStr);

Main(folderPath, matchStr, replaceStr);
