import * as vscode from 'vscode';


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
                    command : l.commandName,
                    title : l.name,
                    arguments : [],
                    
                }
                
                return btn;
            });
        }
        return [];
    }
}



export function muadzinRegisterButton(context: vscode.ExtensionContext, listButton: ButtonInfo[]) {

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
    vscode.window.registerTreeDataProvider('package-dependencies',   provider); 
}