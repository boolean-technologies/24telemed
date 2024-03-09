// #!/usr/bin/env zx

import { $ } from 'zx';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const cwd = process.cwd();

const OPEN_API_URL = 'http://localhost:8000/?format=openapi';

const OPEN_API_FILE_PATH = path.resolve(
  cwd,
  './packages/api-generated/src/openapi.json'
);
const GENERATED_CODE_FOLDER = path.resolve(
  cwd,
  './packages/api-generated/src/code'
);
const PACKAGE_FOLDER = path.resolve(
  cwd,
  './packages/api-generated/src/api'
);

const resp = await fetch(OPEN_API_URL);
const openapiJson = await resp.json();

await fs.writeFile(OPEN_API_FILE_PATH, JSON.stringify(openapiJson));

await $`yarn openapi --input ${OPEN_API_FILE_PATH} --output ${GENERATED_CODE_FOLDER} --client fetch`;
await $`yarn prettier ${GENERATED_CODE_FOLDER} --write`;

await Promise.all(
  ['core', 'models', 'services'].map(async (directory) => {
    await $`rm -rf "${PACKAGE_FOLDER}/${directory}"`;
  })
);

await $`mv ${GENERATED_CODE_FOLDER}/* ${PACKAGE_FOLDER}/`;
await $`rm -rf ${GENERATED_CODE_FOLDER}`;
await $`rm -rf ${OPEN_API_FILE_PATH}`;
