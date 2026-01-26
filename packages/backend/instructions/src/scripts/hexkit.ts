import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createCommand } from '../commands/create.js';

await yargs(hideBin(process.argv))
  .command(createCommand)
  .demandCommand(1)
  .help()
  .parse();
