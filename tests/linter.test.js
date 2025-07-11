const DotenvLinter = require('../index');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Normalize line endings for cross-platform compatibility
const normalizeLineEndings = (str) => str.replace(/\r\n/g, '\n');

describe('DotenvLinter', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dotenv-linter-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('detects missing variables', () => {
    fs.writeFileSync(path.join(tempDir, '.env'), 'API_KEY=12345\n');
    fs.writeFileSync(path.join(tempDir, '.env.example'), 'API_KEY=\nDATABASE_URL=\n');

    const linter = new DotenvLinter();
    const results = linter.lint(path.join(tempDir, '.env'), path.join(tempDir, '.env.example'));

    expect(results.missingVariables).toEqual(['DATABASE_URL']);
    expect(results.extraVariables).toEqual([]);
    expect(results.duplicateKeys).toEqual([]);
    expect(results.emptyValues).toEqual([]);
  });

  test('detects extra variables', () => {
    fs.writeFileSync(path.join(tempDir, '.env'), 'API_KEY=12345\nEXTRA_VAR=hello\n');
    fs.writeFileSync(path.join(tempDir, '.env.example'), 'API_KEY=\n');

    const linter = new DotenvLinter();
    const results = linter.lint(path.join(tempDir, '.env'), path.join(tempDir, '.env.example'));

    expect(results.missingVariables).toEqual([]);
    expect(results.extraVariables).toEqual(['EXTRA_VAR']);
    expect(results.duplicateKeys).toEqual([]);
    expect(results.emptyValues).toEqual([]);
  });

  test('detects duplicate keys', () => {
    fs.writeFileSync(path.join(tempDir, '.env'), 'API_KEY=12345\nAPI_KEY=67890\n');
    fs.writeFileSync(path.join(tempDir, '.env.example'), 'API_KEY=\n');

    const linter = new DotenvLinter();
    const results = linter.lint(path.join(tempDir, '.env'), path.join(tempDir, '.env.example'));

    expect(results.missingVariables).toEqual([]);
    expect(results.extraVariables).toEqual([]);
    expect(results.duplicateKeys).toEqual([{ key: 'API_KEY', line: 2 }]);
    expect(results.emptyValues).toEqual([]);
  });

  test('detects empty values when enabled', () => {
    fs.writeFileSync(path.join(tempDir, '.env'), 'API_KEY=\nDATABASE_URL=12345\n');
    fs.writeFileSync(path.join(tempDir, '.env.example'), 'API_KEY=\nDATABASE_URL=\n');

    const linter = new DotenvLinter({ checkEmptyValues: true });
    const results = linter.lint(path.join(tempDir, '.env'), path.join(tempDir, '.env.example'));

    expect(results.missingVariables).toEqual([]);
    expect(results.extraVariables).toEqual([]);
    expect(results.duplicateKeys).toEqual([]);
    expect(results.emptyValues).toEqual(['API_KEY']);
  });

  test('creates .env.example from .env', () => {
    const envPath = path.join(tempDir, '.env');
    const examplePath = path.join(tempDir, '.env.example');
    fs.writeFileSync(envPath, 'API_KEY=12345\nDATABASE_URL=\nEXTRA_VAR=hello\n');

    const linter = new DotenvLinter();
    const result = linter.createExampleFile(envPath, examplePath);

    expect(result).toBe(`Created .env.example at ${examplePath}`);
    const exampleContent = normalizeLineEndings(fs.readFileSync(examplePath, 'utf-8'));
    expect(exampleContent).toBe('API_KEY=\nDATABASE_URL=\nEXTRA_VAR=\n');
  });
});