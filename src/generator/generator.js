import {model} from "../firebase/firebase.js";
import {systemprompt} from "../generator/prompts.js";

function removeJsonAnnotation(text) {
    if (!text) return text;
    const t = String(text).trim();

    // Remove ```json ... ``` if present
    const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const m = t.match(fenceRegex);
    if (m && m[1]) return m[1].trim();

    // Fallback: extract substring between first '{' and last '}' (common JSON wrapper)
    const firstBrace = t.indexOf('{');
    const lastBrace = t.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return t.slice(firstBrace, lastBrace + 1).trim();
    }

    return t;
}

function parseResponse(result) {
    try {
        const response = removeJsonAnnotation(result.response.text());
        const responseJson = JSON.parse(response);

        if (responseJson["valid"] === false) {
            alert(responseJson["error"]);
            console.log((responseJson["error"]));
            return null;
        }

        if (responseJson["valid"] === true) {
            console.log(responseJson)
            return responseJson;
        }

    } catch (error) {
        alert("Error reading response text: "+  error);
        console.error("Error parsing response text:", error);
        return null;
    }
}

async function fileToGenerativePart(file) {
    if (!file) throw new Error("fileToGenerativePart: no File provided");

    const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (!reader.result) return reject(new Error("FileReader returned empty result"));
            const resultStr = String(reader.result);
            const commaIndex = resultStr.indexOf(",");
            const payload = commaIndex >= 0 ? resultStr.slice(commaIndex + 1) : resultStr;
            resolve(payload);
        };

        reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));

        reader.readAsDataURL(file);
    });

    return {inlineData: {data: base64, mimeType: file.type}};
}

async function generate(pdfFile) {
    if (!pdfFile) {
        console.error("No PDF file provided or selected.");
        return;
    }

    const pdfPart = await fileToGenerativePart(pdfFile);

    console.log("Generating content from PDF ...");
    const result = await model.generateContent([systemprompt, pdfPart]);

    console.log("Generation complete.");

    return parseResponse(result);
}

export {generate};