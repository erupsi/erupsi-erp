# Makefile at project root
# This Makefile is used to manage Docker containers and services for a project.
# It provides targets to build, start, stop, view logs, and run tests for all services.
# Why I should remember these commands if I can use Makefile?

# Default target
.PHONY: help
help:
	@echo "Makefile for managing Docker containers and services"
	@echo "Syntax:"
	@echo "  make <target>"
	@echo "Usage:"
	@echo "  make help         Show this help message"
	@echo "  make build        Build all Docker containers"
	@echo "  make up           Start containers with docker-compose"
	@echo "  make down         Stop containers"
	@echo "  make logs         View logs"
	@echo "  make test         Run tests for all services"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

test:
	npm test --workspaces
