import discord from './discord';
import format from './format';
import replace from './replace';
import rss from './rss';

type PipelineStep<Config, Item, Return> = (config: Config, item: Item, env: Env)
    => Promise<Return>;

const steps: Record<string, PipelineStep<any, any, any>> = {
    discord,
    format,
    replace,
    rss
};

export default steps;
