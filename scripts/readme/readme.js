import handlebars from "handlebars";
import moment from "moment";
import { readdir, readFile, writeFile } from 'fs/promises';
import {Octokit} from "octokit";
import * as path from "path";
import { fileURLToPath } from 'url';

const OUTPUT_FILE = process.env.output ?? '../../profile/README.MD'
const INPUT_FILE = process.env.output ?? './template.md'
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const working_dir = fileURLToPath(import.meta.url);
const sections_dir = path.join(working_dir, '../', 'sections');

async function getModules(){
    console.log('Loading module list...')
    return await readdir(sections_dir);
}

async function buildData(module_list){

    console.log(`Starting build for ${module_list.length} modules`);

    const data = {};
    for(let module_path of module_list){
        let module = await import(path.join(sections_dir, module_path));
        let Definition = Object.values(module)[0];

        let instance = new Definition();
        console.log(`getting replacement context for module '${Definition.name}'`);
        data[Definition.name] = await instance.getReplacementContext();

    }

    return data;

}


async function render(context){

    console.log(`Starting render...`);
    console.log(context);

    const template_file = await readFile(INPUT_FILE, {flag: 'r'});
    const template_content = template_file.toString();
    const template = handlebars.compile(template_content, {noEscape: true});

    console.log(`Writing to file: '${INPUT_FILE}'`);

    const output = template({
        ...context,
        time: new moment().format('LLLL')
    });
    await writeFile(OUTPUT_FILE, output);
    console.log(`Done.`);

}

getModules().then( modules => {
    buildData(modules).then( async data => {
        await render(data);
    });
})