chcp 65001 >nul
@echo off
echo 请输入文件夹路径
set /p folderPath= 请输入:
echo 请输入匹配字符串
set /p matchStr= 请输入:
echo 请输入替换字符串
set /p replaceStr= 请输入:
npx ts-node .\fileNameModifier.ts %folderPath% %matchStr% %replaceStr%
