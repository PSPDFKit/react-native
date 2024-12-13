import simpleImportSort from "eslint-plugin-simple-import-sort";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["./android", "./ios", "./assets", "./node_modules/**/*.js"],
}, ...compat.extends("eslint:recommended", "plugin:react/recommended", "@react-native"), {
    plugins: {
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        ecmaVersion: 12,
        sourceType: "module",

        parserOptions: {
            parser: "@babel/eslint-parser",
            requireConfigFile: false,

            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        "react/no-string-refs": 0,
        "no-alert": 0,
        "simple-import-sort/imports": 2,
    },
}];