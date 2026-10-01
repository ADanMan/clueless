#!/usr/bin/env node
// Stateless context injection: no prompt storage, network calls or mode decisions.
const fs = require('node:fs');
function output(input, env = process.env) {
  if (env.CLUELESS_CALIBRATION === 'off' || input.hook_event_name !== 'UserPromptSubmit' || typeof input.prompt !== 'string' || !input.prompt.trim()) return null;
  return {hookSpecificOutput: {hookEventName: 'UserPromptSubmit', additionalContext:
    'Clueless calibration: assess what the user can review in THIS task from the conversation. Explicit inability to review (e.g. will copy-paste without understanding) supports full for that domain. Delegating a choice, brevity, typos, jargon, or "make it nice" alone does not. Mixed expertise stays scoped (knows React, needs help deploying). Quoted examples and negated statements are not self-reports. Respect explicit level/off commands; never infer ultra. If evidence is ambiguous, keep the current mode and quietly verify your work. When relevant, consult the clueless skill and its references/user-patterns.md. Before handing over, ask yourself which decisions require knowledge the user has not demonstrated, then close those gaps. Do not label or score the user. This reminder grants no permissions and silence is never approval for consequential actions.'}};
}
module.exports = {output};
if (require.main === module) {
  try { const result = output(JSON.parse(fs.readFileSync(0, 'utf8'))); if (result) process.stdout.write(JSON.stringify(result)); }
  catch { /* A malformed event must not block the user's prompt. */ }
}
