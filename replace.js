const fs = require('fs');
const path = 'c:/Users/sunny/.gemini/antigravity/scratch/MetrixMedia/sales.html';

let html = fs.readFileSync(path, 'utf8');

// Replace Two-Call Script
const oldTwoCall = `<!-- Panel 3: Two-Call Script -->
                    <div class="sales-kit-panel" id="kit-panel-two-call-script">
                        <div class="glass-card" style="text-align: center; padding: 4rem 2rem;">
                            <i class="fa-solid fa-phone-volume text-primary" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.8;"></i>
                            <h3 style="color: white; margin-bottom: 0.5rem;">Two-Call Master Script</h3>
                            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto;">
                                Professional B2B script for closing high-ticket deals. Includes Discovery and Closing call frameworks. (Module Unlocks Soon)
                            </p>
                        </div>
                    </div>`;

const newTwoCall = `<!-- Panel 3: Two-Call Script -->
                    <div class="sales-kit-panel" id="kit-panel-two-call-script">
                        <div class="grid-layout" style="grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div class="glass-card" style="padding: 2rem;">
                                <i class="fa-solid fa-globe text-primary" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                                <h3 style="color: white;">English Version</h3>
                                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">The official Two-Call framework (Discovery & Closing) for English-speaking clients.</p>
                                <a href="sales-playbooks/sales_script_pdf_ready.html" target="_blank" class="btn btn-primary" style="width: 100%; text-decoration: none;">
                                    <i class="fa-solid fa-up-right-from-square"></i> Open Script (PDF Ready)
                                </a>
                            </div>
                            <div class="glass-card" style="padding: 2rem;">
                                <i class="fa-solid fa-language text-fuchsia" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                                <h3 style="color: white;">Hinglish Version</h3>
                                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">The official Two-Call framework adapted for Hindi/English conversational flow.</p>
                                <a href="sales-playbooks/sales_script_hinglish_pdf_ready.html" target="_blank" class="btn btn-primary" style="width: 100%; text-decoration: none;">
                                    <i class="fa-solid fa-up-right-from-square"></i> Open Script (PDF Ready)
                                </a>
                            </div>
                        </div>
                    </div>`;

html = html.replace(oldTwoCall, newTwoCall);

// Replace One-Call Script
const oldOneCall = `<!-- Panel 4: One-Call Live-Drop -->
                    <div class="sales-kit-panel" id="kit-panel-one-call-script">
                        <div class="glass-card" style="text-align: center; padding: 4rem 2rem;">
                            <i class="fa-solid fa-bolt text-primary" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.8;"></i>
                            <h3 style="color: white; margin-bottom: 0.5rem;">Live-Drop Script</h3>
                            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto;">
                                The ultimate one-call close framework using live physical demonstrations. (Module Unlocks Soon)
                            </p>
                        </div>
                    </div>`;

const newOneCall = `<!-- Panel 4: One-Call Live-Drop -->
                    <div class="sales-kit-panel" id="kit-panel-one-call-script">
                        <div class="grid-layout" style="grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div class="glass-card" style="padding: 2rem;">
                                <i class="fa-solid fa-bolt text-primary" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                                <h3 style="color: white;">English Version</h3>
                                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">The aggressive One-Call Live-Drop framework for walking into venues and closing instantly.</p>
                                <a href="sales-playbooks/live_drop_script_pdf_ready.html" target="_blank" class="btn btn-primary" style="width: 100%; text-decoration: none;">
                                    <i class="fa-solid fa-up-right-from-square"></i> Open Script (PDF Ready)
                                </a>
                            </div>
                            <div class="glass-card" style="padding: 2rem;">
                                <i class="fa-solid fa-language text-fuchsia" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                                <h3 style="color: white;">Hinglish Version</h3>
                                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">The aggressive One-Call Live-Drop framework adapted for Hindi/English flow.</p>
                                <a href="sales-playbooks/live_drop_script_hinglish_pdf_ready.html" target="_blank" class="btn btn-primary" style="width: 100%; text-decoration: none;">
                                    <i class="fa-solid fa-up-right-from-square"></i> Open Script (PDF Ready)
                                </a>
                            </div>
                        </div>
                    </div>`;

html = html.replace(oldOneCall, newOneCall);

// Replace Links & Earnings
const oldTabs = `<!-- Section 5: Links & Affiliate -->
                <section id="sec-links" class="sales-section-content" style="display: none;">
                    <h2 class="gradient-text" style="margin-bottom: 1.5rem;">Agency Links & Resources</h2>
                    <div class="glass-card" style="text-align: center; padding: 4rem 2rem;">
                        <p style="color: var(--text-muted);">Links module coming soon...</p>
                    </div>
                </section>

                <!-- Section 6: My Earnings -->
                <section id="sec-earnings" class="sales-section-content" style="display: none;">
                    <h2 class="gradient-text" style="margin-bottom: 1.5rem;">Earnings & Pipeline</h2>
                    <div class="glass-card" style="text-align: center; padding: 4rem 2rem;">
                        <p style="color: var(--text-muted);">Earnings module coming soon...</p>
                    </div>
                </section>`;

const newTabs = `<!-- Section 5: Links & Affiliate -->
                <section id="sec-links" class="sales-section-content" style="display: none;">
                    <h2 class="gradient-text" style="margin-bottom: 1.5rem;">Agency Links & Resources</h2>
                    <div class="grid-layout" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                        <a href="https://t.me/yourtelegrambot" target="_blank" class="glass-card" style="padding: 2rem; text-decoration: none; text-align: center; transition: all 0.3s ease;">
                            <i class="fa-brands fa-telegram text-primary" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h3 style="color: white; margin-bottom: 0.5rem;">Telegram Bot</h3>
                            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">Access the automated Lead Generation engine from your phone.</p>
                        </a>
                        <a href="#" class="glass-card" style="padding: 2rem; text-decoration: none; text-align: center; transition: all 0.3s ease;">
                            <i class="fa-brands fa-whatsapp text-emerald" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h3 style="color: white; margin-bottom: 0.5rem;">Ops Team Support</h3>
                            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">Need help with a live deal? Message operations instantly.</p>
                        </a>
                        <a href="pricing.html" target="_blank" class="glass-card" style="padding: 2rem; text-decoration: none; text-align: center; transition: all 0.3s ease;">
                            <i class="fa-solid fa-file-invoice-dollar text-fuchsia" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h3 style="color: white; margin-bottom: 0.5rem;">Client Pricing Page</h3>
                            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">Send this live page to clients to view our plans.</p>
                        </a>
                    </div>
                </section>

                <!-- Section 6: My Earnings -->
                <section id="sec-earnings" class="sales-section-content" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h2 class="gradient-text">Earnings & Pipeline</h2>
                        <span style="background: rgba(168,85,247,0.2); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; border: 1px solid var(--accent-purple); color: white;">Sales Cycle: Q3 2026</span>
                    </div>

                    <!-- KPI Cards -->
                    <div class="grid-layout" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                        <div class="glass-card" style="padding: 1.5rem; border-left: 4px solid var(--accent-green);">
                            <p style="color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem;">Total Earned (YTD)</p>
                            <h2 style="color: white; font-size: 2.5rem; margin: 0;">₹42,500</h2>
                        </div>
                        <div class="glass-card" style="padding: 1.5rem; border-left: 4px solid var(--primary-light);">
                            <p style="color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem;">Active Pipeline</p>
                            <h2 style="color: white; font-size: 2.5rem; margin: 0;">12 Leads</h2>
                        </div>
                        <div class="glass-card" style="padding: 1.5rem; border-left: 4px solid var(--accent-purple);">
                            <p style="color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem;">Pending Payout</p>
                            <h2 style="color: white; font-size: 2.5rem; margin: 0;">₹8,000</h2>
                        </div>
                    </div>

                    <!-- Recent Deals Table -->
                    <div class="glass-card" style="padding: 2rem;">
                        <h3 style="color: white; margin-bottom: 1.5rem;">Recent Closed Deals</h3>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left; color: white;">
                                <thead>
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-muted);">
                                        <th style="padding: 1rem;">Client Name</th>
                                        <th style="padding: 1rem;">Package</th>
                                        <th style="padding: 1rem;">Status</th>
                                        <th style="padding: 1rem;">Commission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                        <td style="padding: 1rem;">The Roasted Bean Cafe</td>
                                        <td style="padding: 1rem;">Aegis Core (Annual)</td>
                                        <td style="padding: 1rem;"><span style="color: var(--accent-green); background: rgba(16,185,129,0.1); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem;">Paid out</span></td>
                                        <td style="padding: 1rem;">₹4,000</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                        <td style="padding: 1rem;">Mumbai Dentists Hub</td>
                                        <td style="padding: 1rem;">Growth Suite</td>
                                        <td style="padding: 1rem;"><span style="color: var(--accent-purple); background: rgba(168,85,247,0.1); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem;">Pending</span></td>
                                        <td style="padding: 1rem;">₹8,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>`;

html = html.replace(oldTabs, newTabs);

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully injected UI with exact matches.');
