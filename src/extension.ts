// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path');
import * as vscode from 'vscode';



// // this method is called when your extension is activated
// // your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {
	
// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "show-settings-vscode" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('show-settings-vscode.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from show-settings-vscode!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // this method is called when your extension is deactivated
// export function deactivate() {}


let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
	const logger = vscode.window.createOutputChannel("@lucas-labs/show-settings");

	const commandId = 'show-settings-vscode.open-settings-file';
	subscriptions.push(vscode.commands.registerCommand(commandId, () => {
		// obtengo la config
		const conf: string = vscode.workspace.getConfiguration().get('show-settings-vscode.folder') as string;
		let folderPath: string | undefined = undefined;

		if(conf !== '.') {
			vscode.workspace.workspaceFolders?.forEach(folder => {
				if(folder.name === conf) {
					folderPath = folder.uri.fsPath;
				}
			});
		}

		if(!folderPath) {
			folderPath = path.dirname(vscode.workspace.workspaceFile?.fsPath as string);
		}
		
		// Obtengo el Uri a abrir
		var openPath = vscode.Uri.parse("file:///" + folderPath + '/.vscode/settings.json'); //A request file path
		vscode.workspace.openTextDocument(openPath)
			.then(
				doc => {
					vscode.window.showTextDocument(doc);
				},
				(reason) => {
					vscode.window.showInformationMessage(`Error abriendo archivo ${openPath.fsPath}`);
					logger.appendLine(reason);
				}
			);
	}));

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		-1000000000
	);
	myStatusBarItem.backgroundColor = '#ff0000';
	myStatusBarItem.command = commandId;
	myStatusBarItem.text = `$(settings)`;
	myStatusBarItem.tooltip = "Open settings.json";
	subscriptions.push(myStatusBarItem);

	myStatusBarItem.show();
}
