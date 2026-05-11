DOCKER_COMPOSE_FILE  = docker-compose.yml
COMPOSE_PROJECT_NAME = budget-manager	

DOCKER_COMPOSE = docker compose -p $(COMPOSE_PROJECT_NAME) -f ../$(DOCKER_COMPOSE_FILE)
DOCKER_COMPOSE_EXEC = $(DOCKER_COMPOSE) exec vue-app

.PHONY: shell log

shell:
	$(DOCKER_COMPOSE_EXEC) sh

log: 
	$(DOCKER_COMPOSE) logs -f vue-app