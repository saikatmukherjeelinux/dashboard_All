"""Verify the Python snippet and displayed output attached to every new code-output quiz question."""
import concurrent.futures
import json
from pathlib import Path
from examples import verify

if __name__ == "__main__":
    manifest = Path(__file__).resolve().parents[1] / "test-results/quiz-examples.json"
    examples = json.loads(manifest.read_text(encoding="utf-8"))
    assert len(examples) == 324
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        failures = [failure for failure in pool.map(verify, enumerate(examples)) if failure]
    if failures:
        print("\n\n".join(failures))
        raise SystemExit(1)
    print("PASS: all 324 added quiz snippets executed with the displayed output.")
