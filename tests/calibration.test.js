const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const script = path.join(__dirname, '../hooks/calibrate.cjs');
function run(input, env={}) { return spawnSync(process.execPath,[script],{input,encoding:'utf8',env:{...process.env,CLUELESS_CALIBRATION:'on',...env}}); }
test('valid prompt injects bounded context without echoing user text',()=>{
 const r=run(JSON.stringify({hook_event_name:'UserPromptSubmit',prompt:'private-test-message'}));
 assert.equal(r.status,0); const o=JSON.parse(r.stdout);
 assert.equal(o.hookSpecificOutput.hookEventName,'UserPromptSubmit');
 assert.ok(o.hookSpecificOutput.additionalContext.length<2000);
 assert.ok(!r.stdout.includes('private-test-message')); assert.equal(o.decision,undefined);
});
test('disabled, irrelevant, empty and malformed inputs fail open',()=>{
 for(const input of ['{','{}',JSON.stringify({hook_event_name:'Stop',prompt:'x'}),JSON.stringify({hook_event_name:'UserPromptSubmit',prompt:''})]){
 const r=run(input); assert.equal(r.status,0); assert.equal(r.stdout,'');
 }
 assert.equal(run(JSON.stringify({hook_event_name:'UserPromptSubmit',prompt:'x'}),{CLUELESS_CALIBRATION:'off'}).stdout,'');
});
