const fs = require('fs');
const dotenv = require('dotenv');

class DotenvLinter {
  constructor(options = {}) {
    this.options = {
      checkEmptyValues: options.checkEmptyValues || false,
    };
  }

  lint(envFilePath = '.env', exampleFilePath = '.env.example') {
    const envContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf-8') : '';
    const exampleContent = fs.existsSync(exampleFilePath) ? fs.readFileSync(exampleFilePath, 'utf-8') : '';

    const envConfig = dotenv.parse(envContent);
    const exampleConfig = dotenv.parse(exampleContent);

    const results = {
      missingVariables: [],
      extraVariables: [],
      duplicateKeys: [],
      emptyValues: []
    };

    // Detect missing variables
    for (const key of Object.keys(exampleConfig)) {
      if (!(key in envConfig)) {
        results.missingVariables.push(key);
      }
    }

    // Detect extra variables
    for (const key of Object.keys(envConfig)) {
      if (!(key in exampleConfig)) {
        results.extraVariables.push(key);
      }
    }

    // Detect duplicate keys
    const lines = envContent.split('\n');
    const seenKeys = new Set();
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const key = trimmed.split('=')[0].trim();
        if (seenKeys.has(key)) {
          results.duplicateKeys.push({ key, line: index + 1 });
        } else {
          seenKeys.add(key);
        }
      }
    });

    // Check for empty values (optional)
    if (this.options.checkEmptyValues) {
      for (const [key, value] of Object.entries(envConfig)) {
        if (value === '') {
          results.emptyValues.push(key);
        }
      }
    }

    return results;
  }

  createExampleFile(envFilePath = '.env', exampleFilePath = '.env.example') {
    if (!fs.existsSync(envFilePath)) {
      throw new Error(`.env file not found at ${envFilePath}`);
    }

    const envContent = fs.readFileSync(envFilePath, 'utf-8');
    const envConfig = dotenv.parse(envContent);
    let exampleContent = Object.keys(envConfig)
      .map(key => `${key}=`)
      .join('\n');

    fs.writeFileSync(exampleFilePath, exampleContent + '\n');
    return `Created .env.example at ${exampleFilePath}`;
  }
}

module.exports = DotenvLinter;