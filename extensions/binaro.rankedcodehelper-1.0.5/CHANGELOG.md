# Change Log

All notable changes to the "OpenAI Wizard" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.


### version 1.0.6 (not released yet)

Added button that will automatically populate git commit message based on existing git changes.
You can now set the "after prompt action" that will for example lint your file after the prompt is returned.

### version 1.0.5

Proper changelog.

### version 1.0.4

Security enhancements - proper apiKey storing.
You might need to run "OpenAI Wizard Set api key" command again to store your apiKey on new location.

### version 1.0.3

Changed the "OpenAI Wizard" to "OpenAI Wizard File" command. Changed the "Open AI Wizard Selection" command to "Open AI Wizard" command. As this command is useful not only for handling data with selection as context, but can also just return the response of a prompt. User can use prompts like "Give me a function, that will do XYZ" and it will be given at current caret location.

OpenAI will now receive the required language based on current file extension.

### version 1.0.2

Added the ability to generate completely new file. For example for unit tests generated for current file.

### version 1.0.1

Extended the number of tokens sent to api for processing larger files. Unfortunately, we still have limitations based on OpenAIs API.

Added working selection command.

### version 1.0.0

Basic functionality. Needs more testing.
