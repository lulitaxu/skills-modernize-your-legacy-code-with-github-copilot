# Test Plan — COBOL Accounting System (Mergington High School)

Test plan for the current COBOL implementation (`src/cobol/main.cob`,
`src/cobol/operations.cob`, `src/cobol/data.cob`), created to validate the
business logic with stakeholders and to serve as the basis for unit and
integration tests in the modernized Node.js application.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
| ------------ | --------------------- | -------------- | ---------- | --------------- | ------------- | ------------------ | -------- |
| TC-01 | View initial balance | Program compiled and started; no prior transactions | 1. Start the application. 2. Enter choice `1`. | "Current balance: 1000.00" is displayed (the starting balance defined in data.cob). | To be filled when executed | Pass/Fail | Verifies the default STORAGE-BALANCE of 1000.00 in data.cob. |
| TC-02 | Credit account with a valid amount | Program started | 1. Enter choice `2`. 2. Enter credit amount `250.00`. 3. Enter choice `1`. | "Amount credited. New balance: 1250.00" is displayed, and viewing the balance shows 1250.00. | To be filled when executed | Pass/Fail | Credit path in operations.cob (READ, ADD, WRITE). |
| TC-03 | Debit account with sufficient funds | Program started; balance is 1000.00 | 1. Enter choice `3`. 2. Enter debit amount `100.00`. 3. Enter choice `1`. | "Amount debited. New balance: 900.00" is displayed, and viewing the balance shows 900.00. | To be filled when executed | Pass/Fail | Debit path with FINAL-BALANCE >= AMOUNT. |
| TC-04 | Debit account with insufficient funds | Program started; balance is 1000.00 | 1. Enter choice `3`. 2. Enter debit amount `1500.00`. 3. Enter choice `1`. | "Insufficient funds for this debit." is displayed and the balance remains 1000.00. | To be filled when executed | Pass/Fail | Balance must not change and must never go negative. |
| TC-05 | Debit exactly the full balance | Program started; balance is 1000.00 | 1. Enter choice `3`. 2. Enter debit amount `1000.00`. | "Amount debited. New balance: 0.00" is displayed. | To be filled when executed | Pass/Fail | Boundary case: FINAL-BALANCE = AMOUNT is allowed (>= comparison). |
| TC-06 | Invalid menu choice | Program started | 1. Enter choice `9`. 2. Enter choice `1`. | "Invalid choice, please select 1-4." is displayed, the menu is shown again, and the balance is unchanged. | To be filled when executed | Pass/Fail | WHEN OTHER branch in main.cob. |
| TC-07 | Exit the program | Program started | 1. Enter choice `4`. | "Exiting the program. Goodbye!" is displayed and the program terminates. | To be filled when executed | Pass/Fail | Sets CONTINUE-FLAG to 'NO' in main.cob. |
| TC-08 | Multiple transactions in one session | Program started; balance is 1000.00 | 1. Credit `500.00`. 2. Debit `200.00`. 3. View balance. | Final balance displayed is 1300.00. | To be filled when executed | Pass/Fail | Verifies balance persists across operations within a run (data.cob READ/WRITE). |
| TC-09 | Credit then debit of the credited amount only | Program started; balance is 1000.00 | 1. Credit `50.00`. 2. Debit `1050.00`. 3. View balance. | Debit succeeds and the final balance is 0.00. | To be filled when executed | Pass/Fail | Combines credit and debit business rules. |
| TC-10 | Balance resets between runs | Program was run and exited after transactions changed the balance | 1. Restart the application. 2. Enter choice `1`. | "Current balance: 1000.00" is displayed. | To be filled when executed | Pass/Fail | Balance is in-memory only (VALUE 1000.00 in data.cob); no persistence between runs. |
| TC-11 | Decimal amount handling | Program started | 1. Enter choice `2`. 2. Enter credit amount `10.55`. 3. View balance. | Balance is 1010.55, respecting the PIC 9(6)V99 two-decimal format. | To be filled when executed | Pass/Fail | Amount format defined in operations.cob and data.cob. |
