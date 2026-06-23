---
title: "Python Web Security Toolkit"
description: "A collection of Python tools for web security testing: SSRF probing, subdomain enumeration, header injection testing, and automated PoC generation."
date: "2024-08"
tags: ["Python", "Web Security", "SSRF", "Recon", "Automation"]
github: "https://github.com/amrloksha151/py-sec-toolkit"
featured: false
status: "active"
---

## Overview

A modular Python toolkit for offensive web security testing, designed for bug bounty hunting and penetration testing engagements.

## Modules

### ssrf-probe.py
Server-Side Request Forgery testing tool that:
- Automatically tests URL parameters for SSRF
- Chains through multiple redirects to detect blind SSRF
- Integrates with Burp Collaborator for out-of-band detection
- Supports cloud metadata endpoint payloads (AWS, GCP, Azure)

### subdomain-chaos.py
Subdomain enumeration combining:
- DNS bruteforce with custom wordlists
- Certificate transparency log scraping
- Shodan/Censys API integration for historical data
- Permutation generation for likely subdomains

### header-inject.py
HTTP header injection testing:
- Host header injection for password reset poisoning
- X-Forwarded-For manipulation
- Cache header fuzzing
- Response header reflection detection
