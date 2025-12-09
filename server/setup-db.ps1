# PostgreSQL Setup Script for IPL Auction
$PSQL = "C:\Program Files\PostgreSQL\13\bin\psql.exe"

Write-Host "Starting PostgreSQL setup..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Create database
Write-Host "Step 1: Creating database 'ipl_auction'..." -ForegroundColor Yellow
& $PSQL -U postgres -c "CREATE DATABASE ipl_auction;" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "[WARN] Database might already exist (this is OK)" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Run schema
Write-Host "Step 2: Creating database tables..." -ForegroundColor Yellow
& $PSQL -U postgres -d ipl_auction -f "src\schema.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Tables created successfully!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to create tables" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[DONE] PostgreSQL setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure your .env file with PostgreSQL password"
Write-Host "2. Run: npm run seed"
Write-Host "3. Run: npm run dev"
