# create non-admin user and run tests

# fail if not on windows
if ($env:OS -ne "Windows") { exit 1 }

# make temp folder writable for all users
icacls $env:TEMP /grant "Everyone:(OI)(CI)F" /T
# icacls "C:\Users" /grant "Everyone:(OI)(CI)F" /T

$username = "nonadminuser"
# random password fulfilling win requirements
$password = ConvertTo-SecureString "abcdEFGH123$%" -AsPlainText -Force

$newHomeDir = "C:\Users\$username"
$env:HOME = $newHomeDir

# create non-admin user
New-LocalUser $username -Password $password -PasswordNeverExpires:$true
Add-LocalGroupMember -Group "Users" -Member $username
$credential = New-Object System.Management.Automation.PSCredential ($username, $password)

# Optionally, create the new home directory and set permissions
New-Item -ItemType Directory -Path $newHomeDir
icacls $newHomeDir /grant "${username}:(OI)(CI)F" /T

# Get the SID of the target user
$sid = (Get-WmiObject -Class Win32_UserAccount -Filter "Name='$username'").SID

# Set the USERPROFILE environment variable for the target user
Set-ItemProperty -Path "HKU:\$sid\Environment" -Name "USERPROFILE" -Value $newHomeDir

# Set the home directory using net user
# net user $username /homedir:$newHomeDir

# remove dev mode so symlink fails if called without junction
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /f

# call command using non admin user
$process = Start-Process -FilePath "pwsh" `
    -ArgumentList "-NoLogo", "-NonInteractive", "-NoProfile", "-Command", $env:RUN `
    -Credential $credential `
    -PassThru `
    -Wait `
    -NoNewWindow `
    -RedirectStandardOutput "output.txt" `
    -RedirectStandardError "error.txt" `

Get-Content output.txt
Get-Content error.txt

if ($process.ExitCode -ne 0) { exit $process.ExitCode }
