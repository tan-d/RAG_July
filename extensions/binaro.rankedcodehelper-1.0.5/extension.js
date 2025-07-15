// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const keytar = require('keytar');
var vscode = require('vscode');
var openAI = require('openai');
var path = require('path');

const API_KEY = 'apikey';
const EXTENSION_KEY = 'rankedcodehelper';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rankedcodehelper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let generatedHelperCommand = generateHelperCommand();
	let generatedOnSelectionHelperCommand = generateOnSelectionHelperCommand();
	let generatedNewFileCommand = generateNewFileCommand();
	let generatedSetApiKeyCommand = generateSetApiKeyCommand();

	context.subscriptions.push(generatedHelperCommand);
	context.subscriptions.push(generatedOnSelectionHelperCommand);
	context.subscriptions.push(generatedNewFileCommand);
	context.subscriptions.push(generatedSetApiKeyCommand);
}

const languageMap = {
	".java": "Java",
	".cpp": "C++",
	".py": "Python",
	".c": "C",
	".js": "JavaScript",
	".ts": "TypeScript",
	".tsx": "React",
	".vue": "Vue",
	".php": "PHP",
	".cs": "C#",
	".m": "Objective-C",
	".rb": "Ruby",
	".swift": "Swift",
}

const getExtension = () => {
	const editor = vscode.window.activeTextEditor;
	const currentFile = editor.document.fileName;
	const currentFileExt = path.extname(currentFile);
	return currentFileExt
}

function generateHelperCommand() {
	let disposable = vscode.commands.registerCommand('rankedcodehelper.rankedcodehelper', () => {
		vscode.window.showInputBox({
			placeHolder: "What do you want to do with this file?"
		}).then((input) => {
			replaceFullFile(input);
		});
	});
	return disposable;
}

function generateOnSelectionHelperCommand() {
	let disposable = vscode.commands.registerCommand('rankedcodehelper.rankedreplaceselection', () => {
		vscode.window.showInputBox({
			placeHolder: "What do you want to do with this selection?"
		}).then(prompt => {
			replaceSelection(prompt);
		})

	});
	return disposable;
}

function generateNewFileCommand() {
	let disposable = vscode.commands.registerCommand('rankedcodehelper.rankednew', () => {
		vscode.window.showInputBox({
			placeHolder: "What should the new file based on this file include?"
		}).then((input) => {
			createNewFile(input);
		});
	});
	return disposable;
}

function generateSetApiKeyCommand() {
	let disposable = vscode.commands.registerCommand('rankedcodehelper.setapikey', () => {
		vscode.window.showInputBox({
			placeHolder: "Write your api key"
		}).then((input) => {
			keytar.setPassword(EXTENSION_KEY, API_KEY, input);
		});
	});
	return disposable;
}

function replaceSelection(input) {
	keytar.getPassword(EXTENSION_KEY, API_KEY).then(apiKey => {
		if (!validate(apiKey)) return;
		if (input) {
			// Get the active text editor
			const editor = vscode.window.activeTextEditor;

			// Get the text of the current selection
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);

			// Get the start and end positions of the current selection
			const startPos = selection.start;
			const endPos = selection.end;

			let disposableStatusMessage = vscode.window.setStatusBarMessage("Loading result...");
			const openai = generateOpenAI({ apiKey });

			const language = languageMap[getExtension()]
			const useLangString = language ? `In ${languageMap[getExtension()]} programming language` : ''
			const text = selectedText ? `For this piece of code: ${selectedText}` : ''

			const prompt = `
				${input}

				${text}
				${useLangString}
			`

			generateResponse(prompt, openai, disposableStatusMessage).then(response => {
				replaceText(response, [startPos, endPos]);
			})
		};
	})
}

function createNewFile(input) {
	keytar.getPassword(EXTENSION_KEY, API_KEY).then(apiKey => {
		if (!validate(apiKey)) return;
		if (input) {
			// Get the active text editor
			const editor = vscode.window.activeTextEditor;

			// Get the text from the current file
			const fileContent = editor.document.getText();

			let disposableStatusMessage = vscode.window.setStatusBarMessage("Loading result...");
			const openai = generateOpenAI({ apiKey });

			const language = languageMap[getExtension()]
			const useLangString = language ? `In ${languageMap[getExtension()]} programming language` : ''

			const prompt = `
				${input}

				For this piece of code: ${fileContent}

				${useLangString}
				Preserve the structure of the code.
			`

			generateResponse(prompt, openai, disposableStatusMessage).then(response => {
				createNewFileWithNewData(response.data.choices[0].text);
			});
		}
	})
}

function createNewFileWithNewData(text) {
	const editor = vscode.window.activeTextEditor;

	// Get the file extension of the current file
	const currentFile = editor.document.fileName;
	const currentFileExt = path.extname(currentFile);

	let currentFolder = vscode.window.activeTextEditor.document.uri.fsPath

	const currentFolderArray = currentFolder.split('\\')
	const currentFolderPathLength = currentFolderArray.length
	const newFilePath = currentFolderArray.slice(0, currentFolderPathLength - 1).join('\\')

	const wsedit = new vscode.WorkspaceEdit();

	const pathFile = newFilePath + "/wizard-generated" + currentFileExt
	const filePath = vscode.Uri.file(pathFile);

	vscode.window.showInformationMessage(filePath.toString());

	// Vytvořte Uint8Array, který bude obsahovat bajty řetězce
	const uint8Array = new Uint8Array(text.length);

	// Projděte všechny bajty řetězce a naplňte je do Uint8Array
	for (let i = 0; i < text.length; i++) {
		uint8Array[i] = text.charCodeAt(i);
	}

	wsedit.createFile(filePath, { overwrite: true, contents: uint8Array });
	vscode.workspace.applyEdit(wsedit);

	const f = path.join(pathFile);
	const newFile = vscode.Uri.file(f);

	vscode.workspace.openTextDocument(newFile).then(function (doc) {
		vscode.window.showTextDocument(doc, {
		  preview: false
		});
	});
}

function replaceFullFile(input) {
	keytar.getPassword(EXTENSION_KEY, API_KEY).then(apiKey => {
		if (!validate(apiKey)) return;
		if (input) {
			// Get the active text editor
			const editor = vscode.window.activeTextEditor;

			// Get the text from the current file
			const fileContent = editor.document.getText();

			let disposableStatusMessage = vscode.window.setStatusBarMessage("Loading result...");
			const openai = generateOpenAI({ apiKey });

			const startPos = new vscode.Position(0, 0);
			const endPos = editor.document.lineAt(editor.document.lineCount - 1).range.end;

			const language = languageMap[getExtension()]
			const useLangString = language ? `In ${languageMap[getExtension()]} programming language` : ''

			const prompt = `
				${input}

				For this piece of code: ${fileContent}

				${useLangString}
				Preserve the structure of the code.
			`

			generateResponse(prompt, openai, disposableStatusMessage).then(response => {
				replaceText(response, [startPos, endPos]);
			});
		}
	});
}

function validate(apikey) {
	if (!apikey) {
		vscode.window.showErrorMessage("No Api key provided in settings. Please use \"RankedAI Helper Set api key\" command to provide your OpenAI api key.")
		return false;
	}
	return true;
}

function generateOpenAI(config) {
	const configuration = new openAI.Configuration({
		apiKey: config.apiKey,
	});
	const openai = new openAI.OpenAIApi(configuration);
	return openai;
}

function generateResponse(prompt, openAI, disposableStatusMessage) {
	const openAiRequestConfig = {
		model: "text-davinci-003",
		prompt,
		temperature: 0.7,
		max_tokens: 2048,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	}

	return new Promise((resolve) => {
		openAI.createCompletion(openAiRequestConfig).then((response) => {
			resolve(response)
		}).catch((error) => {
			vscode.window.showErrorMessage(error.response.data.error.message);
		}).finally(() => {
			disposableStatusMessage.dispose();
		})
	})
}

function replaceText(rankedResponse, selection) {
	// Get the active text editor
	const editor = vscode.window.activeTextEditor;

	// Replace the text of the current file with the given text
	// const newText = "This is the new text for the file";

	editor.edit((editBuilder) => {
		const [startPos, endPos] = selection
		const { text } = rankedResponse.data.choices[0]
		editBuilder.replace(new vscode.Range(startPos, endPos), (text || "Nothing found") + '\n' );
	});
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}