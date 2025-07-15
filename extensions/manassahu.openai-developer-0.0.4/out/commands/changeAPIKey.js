"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAPIKey = void 0;
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
const extensionVariables_1 = require("../extensionVariables");
async function changeAPIKey(override = false) {
    const secrets = extensionVariables_1.ext.context.secrets;
    const existingOpenAIKey = await secrets.get("OpenAIKey");
    if (existingOpenAIKey && !override) {
        return existingOpenAIKey;
    }
    const key = await vscode.window.showInputBox({
        title: "OpenAI API Key",
        prompt: "Please enter your OpenAI API key. You can find this at https://platform.openai.com/account/api-keys",
        ignoreFocusOut: true,
        placeHolder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    });
    if (!key) {
        vscode.window.showErrorMessage('Sorry, the OpenAI Key could not be changed.');
        return "";
    }
    secrets.store("OpenAIKey", key);
    vscode.window.showInformationMessage('Key updated sucessfully.');
    return key;
}
exports.changeAPIKey = changeAPIKey;
//# sourceMappingURL=changeAPIKey.js.map