import fetchText from '../fetch-text.js'


export default async function fixtures({ maxFixtures, proxyAgent }) {
  const exts = new Map()
  const idMatcher = /\/webstore\/detail\/(?:[^/]+\/)?([\d\w]+)/g

  const html = await fetchText(
    'https://chrome.google.com/webstore/category/extensions',
    { agent: proxyAgent }
  )

  for (
    let match;
    exts.size < maxFixtures && (match = idMatcher.exec(html)) !== null;

  ) {
    exts.set(match[1], {
      id: match[1],
      url: 'https://chrome.google.com/webstore/detail/' + match[1],
    })
  }

  return [...exts.values()]
}
