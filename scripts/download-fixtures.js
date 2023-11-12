import fs from 'fs-extra';
import path from 'path';
import fetchText from '../lib/fetch-text.js';
import ProgressBars from './progress-bars.js';
import HttpsProxyAgent from 'https-proxy-agent';
import yargs from 'yargs';
import { fileURLToPath } from 'url';  // Import fileURLToPath

const argv = yargs(process.argv.slice(2)).argv;
const maxFixtures = typeof argv.max === 'number' ? argv.max : 5;
const proxyAgent =
  typeof argv.proxy === 'string' ? new HttpsProxyAgent(argv.proxy) : undefined;

async function main() {
  const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.fixtures');
  if (argv.force) {
    await fs.emptyDir(fixturesDir);
  }

  const servicesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib');
  const serviceNames = (
    await Promise.all(
      (await fs.readdir(servicesDir)).map(async (name) => {
        try {
          const stats = await fs.stat(path.join(servicesDir, name));
          return stats.isDirectory() ? name : null;
        } catch (e) {
          return null;
        }
      })
    )
  ).filter(Boolean);

  const failedFixtures = [];
  const bars = new ProgressBars();

  await Promise.all(
    serviceNames.map(async (serviceName) => {
      const fixtureDir = path.join(fixturesDir, serviceName);

      if (!argv.force) {
        try {
          const fixtures = await fs.readdir(fixtureDir);
          if (fixtures && fixtures.length > 0) {
            return;
          }
        } catch (error) {
          // ignore if empty
        }
      }

      let downloadFixtures;
      try {
        downloadFixtures = (await import(path.join(servicesDir, serviceName, 'fixtures.js'))).default;
      } catch (error) {
        console.error(error);
        return;
      }

      let exts;
      try {
        exts = await downloadFixtures({ maxFixtures, proxyAgent });
      } catch (error) {
        console.error(error);
        return;
      }

      bars.addTotal(exts.length);

      for (const ext of exts) {
        bars.create(serviceName, ext.id);

        try {
          const html = await fetchText(ext.url, { agent: proxyAgent });
          await fs.outputFile(path.join(fixtureDir, ext.id), html);
          bars.update(serviceName, ext.id, 'success');
        } catch (error) {
          bars.update(serviceName, ext.id, 'failed');
          failedFixtures.push(`${serviceName}/${ext.id}`);
        }
      }
    })
  );

  bars.stop();

  if (failedFixtures.length > 0) {
    console.error('\nFailed fixtures:\n\n' + failedFixtures.join('\n') + '\n');
  }
}

main();
