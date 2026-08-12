$html = Get-Content sales.html -Raw
$old = "            function showDashboard() {
                loginScreen.style.display = 'none';
                dashboardScreen.style.display = 'flex';
                agentNameDisplay.textContent = currentAgent.name;
                renderEarnings();
                renderPipeline();
            }"

$new = "            function showDashboard() {
                loginScreen.style.display = 'none';
                dashboardScreen.style.display = 'flex';
                agentNameDisplay.textContent = currentAgent.name;
                
                try {
                    renderEarnings();
                } catch (e) {
                    console.error('Failed to render earnings:', e);
                }
                
                try {
                    renderPipeline();
                } catch (e) {
                    console.error('Failed to render pipeline:', e);
                }
            }"

$html = $html.Replace($old.Replace("`r`n", "`n"), $new.Replace("`r`n", "`n"))
Set-Content sales.html $html -Encoding utf8
