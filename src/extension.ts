import * as vscode from 'vscode';
import { muadzinRegisterButton } from './sidebarButton';
import * as fs from 'fs';
import * as path from 'path';
import { MyServer } from './myserver';

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {

	muadzinRegisterButton(context, [
		{
			commandName: "muadzin_openwebview",
			method: () => { 
				openWebView(context);
			},
			name: "Muadzin Setting"
		}
	]);
}

async function openWebView(context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		'webViewExample',
		'Muadzin Setting',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			
		}
	);

	 
	let myserver = MyServer.instance;
	var urladdress = myserver.createServer(context);

	
	const filePath = path.join(context.extensionPath, "resources","htmlvue", "index.html"); 
	const htmlContent = await fs.promises.readFile(filePath,   'utf8');  
	const finalHtml = htmlContent.replaceAll('MYSERVERADD', urladdress); 
	panel.webview.html = finalHtml
}

export function deactivate() { }
