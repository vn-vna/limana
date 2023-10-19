$env:PYTHONPATH=$env:PYTHONPATH + "$PSScriptRoot\backend"
python $PSScriptRoot\backend\main.py --config $PSScriptRoot\backend\config\config-default.yaml