const Joi = require('joi');
const { performance } = require('perf_hooks');

function createHeavyJoiSchema() {
    const DEPTH = 100;
    const KEYS_PER_LEVEL = 100;

    let current = Joi.string().min(5);

    for (let i = 0; i < DEPTH; i++) {
        const props = {
            child: current
        };
        for (let j = 0; j < KEYS_PER_LEVEL; j++) {
            props[`level_${i}_key_${j}`] = Joi.number().optional();
        }
        current = Joi.object(props);
    }

    return current;
}

async function runBenchmark() {
    console.log('--- Joi Performance Test ---');
    console.log('Generating heavy Joi schema (100x100)...');

    const memStart = process.memoryUsage().heapUsed;
    const start = performance.now();
    const schema = createHeavyJoiSchema();
    const end = performance.now();
    const memEnd = process.memoryUsage().heapUsed;

    console.log(`\nResults:`);
    console.log(`- Schema Build Time: ${(end - start).toFixed(4)}ms`);
    console.log(`- Memory Consumed (Approx): ${((memEnd - memStart) / 1024 / 1024).toFixed(2)} MB`);

    console.log('\nGenerating data for validation...');
    function createData(depth) {
        if (depth === 0) return "leaf_value_is_at_least_5_chars";
        const data = {
            child: createData(depth - 1)
        };
        for (let j = 0; j < 100; j++) {
            data[`level_${depth - 1}_key_${j}`] = 123.45;
        }
        return data;
    }
    const sampleData = createData(100);

    console.log('Starting Validation (100 times)...');
    const vStart = performance.now();
    for (let i = 0; i < 100; i++) {
        const { error } = schema.validate(sampleData);
        if (error) throw error;
    }
    const vEnd = performance.now();

    const vDuration = vEnd - vStart;
    console.log(`- Validation Time (Total): ${vDuration.toFixed(4)}ms`);
    console.log(`- Avg Time per Validation: ${(vDuration / 100).toFixed(4)}ms`);
}

runBenchmark().catch(console.error);
