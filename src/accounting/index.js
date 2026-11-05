/**
 * Node.js modernization of the Mergington High School COBOL accounting system.
 *
 * Converted from the three COBOL programs in src/cobol:
 *   - main.cob       (MainProgram)  -> the menu loop in runMenu()
 *   - operations.cob (Operations)   -> viewBalance() / creditAccount() / debitAccount()
 *   - data.cob       (DataProgram)  -> the Account balance store (READ/WRITE)
 *
 * Business logic preserved from the original:
 *   - The account starts with a balance of 1000.00.
 *   - Credit adds the entered amount to the balance.
 *   - Debit subtracts the entered amount only when the balance covers it;
 *     otherwise it reports insufficient funds and leaves the balance unchanged.
 *   - The balance is kept in memory only and resets on each run.
 */

const readline = require('node:readline');
const { stdin, stdout } = require('node:process');

const STARTING_BALANCE = 1000.0;

/** In-memory balance store, equivalent to data.cob (DataProgram). */
class Account {
  constructor(initialBalance = STARTING_BALANCE) {
    this.balance = initialBalance;
  }

  /** Equivalent of DataProgram 'READ'. */
  readBalance() {
    return this.balance;
  }

  /** Equivalent of DataProgram 'WRITE'. */
  writeBalance(newBalance) {
    this.balance = newBalance;
  }
}

/** Equivalent of Operations 'TOTAL': return the current balance. */
function viewBalance(account) {
  return account.readBalance();
}

/** Equivalent of Operations 'CREDIT': add amount and return the new balance. */
function creditAccount(account, amount) {
  const newBalance = account.readBalance() + amount;
  account.writeBalance(newBalance);
  return newBalance;
}

/**
 * Equivalent of Operations 'DEBIT ': subtract amount when funds are
 * sufficient. Returns the new balance, or null when funds are insufficient
 * (balance left unchanged), matching the COBOL behavior.
 */
function debitAccount(account, amount) {
  const balance = account.readBalance();
  if (balance >= amount) {
    const newBalance = balance - amount;
    account.writeBalance(newBalance);
    return newBalance;
  }
  return null;
}

function format(amount) {
  return amount.toFixed(2);
}

/** Menu loop, equivalent to main.cob (MainProgram). */
async function runMenu() {
  const account = new Account();
  const rl = readline.createInterface({ input: stdin, output: stdout });

  // Queue incoming lines so both interactive typing and piped input work.
  const lines = [];
  const waiters = [];
  let closed = false;
  rl.on('line', (line) => {
    if (waiters.length > 0) waiters.shift()(line);
    else lines.push(line);
  });
  rl.on('close', () => {
    closed = true;
    while (waiters.length > 0) waiters.shift()(null);
  });
  const ask = (prompt) => {
    stdout.write(prompt);
    if (lines.length > 0) return Promise.resolve(lines.shift());
    if (closed) return Promise.resolve(null);
    return new Promise((resolve) => waiters.push(resolve));
  };

  let continueFlag = 'YES';

  while (continueFlag !== 'NO') {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const answer = await ask('Enter your choice (1-4): ');
    if (answer === null) break;
    const choice = parseInt(answer, 10);

    if (choice === 1) {
      console.log(`Current balance: ${format(viewBalance(account))}`);
    } else if (choice === 2) {
      const amount = parseFloat(await ask('Enter credit amount: '));
      const newBalance = creditAccount(account, amount);
      console.log(`Amount credited. New balance: ${format(newBalance)}`);
    } else if (choice === 3) {
      const amount = parseFloat(await ask('Enter debit amount: '));
      const newBalance = debitAccount(account, amount);
      if (newBalance === null) {
        console.log('Insufficient funds for this debit.');
      } else {
        console.log(`Amount debited. New balance: ${format(newBalance)}`);
      }
    } else if (choice === 4) {
      continueFlag = 'NO';
    } else {
      console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

if (require.main === module) {
  runMenu();
}

module.exports = { Account, viewBalance, creditAccount, debitAccount, STARTING_BALANCE };
