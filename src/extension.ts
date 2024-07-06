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

function openWebView(context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		'webViewExample',
		'Muadzin Setting',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			
		}
	);

	const scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(
		path.join(context.extensionPath, 'resources', 'media', 'script.js')
	));

	let myserver = MyServer.instance;
	var urladdress = myserver.createServer();

	


	let htmlContent = `
	<html>
		<body>
			<h1>Ini dia test aja</h1>
			<textarea id="myresponse"></textarea>
			<script> 
				(async () => {
					let myserveradd = "MYSERVERADD"; 
					console.log("start request " + myserveradd);
					let r = await fetch(myserveradd);
					let txt = await r.text();
			
					/** @type {HTMLTextAreaElement} **/             
					var elemResponse =  document.querySelector("#myresponse") ;
					elemResponse.value = txt;            
					console.log(myserveradd);
				})(); 
			</script>
		</body>
	</html>
	`;

	const finalHtml = htmlContent.replace('MYSERVERADD', urladdress);

	panel.webview.html = finalHtml
}

export function deactivate() { }
