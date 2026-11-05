/**
 * Unit tests for the Node.js accounting application.
 * Each test mirrors a scenario from docs/TESTPLAN.md.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Account, viewBalance, creditAccount, debitAccount } = require('./index');

test('TC-01: initial balance is 1000.00', () => {
  const account = new Account();
  assert.equal(viewBalance(account), 1000.0);
});

test('TC-02: credit increases the balance', () => {
  const account = new Account();
  assert.equal(creditAccount(account, 250.0), 1250.0);
  assert.equal(viewBalance(account), 1250.0);
});

test('TC-03: debit with sufficient funds decreases the balance', () => {
  const account = new Account();
  assert.equal(debitAccount(account, 100.0), 900.0);
  assert.equal(viewBalance(account), 900.0);
});

test('TC-04: debit with insufficient funds is rejected and balance is unchanged', () => {
  const account = new Account();
  assert.equal(debitAccount(account, 1500.0), null);
  assert.equal(viewBalance(account), 1000.0);
});

test('TC-05: debit of exactly the full balance succeeds', () => {
  const account = new Account();
  assert.equal(debitAccount(account, 1000.0), 0.0);
});

test('TC-08: multiple transactions accumulate in one session', () => {
  const account = new Account();
  creditAccount(account, 500.0);
  debitAccount(account, 200.0);
  assert.equal(viewBalance(account), 1300.0);
});

test('TC-09: debit can spend a previous credit down to zero', () => {
  const account = new Account();
  creditAccount(account, 50.0);
  assert.equal(debitAccount(account, 1050.0), 0.0);
});

test('TC-10: a new account starts again at 1000.00 (no persistence)', () => {
  const first = new Account();
  creditAccount(first, 999.0);
  const second = new Account();
  assert.equal(viewBalance(second), 1000.0);
});

test('TC-11: decimal amounts keep two-decimal precision', () => {
  const account = new Account();
  creditAccount(account, 10.55);
  assert.equal(viewBalance(account).toFixed(2), '1010.55');
});
