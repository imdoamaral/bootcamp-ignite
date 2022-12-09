const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement [] // extrato
 */

const customers = [];

// Middleware
function verifyIfAccountCpfExists(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({ message: 'Customer not found' });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}

app.post('/account', (request, response) => {
    const { cpf, name } = request.body;
    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);

    if(customerAlreadyExists) {
        return response.status(400).json({ error: 'Customer already exists!' });
    }

    customers.push({
        cpf,
        name,
        id : uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

app.get('/statement', verifyIfAccountCpfExists, (request, response) => {
    const { customer } = request;
    
    return response.json(customer.statement);
});

app.post('/deposit', verifyIfAccountCpfExists, (request, response) => {
    const { description, amount } = request.body;
    const { customer } = request;

    const operation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    }

    customer.statement.push(operation);

    return response.status(201).send();
});

app.post('/withdraw', verifyIfAccountCpfExists, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if(balance < amount) {
        return response.status(400).json({ error: "Insufficient funds!" });
    }

    const withdraw = {
        amount,
        created_at: new Date(),
        type: 'debit'
    }

    customer.statement.push(withdraw);

    return response.status(201).send();
});

app.get('/statement/date', verifyIfAccountCpfExists, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter(
        (statement) => {
            statement.created_at.toDateString() === 
            new Date(dateFormat).toDateString();

            console.log(statement.created_at.toDateString());
            console.log(new Date(dateFormat).toDateString());
        }
    );
    
    return response.json(statement);
});

app.put('/account', verifyIfAccountCpfExists, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).send();
});

app.get('/account', verifyIfAccountCpfExists, (request, response) => {
    const { customer } = request;

    return response.json(customer);
});

app.delete('/account', verifyIfAccountCpfExists, (request, response) => {
    const { customer } = request;

    customers.splice(customer, 1);

    return response.status(200).json(customers);
});

app.get('/balance', verifyIfAccountCpfExists, (request, response) => {
    const { customer } = request;

    const balance = getBalance(customer.statement);

    return response.json(balance);
})

app.listen(3333);