import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

let localesUnloaded = {};

// list all files inside of a directory
fs.readdirSync(path.join(__dirname, '../locales/')).forEach((file) => {
  const content = fs.readFileSync(path.join(__dirname, '../locales/', file));
  const contentJson = JSON.parse(content);
  localesUnloaded[file.split('.')[0]] = contentJson;
});

export const locales = localesUnloaded;
