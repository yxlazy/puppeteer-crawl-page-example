import * as puppeteer from "puppeteer";

// 截图功能
// (async function () {
//   // 启动一个浏览器, launch接收一个options用于配置信息
//   const browser = await puppeteer.launch({
//     // 是否在headless模式下运行浏览器
//     headless: false,
//     // 是否打开Devtool,如果设置为true，headless将强制为false
//     devtools: true,
//   });

//   // 在browser上下文中，创建一个Page对象
//   const page = await browser.newPage();

//   // 加载页面
//   await page.goto('https://blog.csdn.net/qq_45484646?type=blog', {
//     // 超时时间，0为禁用超时
//     // timeout: 0,
//   });

//   // 对当前页面进行截图
//   await page.screenshot({
//     type: 'png',
//     // 保存文件的路径
//     path: 'screenshot.png',
//     // 截取整个可滚动页面的屏幕截图
//     // fullPage: true
//   });
//   // 关闭Chromium和所有的Page
//   await browser.close();
// }());

// 抓取页面信息功能
(async function () {
  // 启动一个浏览器, launch接收一个options用于配置信息
  const browser = await puppeteer.launch({
    // 是否在headless模式下运行浏览器
    headless: false,
    // 是否打开Devtool,如果设置为true，headless将强制为false
    devtools: true,
  });

  // 在browser上下文中，创建一个Page对象
  const page = await browser.newPage();

  // 加载页面
  await page.goto('https://blog.csdn.net/qq_45484646?type=blog', {
    // 超时时间，0为禁用超时
    // timeout: 0,
  });

  // 相当于浏览器中的document.querySelectorAll，但是返回的是 ElementHandle 类型
  const articles = await page.$$('.mainContent article a');
  // 用于保存一组Promise，方便Promise.all直接处理
  const collects: any[] = [];

  // 获取文章信息
  for (const article of articles) {    
    // evaluate()，对Page上下文进行计算，并返回一个值
    collects.push(await page.evaluate(article => {
      // 这里的代码是放到Page 上下文中执行的，所以在这里是不能访问外部的作用域（也就是Node环境）

      // 获取文章标题节点
      const title = article.querySelector('h4');
      // 获取文章描述节点
      const description = article.querySelector('.blog-list-content') as HTMLDivElement;
      // 获取文章阅读数节点
      const readNum = article.querySelector('.blog-list-footer .view-num');

      // 提取我们需要的文章信息
      return {
        title: title?.innerText, 
        description: description?.innerText, 
        readNum: readNum?.childNodes[0].textContent,
      };
    }, article));
  }

  // 等待所有数据成功返回
  const data = await Promise.all(collects);

  // 输出获取的数据到控制台
  console.log('[Data]\t', data);

  // 关闭Chromium和所有的Page
  await browser.close();
}());
