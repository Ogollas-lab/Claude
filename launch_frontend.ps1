# Helper script to start the frontend irrespective of current subdirectory (basic heuristic)

$env:Path = "C:\Program Files\nodejs;" + $env:Path

if (Test-Path "chakula_connect\frontend") {
    Set-Location chakula_connect\frontend
    npm run dev
}
elseif (Test-Path "frontend") {
    Set-Location frontend
    npm run dev
}
else {
    Write-Host "Could not find frontend directory. Please ensure you are in the 'claude' or 'chakula_connect' folder."
    Get-ChildItem
}
