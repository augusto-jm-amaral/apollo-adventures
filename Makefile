database:
	@docker-compose up -d database

start: database
	@docker-compose up -d server

down:
	@docker-compose down -v --rmi local --remove-orphans

.PHONY: start database