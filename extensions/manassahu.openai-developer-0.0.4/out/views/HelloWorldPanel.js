"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWorldPanel = void 0;
const vscode_1 = require("vscode");
const getUri_1 = require("../utilities/getUri");
const getNonce_1 = require("../utilities/getNonce");
/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
class HelloWorldPanel {
    /**
     * The HelloWorldPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }
    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    static render(extensionUri) {
        if (HelloWorldPanel.currentPanel) {
            // If the webview panel already exists reveal it
            HelloWorldPanel.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
        }
        else {
            // If a webview panel does not already exist create and show a new one
            const panel = vscode_1.window.createWebviewPanel(
            // Panel view type
            "showHelloWorld", 
            // Panel title
            "Hello World", 
            // The editor column the panel should be displayed in
            vscode_1.ViewColumn.One, 
            // Extra panel configurations
            {
                // Enable JavaScript in the webview
                enableScripts: true,
                // Restrict the webview to only load resources from the `out` directory
                localResourceRoots: [vscode_1.Uri.joinPath(extensionUri, "out")],
            });
            HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
        }
    }
    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    dispose() {
        HelloWorldPanel.currentPanel = undefined;
        // Dispose of the current webview panel
        this._panel.dispose();
        // Dispose of all disposables (i.e. commands) associated with the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where *references* to CSS and JavaScript files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    _getWebviewContent(webview, extensionUri) {
        const webviewUri = (0, getUri_1.getUri)(webview, extensionUri, ["out", "webview.js"]);
        const nonce = (0, getNonce_1.getNonce)();
        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">
          <title>Hello World!</title>
        </head>
        <body>
          <h1>Hello World!</h1>
					<vscode-button id="howdy">Howdy!</vscode-button>
					<script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
    }
    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     */
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage((message) => {
            const command = message.command;
            const text = message.text;
            switch (command) {
                case "hello":
                    // Code that should run in response to the hello message command
                    vscode_1.window.showInformationMessage(text);
                    return;
                // Add more switch case statements here as more webview message commands
                // are created within the webview context (i.e. inside src/webview/main.ts)
            }
        }, undefined, this._disposables);
    }
}
exports.HelloWorldPanel = HelloWorldPanel;
//# sourceMappingURL=HelloWorldPanel.js.map