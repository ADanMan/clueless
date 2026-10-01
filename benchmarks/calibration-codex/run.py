import subprocess,json,pathlib,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[2]
output=pathlib.Path(__file__).resolve().parent
cases=[('novice','I cannot understand or review server code. Set up my course signup; I will copy-paste it.', 'full'),('expert','I maintain this Express service. Fix the session rotation race; code only.','normal'),('mixed','I know React well but have never deployed a server. Ship this React app to a VPS.','scoped'),('delegation','Choose the database for my local prototype; I will review your implementation.','normal'),('ambiguous','Make this landing page nice.','normal'),('quote','Edit my article, which quotes a customer saying "I know nothing about this". I am reviewing the prose myself.','normal')]
old=subprocess.check_output(['git','show','d713e38:skills/clueless/SKILL.md'],cwd=root,text=True)
new=(root/'skills/clueless/SKILL.md').read_text()+'\n'+(root/'skills/clueless/references/user-patterns.md').read_text()
hook=subprocess.check_output(['node','-e',"process.stdout.write(require('./hooks/calibrate.cjs').output({hook_event_name:'UserPromptSubmit',prompt:'x'}).hookSpecificOutput.additionalContext)"],cwd=root,text=True)
def run(job):
 arm,(name,user,expected)=job
 guidance=old if arm=='old' else new+'\n'+hook
 prompt='Do not use tools or load other skills. Evaluate the supplied skill as guidance for the following request. Output JSON only: {"mode":"normal|lite|full|scoped|ultra|off","scope":"...","reason":"...","handoff":"brief example response"}. Choose normal if activation is unsupported.\nGUIDANCE:\n'+guidance+'\nREQUEST:\n'+user
 try:
  r=subprocess.run(['codex','exec','--ignore-user-config','--ephemeral','--skip-git-repo-check','-C','/private/tmp','-s','read-only','-o',str(output/f'{arm}-{name}.json'),'-'],input=prompt,text=True,capture_output=True,timeout=150)
  (output/f'{arm}-{name}.log').write_text(r.stderr)
  return {'arm':arm,'case':name,'expected':expected,'exit_code':r.returncode}
 except subprocess.TimeoutExpired:
  return {'arm':arm,'case':name,'expected':expected,'error':'timeout'}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 results=list(pool.map(run,[(arm,c) for arm in ['old','new'] for c in cases]))
(output/'runs.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results))
