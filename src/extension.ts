import path = require('path');
import * as vscode from 'vscode';

let showProjectSettingsBtn: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
    const logger = vscode.window.createOutputChannel(
        '@lucas-labs/show-settings'
    );

    const showProjSettingsCmd = 'show-settings-vscode.open-settings-file';
    subscriptions.push(
        vscode.commands.registerCommand(showProjSettingsCmd, () => {
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
                if (vscode.workspace.workspaceFile?.fsPath !== undefined) {
                    folderPath = path.dirname(
                        vscode.workspace.workspaceFile?.fsPath as string
                    );
                } else if (vscode.workspace.workspaceFolders?.[0].uri.fsPath !== undefined) {
                    // use project root
                    folderPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
                } else {
                    vscode.window.showErrorMessage('No root folder found');
                    return;
                }                
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
                    vscode.window.showErrorMessage(`Error opening file ${openPath.fsPath}`);
                    logger.appendLine(reason);
                }
            );
        })
    );

    // create a new status bar item that we can now manage
    showProjectSettingsBtn = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        -1000000000
    );
    showProjectSettingsBtn.backgroundColor = '#ff0000';
    showProjectSettingsBtn.command = showProjSettingsCmd;
    showProjectSettingsBtn.text = `$(settings)`;
    showProjectSettingsBtn.tooltip = 'Open .vscode/settings.json';
    subscriptions.push(showProjectSettingsBtn);
    showProjectSettingsBtn.show();
}
