export default function(eleventyConfig) {
    return {
        dir: {
            input: "src",
            data: "_data",
            includes: "_includes",
            layouts: "_layouts",
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};