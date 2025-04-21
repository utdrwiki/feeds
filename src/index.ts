import steps from './steps';

interface PipelineStep {
	type: string;
	pipeline?: string;
	multiple?: boolean;
	next?: PipelineStep;
}

interface PipelineConfig {
	name: string;
	pipeline: PipelineStep[];
}

async function scheduled(
	_event: ScheduledController,
	env: Env,
	_ctx: ExecutionContext
): Promise<void> {
	const config: PipelineConfig[] = JSON.parse(env.PIPELINE);
	const queue: [PipelineStep, any][] = [];
	for (const {name, pipeline} of config) {
		if (pipeline.length === 0) {
			continue;
		}
		for (const [index, step] of pipeline.entries()) {
			step.next = pipeline[index + 1];
			step.pipeline = name;
		}
		queue.push([pipeline[0], null]);
	}
	while (true) {
		const queueItem = queue.shift();
		if (!queueItem) {
			break;
		}
		const [step, item] = queueItem;
		const config = {...step, next: undefined};
		console.log('Processing queue item', {config, item})
		const result = await steps[step.type](config, item, env);
		if (result && step.next) {
			console.log('Received result', {result});
			if (step.multiple && Array.isArray(result)) {
				for (const resultItem of result) {
					queue.push([step.next, resultItem]);
				}
			} else {
				queue.push([step.next, result]);
			}
		} else {
			console.log(`Stopping pipeline ${step.pipeline}`);
		}
	}
}

export default {scheduled};
