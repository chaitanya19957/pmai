# Automations

Automations listen to external events and trigger workflows.

Rules:
- Automations trigger workflows only (never skills directly).
- Automations do not call tools directly.
- Automations should normalize event payloads into workflow inputs.

Folders:
- triggers/: declarative event routing rules (e.g., yaml)
- scripts/: runners that invoke workflows
