const DotenvLinter = require('../index');
const fs = require('fs');
const os = require('os');
const path = require('path');

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
});