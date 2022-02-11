# Dapp project template

![Frontend screenshot](/front/assets/screenshot.png)

This is a default template to kickstart your dapp development.

Built with [Hardhat](https://hardhat.org/). 

Only requires [node](https://nodejs.org/en/download/) and few dependencies:

- `yarn` for package management (recommended over `npm`)
- `hardhat`, `ethers`, `chai`, `ethereum-waffle` and `dotenv` for testing 
- `@openzeppelin/contracts` for *quick* and *secure* smart contract development

## Getting started

```bash
git clone https://github.com/MatthieuScarset/dapp-project-template.git my-dapp
cd my-dapp
yarn install
cp .env.example .env
# Edit .env file with your credentials.
yarn compile
yarn test
```

## Deploy your contract(s)

```bash
yarn run deploy 
yarn run verify
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
