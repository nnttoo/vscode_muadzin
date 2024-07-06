import * as vscode from 'vscode';
import { muadzinRegisterButton } from './sidebarButton';

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) { 

	muadzinRegisterButton(context,[
		{
			commandName : "muadzin_openwebview",
			method : ()=>{

				vscode.window.showInformationMessage('Hello World open webview loh');

				const panel = vscode.window.createWebviewPanel(
					'webViewExample', // Identifikasi untuk webview
					'WebView Example', // Judul untuk panel
					vscode.ViewColumn.One, // Editor column untuk menampilkan webview
					{} // Opsi tambahan untuk WebView
				);
	
				// Konten HTML untuk ditampilkan di WebView
				panel.webview.html = `
				<html>
					<body>
						<h1>Hallow Ma brooo</h1>
					</body>
				</html>
				`
			},
			name : "Muadzin Setting"
		}
	]);
} 

export function deactivate() {}
