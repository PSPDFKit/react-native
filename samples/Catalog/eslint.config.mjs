import simpleImportSort from "eslint-plugin-simple-import-sort";
import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

export default [
    {
        ignores: [
            "./android/**",
            "./ios/**",
            "./assets/**",
            "./node_modules/**",
            "**/*.js",
        ],
    },
    // Only apply recommended config to JSX files, not TypeScript
    {
        ...js.configs.recommended,
        files: ["**/*.jsx"],
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "simple-import-sort": simpleImportSort,
        },

        languageOptions: {
            parser: babelParser,
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },

            parserOptions: {
                requireConfigFile: false,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        rules: {
            "react/no-string-refs": "off",
            "no-alert": "off",
            "react-native/no-inline-styles": "off",
            "simple-import-sort/imports": "off",
            // Disable rules that don't work well with TypeScript when using Babel parser
            "getter-return": "off",
            "no-dupe-class-members": "off",
            "no-dupe-args": "off",
            "no-unused-vars": "off",
            "no-undef": "off", // TypeScript handles this
            "no-redeclare": "off", // TypeScript handles this
        },
    },
    {
        files: ["**/*.jsx"],
        plugins: {
            "simple-import-sort": simpleImportSort,
        },

        languageOptions: {
            parser: babelParser,
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },

            parserOptions: {
                requireConfigFile: false,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        rules: {
            "react/no-string-refs": "off",
            "no-alert": "off",
            "react-native/no-inline-styles": "off",
            "simple-import-sort/imports": "off",
        },
    },
];