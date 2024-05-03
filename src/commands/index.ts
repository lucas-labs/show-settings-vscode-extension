import { openFolderSettingsCmd } from './settings-folder';
import { commands as vscodeCommands } from 'vscode';
import { openWorkspaceSettingsCmd } from './settings-workspace';

const all = {
    openFolderSettings: {
        name: 'show-settings-vscode.open-settings-file',
        action: openFolderSettingsCmd,
    },
    openWorkspaceSettingsCmd: {
        name: 'show-settings-vscode.open-workspace-file',
        action: openWorkspaceSettingsCmd,
    },
};

const activate = ({ subscriptions }: { subscriptions: any[] }) => {
    const cmds = Object.keys(all).map((key) => {
        const cmd = all[key as keyof typeof all];
        return vscodeCommands.registerCommand(cmd.name, cmd.action);
    });

    subscriptions.push(...cmds);
};

export default {
    all,
    activate,
};
