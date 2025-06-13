#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, renameSync, rmSync } from 'fs';
import { resolve } from 'path';

const { version } = JSON.parse(readFileSync('./package.json').toString());

async function run(distDirectory: string, outputDirectory: string): Promise<void> {
	// need the replacer here to get rid of newlines at the end of the command output
	const packFile = execSync(`npm pack ${distDirectory} --pack-destination=${outputDirectory}`)
		.toString()
		.replace(/\s/g, '');
	console.log(`pack file = ${packFile}`);

	const packFilePath = resolve(outputDirectory, packFile);
	const renameTarget = packFilePath.replace(`-${version}`, '');

	if (existsSync(renameTarget)) {
		rmSync(renameTarget);
	}

	console.log(`rename ${packFilePath} -> ${renameTarget}`);
	renameSync(packFilePath, renameTarget);
}

run('./dist', './packed').catch(console.error);
