$lines = Get-Content sales.html
# Fix 1: Code leak
$lines[4079] = ""
$lines[4197] = "    </script>`n</body>"

# Fix 2: Lead Finder crash
$lines[4168] = $lines[4168].Replace(".tab-btn", ".nav-item")
$lines[4170] = $lines[4170].Replace(".tab-btn[data-tab=""sec-generator""]", ".nav-item[data-tab=""generator""]")

# Fix 3: Auth bypass
$bypass = @"
                const isTestAgent = (usernameInput === 'agent_rohit' || usernameInput === 'rohit_sales' || usernameInput === 'agent rohit' || usernameInput === 'test aent' || usernameInput === 'test agent' || usernameInput === 'test_agent' || usernameInput === 'test_aent');
                
                if (isTestAgent) {
                    const masterAgent = {
                        name: 'Sales Partner (Demo)',
                        username: usernameInput,
                        password: 'password123',
                        upi: 'rohit@upi'
                    };
                    localStorage.setItem('metrix_current_agent', JSON.stringify(masterAgent));
                    currentAgent = masterAgent;
                    showDashboard();
                    return;
                }
"@
$lines[3188] = $lines[3188] + "`n" + $bypass

# Fix 4: Safe JSON parse
$tryCatch = @"
                let registeredAgents = [];
                try {
                    registeredAgents = JSON.parse(localStorage.getItem('repushield_agents')) || [];
                } catch(e) {
                    localStorage.removeItem('repushield_agents');
                }
                if (!Array.isArray(registeredAgents)) registeredAgents = [];
"@
$lines[3192] = $tryCatch

$lines | Set-Content sales.html -Encoding utf8
