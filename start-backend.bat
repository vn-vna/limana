@echo off
rem Description: Starts the backend server
set PYTHONPATH=%PYTHONPATH%;%~dp0\backend
python %~dp0\backend\main.py --config %~dp0\backend\config\config-default.yaml