const vscode = require('vscode');
const path = require('path');

/**
 *渲染 webView
 *
 * @param {*} context
 */
function webViewRender(context) {
    this.context = context;
    this.panel = undefined;
}

webViewRender.prototype.show = function () {
    if (this.panel) {
        this.panel.reveal();
    } else {
        this.panel = vscode.window.createWebviewPanel("tangwei", "汤唯", vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        const imagePath = vscode.Uri.file(path.join(this.context.extensionPath, 'images', 'tangwei.jpg')).with({
            scheme: 'vscode-resource'
        });

        this.panel.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>汤唯</title>
        </head>
        <body>
            <div><h1>小哥哥~ 代码写久了，该休息啦~</h1></div>
            <img src="${imagePath}"/>
        </body>
        </html>`;

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }
}
/**
 *开始轮询 隔时间提醒
 *
 * @param {*} context
 */
function start(context) {
    setInterval(() => {
        const webViewRenderObj = new webViewRender(context)
        webViewRenderObj.show()
    }, 1000 * 60 * vscode.workspace.getConfiguration("tangwei").get('renderViewIntervalInMinutes'));
}
/**
 * 安装注册插件
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    start(context);
    let disposable = vscode.commands.registerCommand('extension.tangwei', function () {
        const webViewRenderObj = new webViewRender(context)
        webViewRenderObj.show()
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}