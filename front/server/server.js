const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const util = require('util');
const app = express();

app.use(cors());
app.use(bodyParser.json())

const users = {
  "userCurrency" : {password : "currency", address : "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"},
  "userToken" : {password: "token", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
};

const deployedContracts = {
  addressCurrency: "",
  addressToken: "",
  addressDex: ""
};

// Helper function to wrap exec in a promise
const execPromise = util.promisify(exec);

app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const deployCurrencyCommand = 'npx hardhat run currency_deploy.js';
  const deployTokenCommand = 'npx hardhat run token_deploy.js';
  const deployDexCommand = 'npx hardhat run dex_deploy.js';

  if (users[username] && users[username].password === password) {
    if (deployedContracts.addressCurrency != "") {
      res.send({
        userAddress: users[username].address,
        addressCurrency: deployedContracts.addressCurrency,
        addressToken: deployedContracts.addressToken,
        addressDex: deployedContracts.addressDex
      });
    } else {
      const signerAddress = users[username].address;
      const env = { ...process.env, signerAddress };
      try {
        const { stdout: currencyOutput } = await execPromise(deployCurrencyCommand, { env });
        const addressCurrency = currencyOutput.trim();
        const { stdout: tokenOutput } = await execPromise(deployTokenCommand, { env });
        const addressToken = tokenOutput.trim();

        deployedContracts.addressCurrency = addressCurrency;
        deployedContracts.addressToken =  addressToken;

        const env_dex = {
          ...process.env,
          signerAddress,
          addressCurrency,
          addressToken
        };
        const { stdout: addressDex } = await execPromise(deployDexCommand, { env: env_dex });

        deployedContracts.addressDex =  addressDex.trim();

        res.send({
          userAddress: users[username].address,
          addressCurrency: addressCurrency,
          addressToken: addressToken,
          addressDex: addressDex.trim()
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Deployment failed' });
      }
    }
  } else {
    res.status(401).send({ message: 'Invalid username or password' });
  }
});

app.listen(3001, () => console.log('API is running on http://localhost:3001/login'));
