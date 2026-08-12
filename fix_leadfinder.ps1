$file = "sales.html"
$content = Get-Content $file -Raw

# The broken Lead Finder block - from the comment header to the closing bracket
$oldBlock = @'
            // -------------------------------------------------------
            // Lead Finder Logic
            // -------------------------------------------------------
            const lfScanBtn = document.getElementById('lf-scan-btn');
            const lfCityInput = document.getElementById('lf-city');
            const lfNicheInput = document.getElementById('lf-niche');
            const lfScanningState = document.getElementById('lf-scanning-state');
            const lfScanText = document.getElementById('lf-scan-text');
            const lfResultsGrid = document.getElementById('lf-results-grid');

            if (lfScanBtn) {
                lfScanBtn.addEventListener('click', async () => {
                    const city = lfCityInput.value.trim();
                    const niche = lfNicheInput.value.trim();

                    if (!city || !niche) {
                        alert("Please enter both a City and a Niche.");
                        return;
                    }

                    // Hide grid, show scanning
                    lfResultsGrid.style.display = 'none';
                    lfScanningState.style.display = 'block';
                    lfScanBtn.disabled = true;

                    // Animation sequence
                    const steps = [
                        "Initializing secure connection...",
                        "Bypassing location blocks...",
                        "Fetching Google Maps metadata...",
                        "Parsing customer reviews...",
                        "Filtering leads with poor ratings (< 3.9)...",
                        "Compiling target hitlist..."
                    ];

                    let stepIndex = 0;
                    const animInterval = setInterval(() => {
                        if (stepIndex < steps.length) {
                            lfScanText.innerText = steps[stepIndex];
                            stepIndex++;
                        }
                    }, 400);

                    try {
                        const response = await fetch(/api/scrape?city= + encodeURIComponent(city) + &niche= + encodeURIComponent(niche));
                        const data = await response.json();
                        
                        clearInterval(animInterval);
                        lfScanningState.style.display = 'none';
                        lfScanBtn.disabled = false;

                        if (data.success && data.leads.length > 0) {
                            lfResultsGrid.innerHTML = '';
                            data.leads.forEach(lead => {
                                const card = document.createElement('div');
                                card.className = 'glass-card';
                                card.style.padding = '1.5rem';
                                card.style.position = 'relative';
                                card.style.borderTop = '3px solid #ef4444'; // Red for poor rating
                                
                                card.innerHTML = 
                                    <div style="position: absolute; top: 1rem; right: 1rem; background: rgba(239, 68, 68, 0.2); color: #ef4444; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem;">
                                        <i class="fa-solid fa-star"></i>  + lead.rating + 
                                    </div>
                                    <h3 style="margin-bottom: 0.25rem; padding-right: 3rem;"> + lead.name + </h3>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">
                                        <i class="fa-solid fa-location-dot"></i>  + lead.address + 
                                    </p>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
                                        <i class="fa-solid fa-comment-dots"></i>  + lead.reviews +  Reviews
                                    </p>
                                    <button class="btn btn-primary generate-pitch-btn" style="width: 100%; padding: 0.6rem; font-size: 0.9rem;" data-name=" + lead.name + " data-address=" + lead.address + ">
                                        <i class="fa-solid fa-bolt"></i> Generate Pitch
                                    </button>
                                ;
                                lfResultsGrid.appendChild(card);
                            });
                            
                            lfResultsGrid.style.display = 'grid';

                            // Bind pitch generation
                            document.querySelectorAll('.generate-pitch-btn').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    const bName = e.target.closest('button').getAttribute('data-name');
                                    const bAddress = e.target.closest('button').getAttribute('data-address');
                                    
                                    // Switch to tab 1
                                    document.querySelectorAll('.sales-section-content').forEach(s => s.style.display = 'none');
                                    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
                                    document.getElementById('sec-generator').style.display = 'block';
                                    document.querySelector('.nav-item[data-tab="generator"]').classList.add('active');

                                    // Fill the form
                                    const nameInput = document.getElementById('biz-name');
                                    if(nameInput) {
                                        nameInput.value = bName;
                                    }
                                    
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                });
                            });

                        } else {
                            lfResultsGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No poor-rated leads found in this area. Try a broader search.</p>';
                            lfResultsGrid.style.display = 'grid';
                        }

                    } catch (err) {
                        clearInterval(animInterval);
                        lfScanningState.style.display = 'none';
                        lfScanBtn.disabled = false;
                        lfResultsGrid.innerHTML = '<p style="color: #ef4444; text-align: center; grid-column: 1/-1;">Error connecting to radar grid. Please try again.</p>';
                        lfResultsGrid.style.display = 'grid';
                    }
                });
            }
'@

$newBlock = @'
            // -------------------------------------------------------
            // Lead Finder Logic
            // -------------------------------------------------------
            const lfScanBtn = document.getElementById('lf-scan-btn');
            const lfCityInput = document.getElementById('lf-city');
            const lfNicheInput = document.getElementById('lf-niche');
            const lfScanningState = document.getElementById('lf-scanning-state');
            const lfScanText = document.getElementById('lf-scan-text');
            const lfResultsGrid = document.getElementById('lf-results-grid');

            if (lfScanBtn) {
                lfScanBtn.addEventListener('click', async () => {
                    const city = lfCityInput.value.trim();
                    const niche = lfNicheInput.value.trim();

                    if (!city || !niche) {
                        alert("Please enter both a City and a Niche.");
                        return;
                    }

                    lfResultsGrid.style.display = 'none';
                    lfScanningState.style.display = 'block';
                    lfScanBtn.disabled = true;

                    const steps = [
                        "Initializing secure connection...",
                        "Bypassing location blocks...",
                        "Fetching Google Maps metadata...",
                        "Parsing customer reviews...",
                        "Filtering leads with poor ratings (< 3.9)...",
                        "Compiling target hitlist..."
                    ];

                    let stepIndex = 0;
                    const animInterval = setInterval(() => {
                        if (stepIndex < steps.length) {
                            lfScanText.innerText = steps[stepIndex];
                            stepIndex++;
                        }
                    }, 400);

                    try {
                        const response = await fetch(`/api/scrape?city=${encodeURIComponent(city)}&niche=${encodeURIComponent(niche)}`);
                        const data = await response.json();

                        clearInterval(animInterval);
                        lfScanningState.style.display = 'none';
                        lfScanBtn.disabled = false;

                        if (data.success && data.leads.length > 0) {
                            lfResultsGrid.innerHTML = '';
                            data.leads.forEach(lead => {
                                const card = document.createElement('div');
                                card.className = 'glass-card';
                                card.style.padding = '1.5rem';
                                card.style.position = 'relative';
                                card.style.borderTop = '3px solid #ef4444';

                                card.innerHTML = `<div style="position:absolute;top:1rem;right:1rem;background:rgba(239,68,68,0.2);color:#ef4444;padding:0.2rem 0.5rem;border-radius:4px;font-weight:bold;font-size:0.8rem;"><i class="fa-solid fa-star"></i> ${lead.rating}</div><h3 style="margin-bottom:0.25rem;padding-right:3rem;">${lead.name}</h3><p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:0.5rem;"><i class="fa-solid fa-location-dot"></i> ${lead.address}</p><p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;"><i class="fa-solid fa-comment-dots"></i> ${lead.reviews} Reviews</p><button class="btn btn-primary generate-pitch-btn" style="width:100%;padding:0.6rem;font-size:0.9rem;" data-name="${lead.name}" data-address="${lead.address}"><i class="fa-solid fa-bolt"></i> Generate Pitch</button>`;
                                lfResultsGrid.appendChild(card);
                            });

                            lfResultsGrid.style.display = 'grid';

                            document.querySelectorAll('.generate-pitch-btn').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    const bName = e.target.closest('button').getAttribute('data-name');
                                    const bAddress = e.target.closest('button').getAttribute('data-address');

                                    document.querySelectorAll('.sales-section-content').forEach(s => s.style.display = 'none');
                                    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
                                    document.getElementById('sec-generator').style.display = 'block';
                                    document.querySelector('.nav-item[data-tab="generator"]').classList.add('active');

                                    const nameInput = document.getElementById('biz-name');
                                    if(nameInput) { nameInput.value = bName; }

                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                });
                            });

                        } else {
                            lfResultsGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No poor-rated leads found in this area. Try a broader search.</p>';
                            lfResultsGrid.style.display = 'grid';
                        }

                    } catch (err) {
                        clearInterval(animInterval);
                        lfScanningState.style.display = 'none';
                        lfScanBtn.disabled = false;
                        lfResultsGrid.innerHTML = '<p style="color: #ef4444; text-align: center; grid-column: 1/-1;">Error connecting to radar grid. Please try again.</p>';
                        lfResultsGrid.style.display = 'grid';
                    }
                });
            }
'@

# Normalize line endings for matching
$oldNorm = $oldBlock.Replace("`r`n", "`n")
$contentNorm = $content.Replace("`r`n", "`n")
$newNorm = $newBlock.Replace("`r`n", "`n")

if ($contentNorm.Contains($oldNorm)) {
    $contentNorm = $contentNorm.Replace($oldNorm, $newNorm)
    Set-Content $file $contentNorm -NoNewline -Encoding utf8
    Write-Host "SUCCESS: Lead Finder block replaced with properly quoted JavaScript."
} else {
    Write-Host "ERROR: Could not find the old Lead Finder block. Manual fix required."
}
