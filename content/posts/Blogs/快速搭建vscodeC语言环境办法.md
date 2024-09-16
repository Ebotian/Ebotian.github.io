---
date: 2023-03-08
---

# Vscode + C + Git(connected to github)

* 1. install [vscode](https://code.visualstudio.com/)
* 2. sign in my account in vscode with my github account(probably need VPN)
* 3. turn sync on and wait auto sync installing complete
* 4. copy my `MinGW` folder below your `C:`
* 5. open vscode and create a work folder(e.g. `my-program`)
* 6. create a c file like `hello.c`, press `<F5>` to see if it can run and debug
* 7. failed? don't be worry. Extensions will auto create folder `.vscode` to trying fix it. We just need to give it a helping hand:
* 8. create `.vscode\tasks.json` including these:

```json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "C/C++: gcc.exe 建置使用中檔案",
            "command": "C:\\MinGW\\bin\\gcc.exe",
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
            ],
            "options": {
                "cwd": "${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "偵錯工具產生的工作。"
        }
    ],
    "version": "2.0.0"
}
```

and `.vscode\lanuch.json`:

```json
{
    "configurations": [
        {
            "name": "C/C++: gcc.exe 建置及偵錯使用中的檔案",
            "type": "cppdbg",
            "request": "launch",
            "program": "${fileDirname}\\${fileBasenameNoExtension}.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "miDebuggerPath": "C:\\MinGW\\bin\\gdb.exe",
            "setupCommands": [
                {
                    "description": "啟用 gdb 的美化顯示",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "將反組譯碼變體設為 Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                }
            ],
            "preLaunchTask": "C/C++: gcc.exe 建置使用中檔案"
        }
    ],
    "version": "2.0.0"
}
```

then  it should run successfully now.

* 9. `[optional]` sync with Git:
  * 1. install git([git for windows](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)) / (suggest)[github desktop](https://desktop.github.com/)
  * 2. sign up your github account
  * 3. create your repository in `github-desktop.exe` or website(need to link to git later)
  * 4. use your repository local folder as your work folder happily
  * 5. start

***

## <font color =#30dff3>hope you have a nice programming environment</font>

### <font color =#30dff3>and thanks for reading^^</font>
