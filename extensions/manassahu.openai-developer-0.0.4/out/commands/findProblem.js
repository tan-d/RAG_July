"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProblem = void 0;
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
const sendQuery_1 = require("./sendQuery");
async function findProblem() {
    let config = vscode.workspace.getConfiguration();
    const model = config.get("openai-developer.model");
    const selectedCode = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);
    if (selectedCode) {
        await (0, sendQuery_1.sendQuery)((model === "gpt-turbo") ? "Why code is not working:\n" + selectedCode : selectedCode + "\n");
    }
    else {
        vscode.window.showErrorMessage('Please select the code to get response from OpenAI');
        return;
    }
}
exports.findProblem = findProblem;
//# sourceMappingURL=findProblem.js.map