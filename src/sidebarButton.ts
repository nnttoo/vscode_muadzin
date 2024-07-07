/**
 * file ini sebenarnya sudah tidak digunakan lagi dalam muadzin reminder
 * namun masih disimpan disini untuk dokumentasi
 * 
 */


import * as vscode from 'vscode';
import { MyServer } from './myserver';
import path from 'path';
import * as fs from 'fs';


export type ButtonInfo = {
    name: string,
    commandName: string,
    method: () => void
}


class PackageDependenciesProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public listButton: ButtonInfo[] = [];

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        if (!element) {
            return this.listButton.map((l) => {

                var btn = new vscode.TreeItem(l.name);
                btn.command = {
                    command: l.commandName,
                    title: l.name,
                    arguments: [],

                }

                return btn;
            });
        }
        return [];
    }
}



export function registerSimpleTreeProvider(context: vscode.ExtensionContext, viewid: string, listButton: ButtonInfo[]) {

    ///daftarkan dulu commandnnya
    listButton.forEach((btn) => {
        let cmdRegistred = vscode.commands.registerCommand(btn.commandName, () => {
            btn.method();
        });

        context.subscriptions.push(cmdRegistred);

    });


    // masukan buttonnya
    // memang agak repot tapi ini cara paling sederhana.
    var provider = new PackageDependenciesProvider();
    provider.listButton = listButton;

    // package-dependencies harus sama dengan packagejson   : 
    //  
    // 
    // "views": {
    //     "muadzin-setting": [
    //       {
    //         "id": "package-dependencies",
    //         "name": "Muadzin"
    //       }
    //     ]
    //   }

    context.subscriptions.push(
        vscode.window.registerTreeDataProvider(viewid, provider)
    );
}

export function registerSiderbarButton(context: vscode.ExtensionContext) {
    registerSimpleTreeProvider(
        context,
        "muadzin-button",
        [
            {
                commandName: "muadzin_openwebview",
                method: () => {
                    openWebView(context);
                },
                name: "Muadzin Setting"
            }
        ]
    );
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


	const filePath = path.join(context.extensionPath, "resources", "htmlvue", "index.html");
	const htmlContent = await fs.promises.readFile(filePath, 'utf8');
	const finalHtml = htmlContent.replaceAll('MYSERVERADD', urladdress);
	panel.webview.html = finalHtml

}