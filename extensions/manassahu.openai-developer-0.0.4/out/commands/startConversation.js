"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConversation = void 0;
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
async function startConversation() {
    const q = await vscode.window.showInputBox({
        title: "OpenAI Developer: Start Conversation",
        prompt: "Ask anything",
        ignoreFocusOut: true,
        placeHolder: "Query",
    });
    if (q) {
        await (0, sendQuery_1.sendQuery)(q);
    }
    else {
        vscode.window.showErrorMessage('Please enter your query to get response from OpenAI');
        return;
    }
}
exports.startConversation = startConversation;
//# sourceMappingURL=startConversation.js.map