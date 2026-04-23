import path from 'node:path';

import { auditTokens } from '@themeshift/core';

export async function runAudit(options: {
  cssVarPrefix?: string;
  cwd?: string;
  outputFile?: string;
  target?: string;
}) {
  const cwd = options.cwd ?? process.cwd();

  const result = await auditTokens({
    cssVarPrefix: options.cssVarPrefix,
    outputFile: options.outputFile,
    root: cwd,
    target: options.target,
  });

  console.log(
    `Wrote ${path.relative(cwd, result.outputFile)} for target(s): ${result.scannedTargets.join(', ')}`
  );
}
