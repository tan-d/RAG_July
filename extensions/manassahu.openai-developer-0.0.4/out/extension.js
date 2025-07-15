"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
/**
 * @author Manas Sahu
 * https://github.com/mrsahugit/openai-developer
 *
 * @license
 * Copyright (c) 2023 - Present, Manas Sahu
 *
 * All rights reserved. Code licensed under the MIT license
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */
const vscode = require("vscode");
const extensionVariables_1 = require("./extensionVariables");
const ChatProvider_1 = require("./views/ChatProvider");
const changeAPIKey_1 = require("./commands/changeAPIKey");
const startConversation_1 = require("./commands/startConversation");
const explainCode_1 = require("./commands/explainCode");
const findProblem_1 = require("./commands/findProblem");
const generateImage_1 = require("./commands/generateImage");
function activate(context) {
    extensionVariables_1.ext.context = context;
    const outputChannel = vscode.window.createOutputChannel("OpenAI Developer");
    extensionVariables_1.ext.outputChannel = outputChannel;
    context.subscriptions.push(outputChannel);
    const provider = new ChatProvider_1.ChatProvider();
    vscode.window.registerWebviewViewProvider("openai-developer-chatview", provider, {
        webviewOptions: { retainContextWhenHidden: true }
    });
    let disposableChangeAPIKey = vscode.commands.registerCommand('openai-developer.changeAPIKey', async () => {
        await (0, changeAPIKey_1.changeAPIKey)(true);
    });
    let disposableStartConversation = vscode.commands.registerCommand('openai-developer.startConversation', async () => {
        await (0, startConversation_1.startConversation)();
    });
    let disposableExplainCode = vscode.commands.registerCommand('openai-developer.explainCode', async () => {
        await (0, explainCode_1.explainCode)();
    });
    let disposableFindProblem = vscode.commands.registerCommand('openai-developer.findProblem', async () => {
        await (0, findProblem_1.findProblem)();
    });
    let disposableGenerateImage = vscode.commands.registerCommand('openai-developer.generateImage', async () => {
        await (0, generateImage_1.generateImage)();
    });
    context.subscriptions.push(disposableChangeAPIKey, disposableStartConversation, disposableExplainCode, disposableFindProblem, disposableGenerateImage);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map