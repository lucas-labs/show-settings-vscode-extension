import path = require('path');
import * as vscode from 'vscode';
import { Logger } from '../utils/logger';

export const openFolderSettingsCmd = () => {
    // get the config
    const folderPath = getFolderSettingsPath();

    if (!folderPath) {
        Logger.info('No root folder found');
        vscode.window.showErrorMessage('No root folder found');
        return;
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
            vscode.window.showErrorMessage(
                `Error opening file ${openPath.fsPath}`
            );
            Logger.error(reason);
        }
    );
};

export function getFolderSettingsPath(): string | undefined {
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
        } else if (
            vscode.workspace.workspaceFolders?.[0].uri.fsPath !== undefined
        ) {
            // use project root
            folderPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        } else {
            return;
        }
    }

    return folderPath;
}
