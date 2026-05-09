deploy:
	npm run build
	firebase deploy

test:
	npx vitest
