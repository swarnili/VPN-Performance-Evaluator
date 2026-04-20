 Connection to Project 1 (Network-Analyzer-Pro)
 https://github.com/swarnili/Network-Analyzer-Pro
This project is an analytical extension of Network-Analyzer-Pro. While the first project established the infrastructure for real-time monitoring of raw data flow, this project investigates the "Performance-Security Trade-off." It measures the computational "tax" that encryption, encapsulation, and tunneling place on the network architecture built in Project 1.

 Project Overview
VPN-Performance-Evaluator is a Flask-based simulation engine that models how Privacy-Enhancing Networks (VPNs) impact network throughput. By simulating per-packet encryption latency, this tool provides a side-by-side benchmark of "Normal" traffic versus "Secure" traffic, visualized through a modern web dashboard.

 Key Features
Encryption Modeling: Uses mathematical simulation to represent per-chunk latency introduced by VPN tunnel processing.

Comparative Benchmarking: Real-time analysis of "Normal Mode" vs. "VPN Mode."

Data Visualization: Integrated Chart.js dashboards for mapping speed vs. runs and mode comparisons.

Network Metrics: Automated calculation of Average Speed (MB/s), Jitter (Min/Max), and Percentage Slowdown.

 Technical Stack
Backend: Python (Flask)

Frontend: JavaScript (ES6+), CSS3 (Glassmorphism UI)

Charts: Chart.js

Logic: Socket-level simulation, Packet Chunking, Throughput Analysis.

 Project Hierarchy
Network-Analyzer-Pro — The Foundation (Monitoring)

VPN-Performance-Evaluator — The Analysis (Security Overhead)

