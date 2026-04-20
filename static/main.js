/* IITB2 — VPN Simulation — main.js */

let selectedMode = "Both";
let selectedSize = 10;
let lineChart = null;
let barChart  = null;

// ── Clock ─────────────────────────────────────────────────
function updateClock() {
  document.getElementById("clock").textContent =
    new Date().toLocaleTimeString("en-IN", { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// ── Mode buttons ──────────────────────────────────────────
document.querySelectorAll("#mode-group .tog").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#mode-group .tog").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMode = btn.dataset.val;
  });
});

// ── Size buttons ──────────────────────────────────────────
document.querySelectorAll("#size-group .tog").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#size-group .tog").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedSize = parseFloat(btn.dataset.val);
  });
});

// ── Runs slider ───────────────────────────────────────────
document.getElementById("runs-slider").addEventListener("input", function () {
  document.getElementById("runs-val").textContent = this.value;
});

// ── Run button ────────────────────────────────────────────
document.getElementById("run-btn").addEventListener("click", async () => {
  const btn     = document.getElementById("run-btn");
  const btnText = document.getElementById("btn-text");
  const spinner = document.getElementById("btn-spin");

  btn.disabled = true;
  btnText.textContent = "[ RUNNING... ]";
  spinner.classList.remove("hidden");

  try {
    const res  = await fetch("/run_test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        size_mb: selectedSize,
        runs:    parseInt(document.getElementById("runs-slider").value),
        mode:    selectedMode,
      }),
    });
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    btn.disabled = false;
    btnText.textContent = "[ RUN TEST ]";
    spinner.classList.add("hidden");
  }
});

// ── Render Results ────────────────────────────────────────
function renderResults(data) {
  const ns = data.normal_stats;
  const vs = data.vpn_stats;

  document.getElementById("c-normal-avg").textContent = ns.avg ?? "—";
  document.getElementById("c-vpn-avg").textContent    = vs.avg ?? "—";
  document.getElementById("c-slowdown").textContent   = data.slowdown_pct != null ? data.slowdown_pct : "—";
  document.getElementById("summary-cards").classList.remove("hidden");

  if (ns.avg) {
    document.getElementById("n-min").textContent = ns.min;
    document.getElementById("n-max").textContent = ns.max;
    document.getElementById("n-avg").textContent = ns.avg;
  }
  if (vs.avg) {
    document.getElementById("v-min").textContent = vs.min;
    document.getElementById("v-max").textContent = vs.max;
    document.getElementById("v-avg").textContent = vs.avg;
  }
  document.getElementById("stats-row").classList.remove("hidden");

  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  const allRows = [...data.normal_results, ...data.vpn_results]
    .sort((a, b) => a.run - b.run || a.mode.localeCompare(b.mode));

  allRows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.run}</td>
      <td class="${r.mode === "Normal" ? "m-n" : "m-v"}">${r.mode}</td>
      <td>${r.size_mb}</td>
      <td>${r.time_s}</td>
      <td>${r.speed_mbps}</td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById("table-wrap").classList.remove("hidden");

  renderCharts(data);
}

// ── Chart base options ────────────────────────────────────
function baseOpts() {
  return {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#f0dfc0",
          font: { family: "'Share Tech Mono', monospace", size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(10,7,0,0.9)",
        borderColor: "rgba(255,106,0,0.3)", borderWidth: 1,
        titleColor: "#ff9a3c", bodyColor: "#f0dfc0",
        titleFont: { family: "'Share Tech Mono', monospace" },
        bodyFont:  { family: "'Share Tech Mono', monospace" },
      }
    },
    scales: {
      x: {
        grid:  { color: "rgba(255,106,0,0.08)" },
        ticks: { color: "#7a5c30", font: { family: "'Share Tech Mono', monospace", size: 11 } }
      },
      y: {
        grid:  { color: "rgba(255,106,0,0.08)" },
        ticks: { color: "#7a5c30", font: { family: "'Share Tech Mono', monospace", size: 11 } }
      }
    }
  };
}

// ── Render Charts ─────────────────────────────────────────
function renderCharts(data) {
  // Line chart
  if (lineChart) lineChart.destroy();
  const labels = (data.normal_results.length ? data.normal_results : data.vpn_results)
    .map(r => `RUN_${r.run}`);

  const datasets = [];
  if (data.normal_results.length) {
    datasets.push({
      label: "NORMAL",
      data: data.normal_results.map(r => r.speed_mbps),
      borderColor: "#39ff14",
      backgroundColor: "rgba(57,255,20,0.06)",
      tension: 0.35, pointRadius: 5,
      pointBackgroundColor: "#39ff14",
      pointBorderColor: "#39ff14",
    });
  }
  if (data.vpn_results.length) {
    datasets.push({
      label: "VPN",
      data: data.vpn_results.map(r => r.speed_mbps),
      borderColor: "#ff6a00",
      backgroundColor: "rgba(255,106,0,0.06)",
      tension: 0.35, pointRadius: 5,
      pointBackgroundColor: "#ff6a00",
      pointBorderColor: "#ff6a00",
    });
  }

  lineChart = new Chart(document.getElementById("lineChart").getContext("2d"), {
    type: "line",
    data: { labels, datasets },
    options: { ...baseOpts(), animation: { duration: 700 } },
  });

  // Bar chart
  if (barChart) barChart.destroy();
  const bl = [], bv = [], bc = [];
  if (data.normal_stats.avg) { bl.push("NORMAL"); bv.push(data.normal_stats.avg); bc.push("rgba(57,255,20,0.7)"); }
  if (data.vpn_stats.avg)    { bl.push("VPN");    bv.push(data.vpn_stats.avg);    bc.push("rgba(255,106,0,0.75)"); }

  barChart = new Chart(document.getElementById("barChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: bl,
      datasets: [{
        label: "AVG SPEED (MB/s)",
        data: bv,
        backgroundColor: bc,
        borderColor: bc.map(c => c.replace(/0\.\d+\)$/, "1)")),
        borderWidth: 1, borderRadius: 5,
      }]
    },
    options: { ...baseOpts(), animation: { duration: 700 } },
  });
}