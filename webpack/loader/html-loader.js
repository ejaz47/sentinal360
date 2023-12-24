import {getOptions, getCurrentRequest} from 'loader-utils';
import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';

const dataPath = path.resolve('./src/js/data.json'); // Adjust the path as needed

const renderNunjucksTemplate = function (templateContent, data, templatePath) {
    try {
        const env = nunjucks.configure();
        const renderedContent = nunjucks.renderString(templateContent, data);
        return renderedContent;
    }catch (ex) {
        console.log(`Nunjuck Error: "${templatePath}" `, ex);
        return '';
    }
};

const insertIncludes = function (self, content, regex) {
    const includes = content.match(regex);
    let newContent = content;
    if (includes) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        includes.forEach((includeFilename) => {
            if(includeFilename.substr(0, 1) == '_'){
                const includePath = path.resolve(`./src/html/${includeFilename}`);
                let includeContent = fs.readFileSync(includePath, 'utf8');

                // Add Nunjucks rendering here
                includeContent = renderNunjucksTemplate(includeContent, data, includePath);

                includeContent = insertIncludes(self, includeContent, regex);
                newContent = newContent.replace(`<include>${includeFilename}</include>`, includeContent);
                self.addDependency(includePath);
            }
        });
    }
    return newContent;
};

const loader = function (source) {
    const options = getOptions(this);
    const regex = new RegExp(`(${options.html.join('|')})`, 'ig');
    this.addDependency(dataPath);
    const newSource = insertIncludes(this, source, regex);

    return `export default ${JSON.stringify(newSource)}`;
};

export default loader;
