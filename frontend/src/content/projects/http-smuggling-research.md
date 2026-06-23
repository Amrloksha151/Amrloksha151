---
title: "HTTP Request Smuggling Research"
description: "Deep-dive research into HTTP/1.1 and HTTP/2 request smuggling vulnerabilities, focusing on CDN and reverse proxy discrepancies in header parsing."
date: "2025-03"
tags: ["HTTP Smuggling", "Web Security", "Bug Bounty", "Python", "Burp Suite"]
github: "https://github.com/amrloksha151/http-smuggling-research"
featured: true
status: "active"
---

## Overview

This research project investigates HTTP request smuggling vulnerabilities that arise from parsing discrepancies between frontend CDN layers and backend origin servers.

## Background

HTTP request smuggling occurs when a frontend server and backend server disagree on where a request body ends. This ambiguity can be exploited to interfere with other users' requests, bypass security controls, and in some cases achieve full account takeover.

## Methodology

### Environment Setup
- Custom Python tooling to automate CL.TE and TE.CL smuggling payloads
- Burp Suite Pro with the HTTP Request Smuggler extension
- Lab environments simulating Cloudflare + nginx, AWS CloudFront + Apache, and Fastly + HAProxy

### Key Findings

1. **CDN Header Normalization**: Major CDNs normalize `Transfer-Encoding` headers differently, creating a window for CL.TE attacks on certain backend configurations.
2. **HTTP/2 Downgrade Attacks**: When CDNs downgrade HTTP/2 to HTTP/1.1, the conversion process can introduce ambiguous content-length values.
3. **Trailer Injection**: Some proxy chains fail to strip HTTP/1.1 trailers when forwarding, enabling novel injection vectors.

## Tools Developed

- `smuggle-scan.py` - Automated scanner that tests endpoints for CL.TE, TE.CL, and TE.TE variants
- `timing-oracle.py` - Timing-based detection tool for confirming smuggling without visible side effects

## Results

Identified and reported 3 confirmed smuggling vulnerabilities across two major platforms (details withheld pending disclosure timeline). Earned $4,500 in bug bounty rewards.
