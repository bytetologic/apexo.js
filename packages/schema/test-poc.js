const { s, compile } = require('./dist/index.js');
const util = require('util');

function logIR(registry) {
    console.log('Registry Root:', registry.root);
    console.log('Nodes:');
    for (const [id, node] of Object.entries(registry.nodes)) {
        console.log(`  [${id}]`, util.inspect(node, { depth: null, colors: true }));
    }
}

async function main() {
    console.log('--- @apexo/schema IR Compiler Test ---');

    console.log('\n1. Test Embedding & Flattening');
    const BaseConfig = s.object({
        id: s.number(),
        active: s.boolean()
    });

    const UserSchema = s.object({
        name: s.string(),
    }).embed(BaseConfig).build();

    // Outcome: UserSchema should have id, active, name.
    const reg1 = compile(UserSchema);
    logIR(reg1);

    console.log('\n2. Test Recursion (SelfRef)');
    let Category;
    Category = s.object({
        name: s.string(),
        subcategories: s.array(s.selfRef(() => Category)).optional()
    });

    const reg2 = compile(Category.build());
    logIR(reg2);

    console.log('\n4. Test Nested + Shared Schemas');
    const SharedString = s.string().min(5);
    const Metadata = s.object({
        creator: SharedString,
        modifier: SharedString
    });

    const Document = s.object({
        title: s.string(),
        meta: Metadata,
        audit: s.array(Metadata) // Shared object in array
    }).build();

    const reg4 = compile(Document);
    logIR(reg4);
    // Verification: 
    // - Metadata should have one ID.
    // - SharedString should have one ID.
    // - audit.item should link to Metadata's ID.

    console.log('\n5. Test Deeply Nested Shared Logic');
    const DeepNode = s.object({
        val: s.number()
    });
    const Root = s.object({
        n1: s.object({ n2: DeepNode }),
        n3: s.object({ n4: DeepNode })
    }).build();

    const reg5 = compile(Root);
    logIR(reg5);
    // Even if builders produced different objects, DeepNode should be deduplicated.

    console.log('\n3. Test Deduplication');
    const Name = s.string().min(3);
    const DoubleName = s.object({
        first: Name,
        last: Name
    });

    const reg3 = compile(DoubleName.build());
    logIR(reg3);
    // Expectation: 'first' and 'last' point to the SAME ID.

    console.log('\n6. Safety Check: Detect Structural Cycle');
    const A_raw = { type: 'object', properties: {} };
    const B_raw = { type: 'object', properties: { a: A_raw } };
    A_raw.properties.b = B_raw; // Manual cycle

    try {
        console.log('Attempting to compile cyclic schema...');
        compile(A_raw);
    } catch (e) {
        console.log('Caught Expected Error:', e.message);
    }

    console.log('\n7. Safety Check: Invalid selfRef');
    try {
        const InfiniteRef = s.selfRef(() => undefined);
        compile(InfiniteRef.build());
    } catch (e) {
        console.log('Caught Expected Error:', e.message);
    }
}

main().catch(console.error);
