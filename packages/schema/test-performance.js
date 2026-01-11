const { s, compile } = require('./dist/index.js');
const { performance } = require('perf_hooks');

/**
 * Generates a deeply nested and repetitive schema.
 * Total nodes targeted: ~200
 */
function createHeavySchema() {
    const DEPTH = 100;
    const KEYS_PER_LEVEL = 100;

    let current = s.string().min(5); // Start at the leaf

    for (let i = 0; i < DEPTH; i++) {
        const props = {
            child: current
        };
        // Add 100 unique keys at this level
        for (let j = 0; j < KEYS_PER_LEVEL; j++) {
            props[`level_${i}_key_${j}`] = s.number().optional();
        }
        current = s.object(props);
    }

    return current;
}

async function runBenchmark() {
    console.log('--- @apexo/schema Performance Test ---');

    console.log('Generating heavy schema (~200+ potential nodes)...');
    const memStart = process.memoryUsage().heapUsed;
    const schema = createHeavySchema().build();

    console.log('\nStarting Compilation...');
    const cStart = performance.now();

    const registry = compile(schema);

    const cEnd = performance.now();
    const memEnd = process.memoryUsage().heapUsed;
    console.log(`- Compilation Time: ${(cEnd - cStart).toFixed(4)}ms`);
    console.log(`- Memory Consumed (Approx): ${((memEnd - memStart) / 1024 / 1024).toFixed(2)} MB`);

    const { createValidator } = require('./dist/index.js');
    const validator = createValidator(registry);

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

    console.log('Starting Validation (100 times for deep structure)...');
    const vStart = performance.now();
    for (let i = 0; i < 100; i++) {
        const result = validator.validate(sampleData);
        if (!result.success) throw new Error('Validation failed');
    }
    const vEnd = performance.now();

    const vDuration = vEnd - vStart;
    console.log(`- Validation Time (Total): ${vDuration.toFixed(4)}ms`);
    console.log(`- Avg Time per Validation: ${(vDuration / 100).toFixed(4)}ms`);

    const nodeCount = Object.keys(registry.nodes).length;

    console.log('\nResults:');
    console.log(`- Compilation Time: ${(cEnd - cStart).toFixed(4)}ms`);
    console.log(`- Total IR Nodes: ${nodeCount}`);
    console.log(`- Registry Root ID: ${registry.root}`);

    console.log('\nStructure Stats:');
    const types = {};
    Object.values(registry.nodes).forEach(n => {
        types[n.type] = (types[n.type] || 0) + 1;
    });
    console.table(types);

    console.log('\n- Bitmask efficiency check:');
    const bigObjects = Object.values(registry.nodes).filter(n => n.type === 'object' && Object.keys(n.shape).length > 0);
    console.log(`- Processed ${bigObjects.length} object nodes with bitmasks.`);

    if (vDuration < 100) {
        console.log('\n[PERF] ✅ High performance: Runtime validation finished in record time.');
    }
}

runBenchmark().catch(console.error);
