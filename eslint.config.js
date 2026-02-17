const nextConfig = require("eslint-config-next");

module.exports = [
    ...nextConfig,
    {
        rules: {
            // Custom overrides if needed
            "@next/next/no-html-link-for-pages": "off", // Sometimes needed for flat config
        },
    },
];
