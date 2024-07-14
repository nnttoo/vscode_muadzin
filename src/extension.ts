import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MyServer } from './myserver';
import { registerSimpleTreeProvider } from './sidebarButton';
import { MuadzinHeartBeat } from './muadzin_heartbeat';
import { MuadzinContext } from './muadzin_ctx';

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) { 

	var muadzinCtx = new MuadzinContext();
	muadzinCtx.onActivate(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('muadzin-webview', new MyWebViewProvider(context))
	);
}

class MyWebViewProvider implements vscode.WebviewViewProvider {
	private _context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this._context = context;
	}

	async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		webviewView.webview.options = {
			enableScripts: true
		};

		const panel = webviewView.webview;

		let myserver = MyServer.instance;
		var urladdress = myserver.createServer(this._context);

		const filePath = path.join(this._context.extensionPath, "resources", "htmlvue", "index.html");
		const htmlContent = await fs.promises.readFile(filePath, 'utf8');
		const finalHtml = htmlContent.replaceAll('MYSERVERADD', urladdress);
		panel.html = finalHtml;
	}
}



export function deactivate() {

	MyServer.instance.closeServer();
 }
