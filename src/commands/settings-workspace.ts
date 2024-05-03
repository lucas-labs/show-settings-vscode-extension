// import path = require('path');
import * as vscode from 'vscode';
import { Logger } from '../utils/logger';

export const openWorkspaceSettingsCmd = () => {
    const file = vscode.workspace.workspaceFile;

    if (!file) {
        Logger.info('No workspace file found');
        return;
    } else {
        Logger.info('Opening workspace settings file', file);
    }

    vscode.workspace.openTextDocument(file).then(
        (doc) => {
            vscode.window.showTextDocument(doc);
        },
        (reason) => {
            vscode.window.showErrorMessage(`Error opening file ${file}`);
            Logger.error(reason);
        }
    );
};
