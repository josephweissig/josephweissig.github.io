import { dateFilter } from './src/filters/date-filter.js';
import { w3DateFilter } from './src/filters/w3-date-filter.js';
import { RenderPlugin } from '@11ty/eleventy';
import rssPlugin from '@11ty/eleventy-plugin-rss';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import path from 'node:path';
import * as sass from 'sass';
import htmlmin from 'html-minifier-next';
import postcss from 'postcss';
import cssnano from 'cssnano';

const isProduction = process.env.NODE_ENV === 'production';

export default function (eleventyConfig) {
    eleventyConfig.addFilter('dateFilter', dateFilter);
    eleventyConfig.addFilter('w3DateFilter', w3DateFilter);
    eleventyConfig.setInputDirectory('src');
    eleventyConfig.setOutputDirectory('dist');
    eleventyConfig.addPassthroughCopy('src/fonts');
    eleventyConfig.addPassthroughCopy('src/images/meta');
    eleventyConfig.addPlugin(rssPlugin);
    eleventyConfig.addPlugin(RenderPlugin);
    eleventyConfig.addPlugin(eleventyImageTransformPlugin);
    eleventyConfig.addExtension('scss', {
        outputFileExtension: 'css',
        useLayouts: false,
        compile: async function (inputContent, inputPath) {
            let parsed = path.parse(inputPath);
            // Don't compile file names that start with an underscore
            if (parsed.name.startsWith('_')) {
                return;
            }

            const compiled = sass.compileString(inputContent, {
                loadPaths: [parsed.dir || '.', this.config.dir.includes],
                silenceDeprecations: ['import', 'global-builtin', 'slash-div']
            });

            let result = compiled.css;
            if (isProduction) {
                const minified = await postcss([cssnano]).process(compiled.css, {
                    from: undefined,
                });
                result = minified.content;
            }

            // Map dependencies for incremental builds
            this.addDependencies(inputPath, compiled.loadedUrls);

            return async (data) => {
                return compiled.css;
            };
        },
    });

    // Returns projects, sorted by display order
    eleventyConfig.addCollection('projects', (collection) => {
        return sortByDisplayOrder(collection.getFilteredByGlob('./src/projects/*.md'));
    });

    // Returns a collection of blog posts in reverse date order
    eleventyConfig.addCollection('blog', (collection) => {
        return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
    });

    if (isProduction) {
        eleventyConfig.addTransform('htmlmin', function (content) {
            if ((this.page.outputPath || '').endsWith('.html')) {
                return htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                });
            }
            return content;
        });
    }
}

export const config = {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
};

/**
 * Takes a collection and returns it back in display order
 * 
 * @param {Array} collection The 11ty collection
 * @returns {Array} the sorted collection
 */
function sortByDisplayOrder(collection) {
    return collection.sort((a, b) =>
        Number(a.data.displayOrder) > Number(b.data.displayOrder) ? 1 : -1,
    );
}