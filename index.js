// Node.js
import fs from "fs/promises";
import path from "path";

// Third Packages
import { glob } from "glob";
import { build } from "esbuild";

const files = glob.sync("**/*.spec.js");
// console.log(files);

for (const file of files) {
  const fileContent = await fs.readFile(file, "utf-8");
  // console.log(fileContent);
  await runModule(fileContent + "; import { run } from '../core'; run();");
}

async function runModule(fileContent) {
  const result = await build({
    stdin: {
      contents: fileContent,
      resolveDir: path.join(process.cwd(), "tests"),
    },
    write: false,
    bundle: true,
    target: "esnext",
  });
  // console.log(result);

  const builtCode = result.outputFiles[0].text;
  // console.log(builtCode);

  new Function(builtCode)();
}
