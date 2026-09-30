You are grading one answer against a checklist. For each checklist item output exactly one of:
- PASS: the answer states it clearly and actionably (as a step, a warning at the top, or a named decision).
- BURIED: the answer contains it but only as a trailing note, an aside, or something implied (e.g. under "things worth knowing, no action needed").
- FAIL: absent.

Be strict. A PASS requires that a non-expert reading the answer would act on it. Output ONLY a JSON array of strings in checklist order, e.g. ["PASS","FAIL","BURIED",...]. No commentary.
