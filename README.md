# Dapp project template frontend

This is a default template to serve a simple UX for your dapp.

Only requirement is to have `node` and `yarn` or `npm` installed.

Zero dependencies.

## Getting started

```bash
git clone https://github.com/MatthieuScarset/dapp-project-template.git my-dapp
cd my-dapp
yarn install
yarn compile
yarn test
```

## Deploy your contract(s)

```bash
cp .env.example .env
# Edit .env file with your credentials.
yarn deploy 
yarn verify
```


## Frontend

A simple frontend application is included in the `front/` folder.

```bash
cd front/
yarn install
yarn init 
yarn serve
```

Open [localhost:8080](http://localhost:8080) and you're good to go.

[Read more here](front/README.md).

Enjoy!

---

Still have questions? Feel free [to contact me anytime](humans.txt).
