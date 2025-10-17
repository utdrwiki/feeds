interface Config {
	id: string;
	token: string;
}

type Item = string;
type Return = string;

export default async function(config: Config, item: Item): Promise<Return> {
	const response = await fetch(
		`https://discord.com/api/webhooks/${config.id}/${config.token}?wait=true`,
		{
			body: JSON.stringify({
				content: item
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		}
	);
	if (response.ok) {
		console.log('Discord success', {
			body: await response.json(),
			status: response.status,
		});
	} else {
		console.error('Discord failure', {
			body: await response.text(),
			status: response.status,
			statusText: response.statusText,
		});
	}
	return item;
}
