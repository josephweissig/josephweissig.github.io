module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./assets/css");
    eleventyConfig.addWatchTarget("./assets/css");
    return {
        dir: {

        },
    };
};