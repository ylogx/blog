.PHONY: dev prod dev-local prod-local clean install update update-next dependencies-outdated help

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev            - Start the blog in development mode using Docker"
	@echo "  make prod           - Start the blog in production mode using Docker"
	@echo "  make dev-local      - Start the blog in development mode locally"
	@echo "  make prod-local     - Build and start the blog in production mode locally"
	@echo "  make clean          - Clean up build artifacts and node_modules"
	@echo "  make install        - Install dependencies"
	@echo "  make update         - Update all dependencies to their latest versions"
	@echo "  make update-next    - Update Next.js to the latest version"
	@echo "  make dependencies-outdated - Show outdated dependencies"

# Docker commands
dev:
	docker compose up blog-dev --build

prod:
	docker compose up -d blog-prod --build

logs:
	docker compose logs -f

logs-dev:
	docker-compose logs -f blog-dev

logs-prod:
	docker-compose logs -f blog-prod

down: down-dev down-prod

down-dev:
	docker compose down blog-dev

down-prod:
	docker compose down blog-prod

# Local development commands
dev-local:
	npm run dev

prod-local:
	npm run build
	npm run start

# Cleanup
clean:
	rm -rf .next node_modules
	npm cache clean --force

# Install dependencies
install:
	npm install

# Update dependencies
update:
	npm update --save
	npm update --save-dev

# Update Next.js specifically
update-next:
	npm install next@latest react@latest react-dom@latest eslint-config-next@latest

# Show outdated dependencies
dependencies-outdated:
	npm outdated
