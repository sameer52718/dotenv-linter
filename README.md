@sameer52718/dotenv-linter
   A linter for .env files to ensure consistency with .env.example.
Features

✅ Detect missing variables compared to .env.example
✅ Warn about extra variables in .env not listed in .env.example
✅ Flag duplicate keys
✅ Optional: Check for empty values
✅ CLI + Node API

Installation
npm install @sameer52718/dotenv-linter

Usage
CLI
npx @sameer52718/dotenv-linter --env .env --example .env.example --check-empty

   Options:

--env, -e: Path to .env file (default: .env)
--example, -x: Path to .env.example file (default: .env.example)
--check-empty: Check for empty values in .env file

Node API
const DotenvLinter = require('@sameer52718/dotenv-linter');

const linter = new DotenvLinter({ checkEmptyValues: true });
const results = linter.lint('.env', '.env.example');

console.log(results);

Example
   Given:
# .env
API_KEY=12345
DATABASE_URL=
EXTRA_VAR=hello

# .env.example
API_KEY=
DATABASE_URL=

   Running:
npx @sameer52718/dotenv-linter --check-empty

   Output:
Missing variables:
- None

Extra variables:
- EXTRA_VAR

Duplicate keys:
- None

Empty values:
- DATABASE_URL

License
   MIT