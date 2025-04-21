interface Config {
    format: string;
}

type Item = string;
type Return = string;

export default async function(config: Config, item: Item): Promise<Return> {
    return config.format.replace(/\{([^}]+)\}/, (_, key) => item[key] || '');
}
