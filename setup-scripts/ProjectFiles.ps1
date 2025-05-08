# Project files setup functions for CI/CD setup (ESLint, tests, Docker)

# Function to initialize all project files
function Initialize-ProjectFiles {
  try {
    # Set up ESLint configuration
    Initialize-ESLintConfig
    
    # Set up test files
    Initialize-TestFiles
    
    # Set up Docker files
    Initialize-DockerFiles
  }
  catch {
    Write-ErrorLog "Failed to initialize project files: $($_.Exception.Message)" "Project Files Setup"
  }
}

# Function to set up ESLint configuration
function Initialize-ESLintConfig {
  try {
    Write-Host "Setting up ESLint configuration..." -ForegroundColor Green
        
    $eslintConfig = @'
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn"
    }
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      ".github/",
      "**/__tests__/**"
    ]
  }
];
'@

    Write-FileWithContent -Path "eslint.config.js" -Content $eslintConfig -Description "ESLint configuration"
  }
  catch {
    Write-ErrorLog "Failed to set up ESLint configuration: $($_.Exception.Message)" "ESLint Setup"
  }
}

# Function to set up test files
function Initialize-TestFiles {
  try {
    Write-Host "Setting up test files..." -ForegroundColor Green
        
    $basicTest = @'
test("Sanity check - 2 + 2 equals 4", () => {
  expect(2 + 2).toBe(4);
});
'@

    Write-FileWithContent -Path "Server/__tests__/basic.test.js" -Content $basicTest -Description "Server test file"
    Write-FileWithContent -Path "client/__tests__/basic.test.js" -Content $basicTest -Description "Client test file"
  }
  catch {
    Write-ErrorLog "Failed to set up test files: $($_.Exception.Message)" "Test Setup"
  }
}

# Function to set up Docker files
function Initialize-DockerFiles {
  try {
    Write-Host "Setting up Docker files..." -ForegroundColor Green
        
    $dockerfileContent = @'
FROM node:lts

WORKDIR /app
COPY ./ ./

WORKDIR /app/Server
RUN npm i
ENTRYPOINT [ "node", "server.js" ]


# Start the server
WORKDIR /app/Server
CMD ["node", "server.js"]
'@

    Write-FileWithContent -Path "Dockerfile" -Content $dockerfileContent -Description "Dockerfile"
  }
  catch {
    Write-ErrorLog "Failed to set up Docker files: $($_.Exception.Message)" "Docker Setup"
  }
}




