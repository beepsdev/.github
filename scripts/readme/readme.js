const handlebars = require('handlebars');
const moment = require('moment');
const fs = require('fs');

const OUTPUT_FILE = process.env.output ?? '../../profile/README.MD'
const INPUT_FILE = process.env.output ?? './template.md'

function render(context){
    const template_file = fs.readFileSync(INPUT_FILE, {flag:'r'}).toString();
    const template = handlebars.compile(template_file);

    const output = template({
        ...context,
        time: new moment().format('LLLL')
    });

    console.log('Readme - Writing new file');
    fs.writeFileSync(OUTPUT_FILE, output);
}

async function loadStatus(){

    const result = []

    const emoji = {
        ok: "🟩",
        warn: "🟨",
        error: "🟥"
    }

    const sites = [
        { url: 'https://beeps.dev', name: 'Personal Website', link: 'https://beeps.dev'},
        { url: 'https://awoo.download', name: 'awoo.download', link: 'https://awoo.download'},
        { url: 'https://tomestone.app', name: 'tomestone.app', link: 'https://tomestone.app'},
    ]

    for (const site of sites) {
        try{
            let response = await fetch(site.url);

            if(response.status === 200){
                result.push(`${emoji.ok} [${site.name}](${site.link}) `);
                console.log(` ${site.name} => OK`)
            }else{
                result.push(`${emoji.warn} (${response.statusText}) [${site.name}](${site.link}) `);
                console.log(` ${site.name} => WARN`)
            }
        }catch(ex){
            result.push(`${emoji.error} [${site.name}](${site.link}) `);
            console.log(` ${site.name} => ERROR`);
            console.error(ex);
        }
    }

    return result;

}

async function go(){
    render({
        sites: await loadStatus()
    })
}

go().then(r => {
    console.log('Done :)')
});