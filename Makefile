.PHONY: help install playground build-playground clean

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (root + workspaces)
	npm install

playground: ## Start the playground dev server
	@LOCAL_IP=$$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "unknown"); \
	echo "\n  Network: http://$$LOCAL_IP:5173\n"; \
	npm run dev -w packages/playground

build-playground: ## Build the playground for production
	npm run build -w packages/playground

clean: ## Remove node_modules and build artifacts
	rm -rf node_modules packages/*/node_modules packages/*/dist
