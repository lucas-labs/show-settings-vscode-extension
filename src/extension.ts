import path = require('path');
import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
    const logger = vscode.window.createOutputChannel(
        '@lucas-labs/show-settings'
    );

    const commandId = 'show-settings-vscode.open-settings-file';
    subscriptions.push(
        vscode.commands.registerCommand(commandId, () => {
            // get the config
            const conf: string = vscode.workspace
                .getConfiguration()
                .get('show-settings-vscode.folder') as string;
				
            let folderPath: string | undefined = undefined;

            if (conf !== '.') {
                vscode.workspace.workspaceFolders?.forEach((folder) => {
                    if (folder.name === conf) {
                        folderPath = folder.uri.fsPath;
                    }
                });
            }

            if (!folderPath) {
                folderPath = path.dirname(
                    vscode.workspace.workspaceFile?.fsPath as string
                );
            }

            // get the uri of the file to open
            var openPath = vscode.Uri.parse(
                'file:///' + folderPath + '/.vscode/settings.json'
            );

            vscode.workspace.openTextDocument(openPath).then(
                (doc) => {
                    vscode.window.showTextDocument(doc);
                },
                (reason) => {
                    vscode.window.showInformationMessage(
                        `Error opening file ${openPath.fsPath}`
                    );
                    logger.appendLine(reason);
                }
            );
        })
    );

    // create a new status bar item that we can now manage
    myStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        -1000000000
    );
    myStatusBarItem.backgroundColor = '#ff0000';
    myStatusBarItem.command = commandId;
    myStatusBarItem.text = `$(settings)`;
    myStatusBarItem.tooltip = 'Open settings.json';
    subscriptions.push(myStatusBarItem);
    myStatusBarItem.show();
}
