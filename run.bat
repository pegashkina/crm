start "" "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"
ping 127.0.0.1 -n 6 > nul
start "" "%HOMEPATH%\Documents\GitHub\crm\run_frontend.bat"
start "" "%HOMEPATH%\Documents\GitHub\crm\run_backend.bat"