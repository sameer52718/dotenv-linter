@sameer52718/dotenv-linter
Note: Replace with your project logo or screenshot URL.
A linter for .env files to ensure consistency with .env.example.
Features

✅ Detect missing variables compared to .env.example
✅ Warn about extra variables in .env not listed in .env.example
✅ Flag duplicate keys
✅ Optional: Check for empty values
✅ CLI + Node API
✅ Create .env.example from .env file

Installation
npm install @sameer52718/dotenv-linter

Usage
CLI
npx @sameer52718/dotenv-linter --env .env --example .env.example --check-empty

Options:

--env, -e: Path to .env file (default: .env)
--example, -x: Path to .env.example file (default: .env.example)
--check-empty: Check for empty values in .env file
--create-example: Create .env.example from .env file

To create a .env.example file:
npx @sameer52718/dotenv-linter --create-example

Node API
const DotenvLinter = require('@sameer52718/dotenv-linter');

const linter = new DotenvLinter({ checkEmptyValues: true });
const results = linter.lint('.env', '.env.example');

console.log(results);

// Create .env.example
linter.createExampleFile('.env', '.env.example');

Example
Given:
# .env
API_KEY=12345
DATABASE_URL=
EXTRA_VAR=hello

Running:
npx @sameer52718/dotenv-linter --create-example

Output:
Created .env.example at .env.example

Content of .env.example:
API_KEY=
DATABASE_URL=
EXTRA_VAR=

License
MIT
Website
Project Homepage
Contributing
Contributions are welcome! Please open an issue or submit a pull request.