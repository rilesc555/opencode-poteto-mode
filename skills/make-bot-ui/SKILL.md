---
name: Make Bot UI
description: Build a small local UI that sends validated JSON to a user-provided webhook while keeping credentials on the server.
disable-model-invocation: true
---

# Make a webhook UI

Build a page that sends an action to a local server. The local server validates the action and sends JSON to a user-provided webhook.

## Requirements

1. Ask for the webhook contract, URL source, authentication method, allowed actions, and hosting scope.
2. Do not ask the user to paste a secret into chat. Read it from an environment variable or the project's secret manager.
3. Keep the webhook URL and credential on the server. Do not send them to browser code.
4. Validate the browser request against an allowlist. Treat labels, IDs, and free text as data.
5. Use an 8-second timeout and no automatic retry unless the receiving service documents idempotency.
6. Return a clear success or failure result to the page. Do not log credentials or authorization headers.
7. Use the **control-ui** skill to test the page and capture evidence.
8. Send one harmless probe that the webhook contract permits before you report success.

## Network access

Bind to `127.0.0.1` by default. Bind to `0.0.0.0` only when the user asks for network access and the host firewall limits exposure. If the user asks for Tailscale access, use the installed Tailscale tools and current node. Do not install or authenticate Tailscale without explicit approval.

## Result

Report the local URL, configuration variable names, tested action, HTTP result, and any remaining access requirement. Never print secret values.
