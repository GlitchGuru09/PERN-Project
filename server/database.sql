psql -U postgres 
CREATE DATABASE astra;

CREATE TABLE transactions (
    tid SERIAL PRIMARY KEY,
    amount NUMERIC(10, 2),
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


ALTER TABLE transactions
ADD COLUMN from_ac_id INT,
ADD COLUMN to_ac_id INT,
ADD COLUMN currency VARCHAR(3);

-- Add foreign key constraints
ALTER TABLE transactions
ADD CONSTRAINT fk_from_account
FOREIGN KEY (from_ac_id) REFERENCES accounts(ac_id);

ALTER TABLE transactions
ADD CONSTRAINT fk_to_account
FOREIGN KEY (to_ac_id) REFERENCES accounts(ac_id);

ALTER TABLE transactions
ALTER COLUMN from_ac_id SET NOT NULL,
ALTER COLUMN to_ac_id SET NOT NULL,
ALTER COLUMN currency SET NOT NULL;

ALTER TABLE transactions
ADD CONSTRAINT chk_currency_length CHECK (char_length(currency) = 3);

CREATE TABLE ledger (
    ledger_id SERIAL PRIMARY KEY,
    tid INT NOT NULL,
    ac_id INT NOT NULL,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('debit', 'credit')),
    amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_txn
        FOREIGN KEY (tid) REFERENCES transactions(tid)
        ON DELETE CASCADE,

    CONSTRAINT fk_account
        FOREIGN KEY (ac_id) REFERENCES accounts(ac_id)
        ON DELETE CASCADE
);