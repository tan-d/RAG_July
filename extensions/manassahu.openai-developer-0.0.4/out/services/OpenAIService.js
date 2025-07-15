"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
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
const axios_1 = require("axios");
class OpenAIService {
    constructor() {
        this.url = 'https://api.openai.com';
    }
    buildHeader(key) {
        if (key) {
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
            };
        }
        return null;
    }
    async executeGPTTurbo(key, maxTokens, temperature, q) {
        const { headers } = this.buildHeader(key);
        var body = JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{
                    "role": "user",
                    "content": q
                }],
            "temperature": temperature,
            "max_tokens": maxTokens,
        });
        try {
            const response = await axios_1.default.post(`${this.url}/v1/chat/completions`, body, { headers });
            return { code: "OK", status: response.status, data: response.data };
        }
        catch (error) {
            // https://platform.openai.com/docs/guides/error-codes/api-errors
            if (error.response.status === 401) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else if (error.response.status === 429) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else if (error.response.status === 500) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else {
                return { code: "Error", status: error.response.status, data: error.message };
            }
        }
    }
    async executeCodex(key, maxTokens, temperature, q) {
        const { headers } = this.buildHeader(key);
        var body = JSON.stringify({
            "model": "code-davinci-002",
            "prompt": q,
            "temperature": temperature,
            "max_tokens": maxTokens,
            "frequency_penalty": 0.38
        });
        try {
            const response = await axios_1.default.post(`${this.url}/v1/completions`, body, { headers });
            return { code: "OK", status: response.status, data: response.data };
        }
        catch (error) {
            if (error.response.status === 401) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else if (error.response.status === 429) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else if (error.response.status === 500) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else {
                return { code: "Error", status: error.response.status, data: error.message };
            }
        }
    }
    async executeImage(key, total, size, q) {
        const { headers } = this.buildHeader(key);
        var body = JSON.stringify({
            "prompt": q,
            "n": total,
            "size": size,
        });
        try {
            const response = await axios_1.default.post(`${this.url}/v1/images/generations`, body, { headers });
            return { code: "OK", status: response.status, data: response.data.data };
        }
        catch (error) {
            if (error.response.status === 401) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else if (error.response.status === 429) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else if (error.response.status === 500) {
                return { code: "Error", status: error.response.status, data: error.response.data.error.message };
            }
            else {
                return { code: "Error", status: error.response.status, data: error.message };
            }
        }
    }
}
exports.OpenAIService = OpenAIService;
//# sourceMappingURL=OpenAIService.js.map