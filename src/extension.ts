import path = require('path');
import * as vscode from 'vscode';
import { Logger } from './utils/logger';
import commands from './commands';
import ui from './ui';

// let showProjectSettingsBtn: vscode.StatusBarItem;

export function activate(ctx: vscode.ExtensionContext) {
    Logger.log('"show-settings-vscode" extension is now active!');

    commands.activate(ctx);
    ui.activate(ctx);
}

export const deactivate = () => {};
