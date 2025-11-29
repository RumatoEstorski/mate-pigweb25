// ==========================================
// MATE-PIGWEB25 LOGIC ENGINE (v4.0)
// ==========================================

// Config Constants
const SPECIES_FACTOR = { rodent:1.0, pig:1.2, primate:1.8, dog:1.6, fish:0.8 };
const PROTECTED_SPECIES = ["primate", "dog"];
const SEVERITY_MUL = { non:2.0, mild:1.0, moderate:1.5, severe:2.5 };

// Preset Scenarios
const PRESETS = {
    xeno: { goal:10, species:"pig", numbers:1.3, severityClass:"severe", suffering:9, necessity:5, threers:70 },
    amr: { goal:10, species:"pig", numbers:1.0, severityClass:"moderate", suffering:7, necessity:5, threers:80 },
    pain: { goal:7, species:"rodent", numbers:0.8, severityClass:"moderate", suffering:6, necessity:4, threers:85 },
    neuro: { goal:10, species:"primate", numbers:1.0, severityClass:"severe", suffering:8, necessity:5, threers:65 },
    cosmetics: { goal:1, species:"rodent", numbers:1.0, severityClass:"mild", suffering:4, necessity:2, reachJustified:"yes" }
};

// 1. Helper to gather all inputs
function getInputs() {
    return {
        title: document.getElementById('projectTitle').value.trim(),
        goal: parseInt(document.getElementById('goal').value),
        species: document.getElementById('species').value,
        numbers: parseFloat(document.getElementById('numbers').value),
        severityClass: document.getElementById('severityClass').value,
        cumulative: document.getElementById('cumulativeSeverity').value,
        alternatives: document.getElementById('alternatives').value,
        suffering: parseInt(document.getElementById('suffering').value) || 5,
        success: parseInt(document.getElementById('success_rate').value),
        necessity: parseInt(document.getElementById('necessity').value),
        threers: parseInt(document.getElementById('threers').value),
        uncertainty: parseInt(document.getElementById('uncertainty').value),
        humane: document.getElementById('humaneEndpoints').checked,
        reach: document.getElementById('reachJustified').value || "no"
    };
}

// 2. UI Updates
function toggleCosmetics() {
    const goal = document.getElementById('goal').value;
    const cosmeticsBox = document.getElementById('cosmeticsBox');
    cosmeticsBox.style.display = (goal === "1") ? "block" : "none";
}

function updateSliderLabels() {
    ['success_rate','threers','uncertainty'].forEach(id => {
        const val = document.getElementById(id).value;
        const label = document.getElementById(id === 'success_rate' ? 'successVal' : id + 'Val');
        if(label) label.textContent = val + '%';
    });
}

function loadPreset(name) {
    const p = PRESETS[name];
    if (!p) return;
    
    // Auto-fill fields
    if(p.goal) document.getElementById('goal').value = p.goal;
    if(p.species) document.getElementById('species').value = p.species;
    if(p.numbers) document.getElementById('numbers').value = p.numbers;
    if(p.severityClass) document.getElementById('severityClass').value = p.severityClass;
    if(p.suffering) document.getElementById('suffering').value = p.suffering;
    if(p.necessity) document.getElementById('necessity').value = p.necessity;
    if(p.threers) document.getElementById('threers').value = p.threers;
    if(p.reachJustified) document.getElementById('reachJustified').value = p.reachJustified;
    
    toggleCosmetics();
    updateSliderLabels();
}

// 3. Main Calculation Logic
function calculateVerdict() {
    const i = getInputs();

    // Validations
    if (!i.humane) {
        alert("⚠️ You must confirm 'Humane Endpoints' to proceed.");
        return;
    }
    
    if (i.goal === 1 && i.reach === "no") {
        showResult("Denied", "Cosmetic animal testing is strictly banned in the EU (Regulation 1223/2009 Art. 18).", "denied", "🚫");
        return;
    }

    if (i.alternatives === "yes") {
        showResult("Denied", "Full replacement exists. Animal use not permitted (Directive 2010/63/EU Art. 4).", "denied", "🚫");
        return;
    }

    if (i.severityClass === "moderate" && i.cumulative === "moderate") {
        showResult("Illegal", "Cumulative suffering would exceed legal limits (Art. 15).", "denied", "⚖️");
        return;
    }

    // Harm-Benefit Analysis (Math)
    const harmAdj = i.alternatives === "partial" ? i.suffering * 0.8 : i.suffering;
    
    // Benefit Formula
    const EV_Benefit = i.goal * (i.success/100) * (i.necessity/5) * (i.threers/100) * (1 - i.uncertainty/300);
    
    // Harm Formula
    const EV_Harm = Math.log(1 + harmAdj * SEVERITY_MUL[i.severityClass]) * i.numbers * SPECIES_FACTOR[i.species];

    let verdict = "", msg = "", type = "", icon = "";
    
    if (EV_Benefit > EV_Harm * 1.4) { 
        verdict = "Likely Approved"; type = "approved"; icon = "✅"; 
    } else if (EV_Benefit > EV_Harm * 0.9) { 
        verdict = "Borderline – Review"; type = "borderline"; icon = "⚠️"; 
    } else { 
        verdict = "Denied"; type = "denied"; icon = "❌"; 
    }

    msg = `<strong>${verdict}</strong><br>Benefit Score: ${EV_Benefit.toFixed(2)} | Harm Score: ${EV_Harm.toFixed(2)}<br>`;
    
    if (PROTECTED_SPECIES.includes(i.species)) msg += "<br><em>Note: Special protection applies (Art. 8 & 55).</em>";
    if (i.severityClass === "severe" || i.species === "primate") msg += "<br><em>Note: Retrospective assessment required.</em>";

    showResult(verdict, msg, type, icon);
}

function showResult(title, text, type, icon) {
    const r = document.getElementById('result');
    r.style.display = "block";
    r.className = `result-box ${type}`;
    r.innerHTML = `<h2>${icon} ${title}</h2><div>${text}</div>`;
}

// 4. Generate NTS
function generateNTS() {
    const i = getInputs();
    const nts = `NON-TECHNICAL SUMMARY (Art. 41)\n\nTitle: ${i.title || "Untitled"}\nGoal: ${document.getElementById('goal').selectedOptions[0].text}\nSpecies: ${i.species}\nSeverity: ${i.severityClass}\n3Rs Compliance: ${i.threers}%`;
    const output = document.getElementById('ntsOutput');
    output.textContent = nts;
    output.style.display = "block";
}

// 5. PDF Export
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("MATE-PIGWEB25 Verdict", 20, 20);
    doc.setFontSize(12); doc.text(document.getElementById('result').innerText || "No verdict yet", 20, 40);
    doc.text(document.getElementById('ntsOutput').innerText || "", 20, 100);
    doc.save("ethics-verdict.pdf");
}

// 6. NCBI API (Updated with Robust Proxy)
async function fetchGene() {
    const geneInput = document.getElementById('geneSearch').value.trim();
    if (!geneInput) return;

    const resultDiv = document.getElementById('ncbiResult');
    resultDiv.innerHTML = "⏳ Searching NCBI Pig Database...";
    resultDiv.style.color = "#0c4a6e"; 

    try {
        // We use corsproxy.io because it is faster and more reliable than allorigins
        const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
        const searchParams = `db=gene&term=${geneInput}[sym]+AND+sus+scrofa[orgn]&retmode=json`;
        
        // Construct URL
        const targetUrl = `${baseUrl}/esearch.fcgi?${searchParams}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

        // STEP 1: Search for ID
        const searchRes = await fetch(proxyUrl);
        if (!searchRes.ok) throw new Error("Network response was not ok");
        
        const searchJson = await searchRes.json(); // Direct JSON (no .contents parsing needed for this proxy)

        if (!searchJson.esearchresult || !searchJson.esearchresult.idlist || searchJson.esearchresult.idlist.length === 0) {
            throw new Error(`Gene '${geneInput}' not found in Pig (Sus scrofa) database.`);
        }

        const geneId = searchJson.esearchresult.idlist[0];

        // STEP 2: Get Summary
        const summaryTarget = `${baseUrl}/esummary.fcgi?db=gene&id=${geneId}&retmode=json`;
        const summaryProxy = `https://corsproxy.io/?${encodeURIComponent(summaryTarget)}`;
        
        const summaryRes = await fetch(summaryProxy);
        const summaryJson = await summaryRes.json();

        // Check if result exists
        if (!summaryJson.result || !summaryJson.result[geneId]) {
            throw new Error("Details not found for this gene.");
        }

        const info = summaryJson.result[geneId];

        // STEP 3: Display
        resultDiv.innerHTML = `
            <div style="text-align: left; line-height: 1.6;">
                <strong style="color: var(--primary); font-size: 16px;">${info.name}</strong> 
                <span style="color: #666;">(ID: ${geneId})</span><br>
                <strong>Description:</strong> ${info.description}<br>
                <strong>Organism:</strong>  ${info.organism.scientificname}<br>
                <strong>Location:</strong> Chromosome ${info.chromosome || '?'}, Map: ${info.maplocation || 'N/A'}<br>
                <div style="margin-top:5px; font-size:12px; color:#555;">${info.summary ? info.summary : "No detailed summary available."}</div>
            </div>
        `;

    } catch (e) {
        console.error(e);
        resultDiv.innerHTML = `❌ <strong>Error:</strong> ${e.message}. <br><small>Check your internet connection or try disabling ad-blockers.</small>`;
        resultDiv.style.color = "var(--danger)";
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    ['success_rate','threers','uncertainty'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateSliderLabels);
    });
    toggleCosmetics();
    updateSliderLabels();
});