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

// Helper function to wrap exec in a promise
const execPromise = util.promisify(exec);

app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const deployCurrencyCommand = 'npx hardhat run currency_deploy.js';
  const deployTokenCommand = 'npx hardhat run token_deploy.js';

  if (users[username] && users[username].password === password) {
    const signerAddress = users[username].address;
    const env = { ...process.env, signerAddress };
    try {
      const { stdout: addressCurrency } = await execPromise(deployCurrencyCommand, { env });
      const { stdout: addressToken } = await execPromise(deployTokenCommand, { env });

      res.send({
        userAddress: users[username].address,
        addressCurrency: addressCurrency.trim(),
        addressToken: addressToken.trim()
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Deployment failed' });
    }
  } else {
    res.status(401).send({ message: 'Invalid username or password' });
  }
});

app.listen(3001, () => console.log('API is running on http://localhost:3001/login'));