import { fetchText } from '../fetch-text.js'

export default async function fixtures({ maxFixtures, proxyAgent }) {
  const exts = new Map()
  const idMatcher = /\/firefox\/addon\/([^/?]+)/g

  const html = await fetchText(
    'https://addons.mozilla.org/firefox/extensions/',
    { agent: proxyAgent }
  )

  for (
    let match;
    exts.size < maxFixtures && (match = idMatcher.exec(html)) !== null;

  ) {
    exts.set(match[1], {
      id: match[1],
      url: 'https://addons.mozilla.org/firefox/addon/' + match[1],
    })
  }

  return [...exts.values()]
}
