import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path'; 
import { MuadzinContext } from './muadzin_ctx';
import { HtmlGetter } from './html_getter';

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
 
	MuadzinContext.instance.onActivate(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('muadzin-webview', new MyWebViewProvider())
	);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('muadzin-webview-adzan', new MyWebViewProvider())
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
 
		var urladdress =MuadzinContext.instance.urlAddress ; 
		panel.html = await HtmlGetter.getInstance().getIframeHtml(urladdress);
	}
}



export function deactivate() {

	MuadzinContext.instance.onDeactivate();
}
