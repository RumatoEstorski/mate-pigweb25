// ==========================================
// SECTION 1: ETHICAL CALCULATOR LOGIC
// ==========================================

function calculateVerdict() {
    // 1. Get input values
    const benefitScore = parseInt(document.getElementById('goal').value);
    const species = document.getElementById('species').value;
    const numberMultiplier = parseFloat(document.getElementById('numbers').value); // 0.8 to 1.5
    const hasAlternatives = document.getElementById('alternatives').value;
    const sufferingScore = parseInt(document.getElementById('suffering').value);
    const successMultiplier = parseFloat(document.getElementById('success_rate').value);

    // Check 1: Replacement (3Rs)
    if (hasAlternatives === "yes") {
        displayResult("❌ Proposal Denied", "Strict Violation of the 3Rs (Replacement). Non-animal alternatives exist.", "denied", "🚫");
        return;
    }

    // Check 2: Regulatory Bans
    if (benefitScore === 1) {
        displayResult("❌ Proposal Denied", "Regulatory Ban Active. Non-essential/Cosmetic testing is prohibited.", "denied", "⚖️");
        return;
    }

    // Check 3: Harm-Benefit Analysis (Advanced Math)
    
    // Benefit = Goal * Likelihood of Success
    const adjustedBenefit = benefitScore * successMultiplier;
    
    // Harm = Severity * Number of Animals Multiplier
    // If you use >500 animals (multiplier 1.5), the Harm Score goes WAY up.
    const adjustedHarm = sufferingScore * numberMultiplier;
    
    if (adjustedBenefit >= adjustedHarm) {
        displayResult(
            "✅ Authorization Likely", 
            `Positive Assessment. The Benefit (Score: ${adjustedBenefit.toFixed(1)}) outweighs the Harm calculated for ${species} (Score: ${adjustedHarm.toFixed(1)}).`, 
            "approved", 
            "🛡️"
        );
    } else {
        displayResult(
            "⚠️ Authorization Denied", 
            `Negative Assessment. The cumulative Harm to ${species} (Score: ${adjustedHarm.toFixed(1)}) is too high for the projected Benefit (Score: ${adjustedBenefit.toFixed(1)}). Consider reducing animal numbers.`, 
            "denied", 
            "📉"
        );
    }
}

function displayResult(title, text, type, icon) {
    const resultBox = document.getElementById('result');
    const verdictTitle = document.getElementById('verdictTitle');
    const verdictText = document.getElementById('verdictText');
    const statusIcon = document.getElementById('statusIcon');

    resultBox.style.display = 'none';
    resultBox.offsetHeight; 
    resultBox.style.display = 'block';

    resultBox.className = type; 
    verdictTitle.innerText = title;
    verdictText.innerText = text;
    statusIcon.innerText = icon;
}

// ==========================================
// SECTION 2: PROCESS TIMELINE LOGIC
// ==========================================

const processSteps = {
    1: { title: "1. Proposal & 3Rs", text: "Researcher proves they searched for Alternatives (Replacement), minimized animals (Reduction), and optimized care (Refinement)." },
    2: { title: "2. Animal Welfare Body", text: "Internal institute review ensures the facility can care for the specific animals properly." },
    3: { title: "3. Competent Authority", text: "National Government performs the final Harm-Benefit Analysis, weighing suffering against societal benefit." },
    4: { title: "4. Authorization", text: "Permit granted. Retrospective Assessment later checks if actual harm matched the prediction." }
};

function showDetails(stepNumber) {
    const detailsBox = document.getElementById('process-details');
    const data = processSteps[stepNumber];
    detailsBox.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
    detailsBox.style.opacity = 0;
    setTimeout(() => { detailsBox.style.transition = "opacity 0.3s"; detailsBox.style.opacity = 1; }, 50);
}


// ==========================================
// SECTION 3: COST-BENEFIT VISUALIZER (PIG SCENARIOS)
// ==========================================

function updateBalance() {
    // 1. Get Values
    const scienceVal = parseInt(document.getElementById('scienceSlider').value);
    const harmVal = parseInt(document.getElementById('harmSlider').value);
    const moneyVal = parseInt(document.getElementById('moneySlider').value);

    // Update Display Text
    document.getElementById('val-science').innerText = scienceVal + "%";
    document.getElementById('val-harm').innerText = harmVal + "%";
    document.getElementById('val-money').innerText = moneyVal + "%";

    // 2. Calculate
    const totalBenefit = scienceVal;
    // Harm is weighted higher than financial cost
    const totalCost = Math.min(100, harmVal + (moneyVal * 0.2)); 

    // 3. Update Bars
    document.getElementById('bar-benefit').style.width = totalBenefit + "%";
    document.getElementById('bar-cost').style.width = totalCost + "%";

    // 4. Feedback Text
    const textDiv = document.getElementById('balance-result');
    if (totalBenefit > totalCost + 10) {
        textDiv.innerText = "✅ Benefits outweigh the Costs.";
        textDiv.style.color = "var(--success)";
    } else if (totalCost > totalBenefit + 10) {
        textDiv.innerText = "❌ Costs are too high. Unethical.";
        textDiv.style.color = "var(--danger)";
    } else {
        textDiv.innerText = "⚖️ It is a difficult ethical borderline.";
        textDiv.style.color = "orange";
    }
}

// Preset Scenarios
// Preset Scenarios
function loadScenario(type) {
    if (type === 'growth') {
        // Growth: High food benefit, Low harm (feeding), Medium cost
        setSliders(70, 25, 40); 
    } else if (type === 'fat') {
        // Fat Quality: Consumer benefit, Very low harm (diet), Low cost
        setSliders(40, 15, 20); 
    } else if (type === 'enviro') {
        // Environmental: High climate benefit, Low harm (diet/manure), Medium cost
        setSliders(85, 15, 50);
    } else if (type === 'drug') {
        // Drug Response: High health benefit, Higher harm (injections), High cost
        setSliders(90, 60, 80); 
    } else if (type === 'amr') {
        // AMR: Critical Global Benefit, Medium/High harm (infection models), High cost (isolation)
        setSliders(95, 55, 75);
    } else if (type === 'pain') {
        // Pain/Stress: High Welfare Benefit, Medium harm (must induce pain to test relief), Low cost
        setSliders(80, 50, 30);
    } else if (type === 'behaviour') {
        // Behaviour: Medium Benefit, Low harm (observation/puzzles), Low cost
        setSliders(60, 20, 30);
    } else if (type === 'housing') {
        // Housing: High Welfare Benefit (long term), Low harm, Very High Cost (construction)
        setSliders(75, 20, 90);
    } else if (type === 'organ') {
        // Organ Transplant (Xenotransplantation): 
        // Max Benefit (Curing human heart failure), Max Harm (Sterile isolation + Death), Max Cost
        setSliders(100, 95, 100);
    }
}

function setSliders(science, harm, money) {
    document.getElementById('scienceSlider').value = science;
    document.getElementById('harmSlider').value = harm;
    document.getElementById('moneySlider').value = money;
    updateBalance(); // Update immediately
}

// Initialize on load
updateBalance();