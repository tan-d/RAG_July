"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios"); // Calling API OpenAI
function activate(context) {
    const addBreakpointsCommand = vscode.commands.registerCommand("openaiDebugger.addBreakpoints", () => __awaiter(this, void 0, void 0, function* () {
        let apiKey = context.globalState.get("openaiApiKey");
        if (!apiKey) {
            apiKey = yield vscode.window.showInputBox({
                prompt: "Please enter your OpenAI API key",
                password: true,
            });
            if (!apiKey) {
                vscode.window.showErrorMessage("API key is required.");
                return;
            }
            try {
                const isValidApiKey = yield verifyApiKey(apiKey);
                if (!isValidApiKey.valid) {
                    const errorMessage = isValidApiKey.error || "Unknown error occurred.";
                    let formattedMessage;
                    if (typeof errorMessage === "object" &&
                        errorMessage !== null &&
                        "message" in errorMessage) {
                        formattedMessage = errorMessage.message;
                    }
                    else if (typeof errorMessage === "object") {
                        formattedMessage = JSON.stringify(errorMessage, null, 2);
                    }
                    else {
                        formattedMessage = errorMessage;
                    }
                    vscode.window.showErrorMessage(formattedMessage);
                    return;
                }
            }
            catch (error) {
                vscode.window.showErrorMessage("Error verifying API key.");
                return;
            }
            yield context.globalState.update("openaiApiKey", apiKey);
            vscode.window.showInformationMessage("API key has been saved.");
        }
        const prompt = yield vscode.window.showInputBox({
            prompt: "Tell me what do you need to add as breakpoint",
        });
        if (!prompt) {
            vscode.window.showErrorMessage("Prompt not available.");
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No file opened.");
            return;
        }
        const document = editor.document;
        const linesWithNumbers = [];
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            linesWithNumbers.push(`${i + 1}: ${line.text}`);
        }
        const code = linesWithNumbers.join("\n");
        vscode.window.showInformationMessage("Running analysis code...");
        try {
            const breakpoints = yield analyzeCodeWithOpenAI(prompt, code, apiKey);
            addBreakpointsToDebugger(editor, breakpoints);
        }
        catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error in analysis: ${error.message}`);
            }
            else {
                vscode.window.showErrorMessage("Unknown error in analysis.");
            }
        }
    }));
    context.subscriptions.push(addBreakpointsCommand);
}
exports.activate = activate;
function verifyApiKey(apiKey) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-4o-mini",
            }, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });
            return { valid: true };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const apiError = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error;
                return {
                    valid: false,
                    error: apiError || "Unknown API error occurred.",
                };
            }
            else if (error instanceof Error) {
                return {
                    valid: false,
                    error: error.message,
                };
            }
            else {
                // Caso di errore sconosciuto
                return {
                    valid: false,
                    error: "An unexpected error occurred.",
                };
            }
        }
    });
}
function analyzeCodeWithOpenAI(prompt, code, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant debugger AI." +
                        "Just return me the line numbers of the code I send you as requested by my prompt preceded by the word line." +
                        "Always exclude lines where breakpoint cannot be set like whitespace and parentheses",
                },
                { role: "user", content: `${prompt}\n\nCode:\n${code}` },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });
        const analysis = response.data.choices[0].message.content;
        return parseBreakpointsFromAnalysis(analysis);
    });
}
function parseBreakpointsFromAnalysis(analysis) {
    const lines = [];
    const regex = /line (\d+)/gi; // Search "line X" in the result
    let match;
    while ((match = regex.exec(analysis)) !== null) {
        lines.push(parseInt(match[1], 10));
    }
    return lines;
}
function addBreakpointsToDebugger(editor, lines) {
    const debugConfig = vscode.debug;
    const breakpoints = lines.map((line) => {
        const position = new vscode.Position(line - 1, 0); // Lines in VS Code are 0-based
        const location = new vscode.Location(editor.document.uri, position);
        return new vscode.SourceBreakpoint(location);
    });
    debugConfig.addBreakpoints(breakpoints);
    vscode.window.showInformationMessage(`Added ${lines.length} breakpoint.`);
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map