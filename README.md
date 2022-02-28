# README

该爬虫没用到Cheerio这类分析工具，主要是因为天天基金的数据源获取太简单了，直接通过浏览器的开发者工具定位到了它的数据包，所以不需要太多爬取操作，直接用https发起请求即可。关于数据包的定位操作，灵感源自：https://www.toutiao.com/i7042941358768062983

</br>
但天天基金网做了反爬虫处理，所以这里有两个点要注意：

1. 直接爬取html是不会有结果的，结果以数据包的形式需要额外获取
2. 定位数据包后，要对请求的header进行伪装处理，不然会返回没有权限的结果

<br>
如果嫌麻烦可以直接在这个网页的 output 路径下下载资料

<br>
使用方法(不完善，要梯子和编程基础，后面再简化)：

```bash
# 起步：
1. 选择一个目录放东西
2. Win+R，输入 powershell 

# 安装Scoop(Win)
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
iwr -useb get.scoop.sh | iex

# 安装Node.js
scoop install node

# 下载项目(可能需要代理)
git clone https://github.com/Gua16/fund-spider.git

# 启动NPM，安装依赖
npm init
npm install

# 执行程序(封装好了)
npm start

# 查收结果
前往该程序的 output 文件夹
```