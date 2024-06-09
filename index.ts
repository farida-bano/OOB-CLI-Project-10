#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';

// Transaction Class
class Transaction {
    type: string;
    amount: number;
    date: Date;

    constructor(type: string, amount: number) {
        this.type = type;
        this.amount = amount;
        this.date = new Date();
    }
}

// Bank Account Class
class BankAccount {
    accountNumber: number;
    balance: number;
    transactions: Transaction[];

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.transactions = [];
    }

    // Debit money 
    withdraw(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.transactions.push(new Transaction('Withdrawal', amount));
            console.log(chalk.green(`Withdrawal of $${amount} successful. Remaining balance: $${this.balance}`));
        } else {
            console.log(chalk.red("Insufficient balance."));
        }
    }

    // Credit Money 
    deposit(amount: number): void {
        if (amount > 100) {
            amount -= 1; // $1 fee charged if more than $100 is deposited
        }
        this.balance += amount;
        this.transactions.push(new Transaction('Deposit', amount));
        console.log(chalk.green(`Deposit of $${amount} successful. Remaining balance: $${this.balance}`));
    }

    // Check balance
    checkBalance(): void {
        console.log(chalk.blue(`Current balance: $${this.balance}`));
    }

    // Display transaction history
    displayTransactions(): void {
        console.log(chalk.blue('Transaction History:'));
        this.transactions.forEach(transaction => {
            console.log(`${transaction.date.toISOString()} - ${transaction.type}: $${transaction.amount}`);
        });
    }
}

// Customer class
class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: number;
    account: BankAccount;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobileNumber: number, account: BankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}

// Create bank accounts
const accounts: BankAccount[] = [
    new BankAccount(1001, 500),
    new BankAccount(1002, 1000),
    new BankAccount(1003, 2000)
];

// Create customers
const customers: Customer[] = [
    new Customer("Hassan", "Ali", "Male", 35, 5463767871, accounts[0]),
    new Customer("Salma", "Asad", "Female", 24, 5487134256, accounts[1]),
    new Customer("Ramsha", "Asghar", "Female", 28, 6767827871, accounts[2])
];

// Function to interact with bank account
async function service(): Promise<void> {
    while (true) {
        const { welcomeOption } = await inquirer.prompt<{ welcomeOption: string }>({
            name: 'welcomeOption',
            type: 'list',
            message: 'Welcome to the Bank! Please select an option:',
            choices: ['Enter Account Number', 'Exit']
        });

        if (welcomeOption === 'Exit') {
            console.log(chalk.blue("Exiting bank program..."));
            console.log(chalk.blue("\nThank you for using our bank service. Have a great day!"));
            break;
        }

        const { accountNumber } = await inquirer.prompt<{ accountNumber: string }>({
            name: 'accountNumber',
            type: 'input',
            message: 'Enter your account number:',
            validate: value => !isNaN(Number(value)) && Number(value) > 0 ? true : 'Please enter a valid account number'
        });

        const customer = customers.find(customer => customer.account.accountNumber === Number(accountNumber));

        if (customer) {
            console.log(chalk.yellow(`\nWelcome, ${customer.firstName} ${customer.lastName}!\n`));
            customer.account.displayTransactions();

            while (true) {
                const { operation } = await inquirer.prompt<{ operation: string }>([{
                    name: 'operation',
                    type: 'list',
                    message: 'Select an operation:',
                    choices: ['Deposit', 'Withdraw', 'Check Balance', 'Exit']
                }]);

                if (operation === 'Exit') {
                    console.log(chalk.blue("Exiting bank program..."));
                    console.log(chalk.blue("\nThank you for using our bank service. Have a great day!"));
                    break;
                }

                switch (operation) {
                    case 'Deposit':
                        const { amount: depositAmount } = await inquirer.prompt<{ amount: string }>({
                            name: 'amount',
                            type: 'input',
                            message: 'Enter the amount to deposit:',
                            validate: value => !isNaN(Number(value)) && Number(value) > 0 ? true : 'Please enter a valid amount'
                        });
                        customer.account.deposit(parseFloat(depositAmount));
                        break;

                    case 'Withdraw':
                        const { amount: withdrawAmount } = await inquirer.prompt<{ amount: string }>({
                            name: 'amount',
                            type: 'input',
                            message: 'Enter the amount to withdraw:',
                            validate: value => !isNaN(Number(value)) && Number(value) > 0 ? true : 'Please enter a valid amount'
                        });
                        customer.account.withdraw(parseFloat(withdrawAmount));
                        break;

                    case 'Check Balance':
                        customer.account.checkBalance();
                        break;
                }
            }
        } else {
            console.log(chalk.red("Invalid account number. Please try again."));
        }
    }
}

service();