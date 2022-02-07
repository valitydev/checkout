import * as del from 'del';
import * as path from 'path';
import * as config from '../swagger-codegen-config.json';
import { execWithLog } from './utils/exec-with-log';

// tslint:disable:no-console
async function codegen({
    schemes,
    outputDir,
    cliPath
}: {
    schemes: { name: string; path: string }[];
    outputDir: string;
    cliPath: string;
}) {
    const outputDirPath = path.join(process.cwd(), outputDir);

    console.log('Swagger codegen');

    await del(outputDirPath);
    console.log(`${outputDir} deleted`);

    console.log('Generate...');

    await Promise.all(
        schemes.map(async ({ name, path: schemePath }) =>
            execWithLog(
                `java -jar ${cliPath} generate -l typescript-fetch -i ${schemePath} -o ${path.join(
                    outputDirPath,
                    name
                )}`
            )
        )
    );
    console.log('Successfully generated 😀');
}

(async () => {
    await codegen(config);
})();
