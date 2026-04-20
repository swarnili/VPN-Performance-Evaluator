"""
Project 2: Performance Evaluation of Privacy-Enhancing Networks (VPN Simulation)
Flask Backend - app.py
"""

import time
import random
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


# ─────────────────────────────────────────────
# Core Functions
# ─────────────────────────────────────────────

def generate_data(size_mb: float) -> bytes:
    """Generate dummy payload of given size."""
    return b"X" * int(size_mb * 1024 * 1024)


def run_normal_test(data: bytes) -> dict:
    """
    Normal Mode: send data all at once with minimal overhead.
    """
    size_mb = len(data) / (1024 * 1024)

    start = time.perf_counter()
    time.sleep(random.uniform(0.005, 0.015))  # Minimal baseline network delay
    end = time.perf_counter()

    elapsed = end - start
    speed = size_mb / elapsed if elapsed > 0 else 0

    return {
        "mode": "Normal",
        "size_mb": round(size_mb, 2),
        "time_s": round(elapsed, 4),
        "speed_mbps": round(speed, 4),
    }


def run_vpn_test(data: bytes) -> dict:
    """
    VPN Mode: simulate VPN characteristics.
    - Send data in small chunks (64KB each)
    - Add artificial per-chunk latency (encryption + routing overhead)
    - Slightly randomize delay per chunk
    """
    size_mb = len(data) / (1024 * 1024)
    chunk_size = 512 * 1024  # 64 KB chunks
    total_chunks = max(1, len(data) // chunk_size)

    start = time.perf_counter()
    for _ in range(total_chunks):
        # Simulate VPN per-chunk latency: encryption + tunnel routing
        time.sleep(random.uniform(0.0001, 0.0005))
    end = time.perf_counter()

    elapsed = end - start
    speed = size_mb / elapsed if elapsed > 0 else 0

    return {
        "mode": "VPN",
        "size_mb": round(size_mb, 2),
        "time_s": round(elapsed, 4),
        "speed_mbps": round(speed, 4),
    }


def compute_stats(results: list) -> dict:
    """Compute avg, min, max speed from a list of result dicts."""
    if not results:
        return {}
    speeds = [r["speed_mbps"] for r in results]
    avg = sum(speeds) / len(speeds)
    return {
        "avg": round(avg, 4),
        "min": round(min(speeds), 4),
        "max": round(max(speeds), 4),
    }


# ─────────────────────────────────────────────
# Flask Routes
# ─────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/run_test", methods=["POST"])
def run_test():
    """
    Expects JSON: { size_mb: float, runs: int, mode: "Normal"|"VPN"|"Both" }
    Returns results + stats + slowdown percentage.
    """
    body = request.get_json(force=True)
    size_mb = float(body.get("size_mb", 5))
    runs    = int(body.get("runs", 5))
    mode    = body.get("mode", "Both")

    data = generate_data(size_mb)

    normal_results = []
    vpn_results    = []

    for i in range(1, runs + 1):
        if mode in ("Normal", "Both"):
            r = run_normal_test(data)
            r["run"] = i
            normal_results.append(r)

        if mode in ("VPN", "Both"):
            r = run_vpn_test(data)
            r["run"] = i
            vpn_results.append(r)

    normal_stats = compute_stats(normal_results)
    vpn_stats    = compute_stats(vpn_results)

    # Percentage slowdown
    slowdown = None
    if normal_stats and vpn_stats:
        slowdown = round(
            (normal_stats["avg"] - vpn_stats["avg"]) / normal_stats["avg"] * 100, 1
        )

    return jsonify({
        "normal_results": normal_results,
        "vpn_results":    vpn_results,
        "normal_stats":   normal_stats,
        "vpn_stats":      vpn_stats,
        "slowdown_pct":   slowdown,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5001)