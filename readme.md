## 一个jandan的第三方Terminal客户端
支持阅读 树洞、问答板块，并且可以查看吐槽。
仅支持浏览，不支持oo xx 和评论。

使用：
```bash
node treehole.js
node qa.js
```
## node 安装方法
如果你没用过node。我建议你使用nvm安装node，不仅能管理多版本，安装也非常快。

https://github.com/nvm-sh/nvm

https://github.com/coreybutler/nvm-windows

nvm 安装 使用 指定版本 node
WINDOWS 装完后要重启才能用
```
nvm install 20.11.1
nvm use 20.11.1
```

## 截图
![image](https://github.com/user-attachments/assets/29a01e81-dc3a-4399-9b5b-214ddc1aa435)
![image](https://github.com/user-attachments/assets/2acc50eb-ffa9-4954-a1a8-54e6be0bde8c)

## 推荐
windows电脑可以配合 [magpie](https://github.com/Blinue/Magpie) 使用。magpie是一个能够全屏任意窗口的小软件。  
用在terminal上就可以相当于把字放的非常大，很适合老年人）


## 快捷方式
mac/linux 可以使用zshrc/bashrc  
```
alias jdtreehole='node "$HOME/jandannode/treehole.js"'
alias jdqa='node "$HOME/jandannode/qa.js"'
```

windows可以使用  code $PROFILE  

```
function jdtreehole {
	node "C:\Users\x\Documents\GitHub\jandannode\treehole.js"
}
function jdqa {
	node "C:\Users\x\Documents\GitHub\jandannode\qa.js"
}
```

如果报错 需要在powershell中执行 
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```
