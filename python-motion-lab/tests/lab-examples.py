"""Verify the Python snippet and displayed output attached to every new lab."""
import concurrent.futures
import json
from pathlib import Path
from examples import verify

if __name__ == "__main__":
    manifest = Path(__file__).resolve().parents[1] / "test-results/lab-examples.json"
    examples = json.loads(manifest.read_text(encoding="utf-8"))
    assert len(examples) == 94
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        failures = [failure for failure in pool.map(verify, enumerate(examples)) if failure]
    if failures:
        print("\n\n".join(failures))
        raise SystemExit(1)
    print("PASS: all 94 added visual-lab snippets executed with the displayed output.")
