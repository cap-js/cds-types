import cds from "@sap/cds";

const uuid: string = cds.utils.uuid();
const decodeURI: string = cds.utils.decodeURI(
  "https://developer.mozilla.org/docs/JavaScript%3A%20a_scripting_language"
);
const decodeComponent: string = cds.utils.decodeURIComponent(
  "JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"
);
const local: string = cds.utils.local("myFile.json");
const result: boolean = cds.utils.exists("server.js");
const isDir: string = cds.utils.isdir("app");
const isFile: string = cds.utils.isfile("package.json");

const { read, write } = cds.utils;

const rd: Buffer | {} = await read("package.json");

await write({ foo: "bar" }).to("some", "file.json");
await write({ foo: "bar" }).to("some", "file.json", "pp");
await write("some/file.json", { foo: "bar" });

const { copy } = cds.utils;
await copy("db/data").to("dist", "db", "data");
await copy("db/data").to("dist/db/data");
await copy("db/data", "dist/db/data");

const { mkdirp } = cds.utils;
const path: string = await mkdirp("dist", "db", "data");
const path1: string = await mkdirp("dist/db/data");

const { rmdir } = cds.utils;
await rmdir("dist", "db", "data");
await rmdir("dist/db/data");

const { rimraf } = cds.utils;
await rimraf("dist", "db", "data");
await rimraf("dist/db/data");

const { rm } = cds.utils;
await rm("dist", "db", "data");
await rm("dist/db/data");

const { fs } = cds.utils;
fs.writeFileSync("test", "content", { encoding: "utf-8" });

const { path: nodePath } = cds.utils;
nodePath.resolve("dist", "db");
nodePath.join(__dirname, "dist", "db");

const { inspect } = cds.utils;
inspect({}, true, 10, true);
