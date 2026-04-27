psql -U postgres 
CREATE DATABASE astra;

CREATE TABLE transactions (
    tid SERIAL PRIMARY KEY,
    amount NUMERIC(10, 2),
    transaction_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    description VARCHAR(255),
    ac_id INT;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    ac_id SERIAL PRIMARY KEY,
    account_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_type VARCHAR(50),         -- Company or Indiviual
    balance NUMERIC(12, 2) DEFAULT 0,
    holder_name SET NOT NULL;
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions
ADD COLUMN ac_id INT,
ADD CONSTRAINT fk_transactions_account
FOREIGN KEY (ac_id)
REFERENCES accounts(ac_id)
ON DELETE CASCADE;