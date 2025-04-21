interface Config {
    id: string;
    token: string;
}

type Item = string;
type Return = string;

export default async function(config: Config, item: Item): Promise<Return> {
    await fetch(`https://discord.com/api/webhooks/${config.id}/${config.token}?wait=true`, {
        body: JSON.stringify({
            content: item
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });
    return item;
}
