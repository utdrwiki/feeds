interface Config {
    regex: string;
    replacement: string;
    flags?: string;
}

type Item = string;
type Return = string;

export default async function(config: Config, item: Item): Promise<Return> {
    const regex = new RegExp(config.regex, config.flags);
    const result = item.replace(regex, config.replacement);
    return result;
}

