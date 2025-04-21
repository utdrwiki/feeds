import Parser from 'rss-parser';

interface Config {
    url: string;
    // Inferred from pipeline config
    pipeline: string;
}

type Item = string;
type Return = object;
  
export default async function(
    config: Config,
    _item: Item,
    env: Env
): Promise<Return[]> {
    const lastDateKey = `rss:${config.pipeline}`;
    const lastUpdate = await env.FEEDS.get(lastDateKey);
    const lastDate = lastUpdate ? new Date(lastUpdate) : new Date();
    if (!lastUpdate) {
        await env.FEEDS.put(lastDateKey, lastDate.toISOString());
    }
    const response = await fetch(config.url, {
        headers: {
            'If-Modified-Since': lastDate.toUTCString(),
            'User-Agent': 'utdrwiki-feeds/1.0 (Operated by u/KockaAdmiralac)'
        }
    });
    if (response.status === 304) {
        return [];
    }
    if (!response.ok) {
        console.error(`Failed to fetch RSS feed: ${response.statusText}`);
        return [];
    }
    const parser = new Parser();
    const feed = await parser.parseString(await response.text());
    const results = feed.items
        .filter(item => item.pubDate && new Date(item.pubDate) > lastDate)
        .sort((a, b) => new Date(a.pubDate || 0).getTime() - new Date(b.pubDate || 0).getTime());
    if (results.length === 0) {
        return [];
    }
    const newLastDate = results[results.length - 1];
    await env.FEEDS.put(lastDateKey, newLastDate.pubDate || '0');
    return results;
}
