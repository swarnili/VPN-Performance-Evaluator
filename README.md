 **Connection to Project 1 (Network-Analyzer-Pro)**
 https://github.com/swarnili/Network-Analyzer-Pro
This project is an analytical extension of Network-Analyzer-Pro. While the first project established the infrastructure for real-time monitoring of raw data flow, this project investigates the "Performance-Security Trade-off." It measures the computational "tax" that encryption, encapsulation, and tunneling place on the network architecture built in Project 1.

 **Project Overview**
VPN-Performance-Evaluator is a Flask-based simulation engine that models how Privacy-Enhancing Networks (VPNs) impact network throughput. By simulating per-packet encryption latency, this tool provides a side-by-side benchmark of "Normal" traffic versus "Secure" traffic, visualized through a modern web dashboard.

 **Key Features**
**Encryption Modeling:** Uses mathematical simulation to represent per-chunk latency introduced by VPN tunnel processing.

**Comparative Benchmarking:** Real-time analysis of "Normal Mode" vs. "VPN Mode."

**Data Visualization:** Integrated Chart.js dashboards for mapping speed vs. runs and mode comparisons.

**Network Metrics:** Automated calculation of Average Speed (MB/s), Jitter (Min/Max), and Percentage Slowdown.

 **Technical Stack**
Backend: Python (Flask)

Frontend: JavaScript (ES6+), CSS3 (Glassmorphism UI)

Charts: Chart.js

Logic: Socket-level simulation, Packet Chunking, Throughput Analysis.

 Project Hierarchy
Network-Analyzer-Pro — The Foundation (Monitoring)

VPN-Performance-Evaluator — The Analysis (Security Overhead)

**The Network Security Trilogy: Infrastructure to Intelligence**
**This repository is part of a comprehensive three-module ecosystem designed to explore the lifecycle of network telemetry. The project series transitions from raw data acquisition to security modeling and concludes with automated analytical reporting.**

**Phase 1: Network-Analyzer-Pro — The Eyes: Focuses on the "Monitoring Layer." It utilizes Python-based packet sniffing to capture real-time TCP/UDP traffic, providing essential visibility into protocol distribution and network flow.**
**https://github.com/swarnili/Network-Analyzer-Pro**

**Phase 2: VPN-Performance-Evaluator — The Shield: Focuses on the "Security Layer." This module introduces encryption overhead and VPN tunneling simulations, modeling the mathematical trade-offs between data privacy (AES-256) and network throughput.**
**https://github.com/swarnili/VPN-Performance-Evaluator**

**Phase 3: NetProbe-V3 — The Brain: Focuses on the "Intelligence Layer." It acts as the final analytical brain, using statistical variance to calculate stability scores and generating automated, multi-format (PDF/CSV) research insights from the data captured in the previous phases.**
**https://github.com/swarnili/NetProbe-V3**

**Together, these projects demonstrate a full-stack engineering journey through network infrastructure, cybersecurity trade-offs, and data-driven interpretation**

