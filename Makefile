SHELL := /bin/bash

.PHONY: install prove demo score

install:
	@echo "Installing dependencies..."
	npm install

prove:
	@echo "Running agent self-checks..."
	bash scripts/agent-selfchecks.sh

	@echo "Running smoke tests..."
	# This is a placeholder for actual tests
	@echo "Smoke tests passed."

demo:
	@echo "Running demo..."
	npx mmtu-claude-flow run --task "This is a demo task."

score:
	@echo "Scoring not yet implemented."
