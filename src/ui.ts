import * as vscode from 'vscode';
import commands from './commands';
import { getFolderSettingsPath } from './commands/settings-folder';

const createStatusBarBtn = (
    idx: number,
    command: string,
    text: string = `$(settings)`,
    tooltip: string,
    color?: string | vscode.ThemeColor
) => {
    let showProjectSettingsBtn = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        -1000000000 + idx
    );
    showProjectSettingsBtn.command = command;
    showProjectSettingsBtn.text = text;
    showProjectSettingsBtn.tooltip = tooltip;
    showProjectSettingsBtn.color = color;
    showProjectSettingsBtn.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.remoteBackground'
    );
    showProjectSettingsBtn.show();

    return showProjectSettingsBtn;
};

function activate({ subscriptions }: vscode.ExtensionContext) {
    const uiItems = [];

    if (shouldCreateFolderSettingsBtn()) {
        let showProjectSettingsBtn = createStatusBarBtn(
            0,
            commands.all.openFolderSettings.name,
            `$(settings)`,
            'Open .vscode/settings.json'
        );
        uiItems.push(showProjectSettingsBtn);
    }

    if (shouldCreateWorkspaceSettingsBtn()) {
        let showWorkspaceSettingsBtn = createStatusBarBtn(
            1,
            commands.all.openWorkspaceSettingsCmd.name,
            `$(vscode-insiders)`,
            'Open workspace settings',
            '#9da5b480'
        );
        uiItems.push(showWorkspaceSettingsBtn);
    }

    subscriptions.push(...uiItems);
}

function shouldCreateFolderSettingsBtn() {
    return getFolderSettingsPath() !== undefined;
}

function shouldCreateWorkspaceSettingsBtn() {
    return vscode.workspace.workspaceFolders !== undefined;
}

export default {
    activate,
};
