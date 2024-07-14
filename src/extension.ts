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

	var muadzinCtx = MuadzinContext.instance;
	muadzinCtx.onActivate(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('muadzin-webview', new MyWebViewProvider())
	);
}

class MyWebViewProvider implements vscode.WebviewViewProvider {

	async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		webviewView.webview.options = {
			enableScripts: true
		};

		const panel = webviewView.webview;

		let muadzin_context = MuadzinContext.instance;  
		var urladdress = muadzin_context.getServerAddressAndStart();

		const filePath = path.join(muadzin_context.getExtensionPath(), "resources", "htmlvue", "index.html");
		const htmlContent = await fs.promises.readFile(filePath, 'utf8');
		const finalHtml = htmlContent.replaceAll('MYSERVERADD', urladdress);
		panel.html = finalHtml;
	}
}



export function deactivate() {

	MuadzinContext.instance.onDeactivate();
}
