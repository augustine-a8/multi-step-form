const formSteps = document.querySelectorAll(".form-step");
const sidebarSteps = document.querySelectorAll(".sidebar-step");
const nextFormBtns = document.querySelectorAll(".nxt-form-btn");
const prevFormBtns = document.querySelectorAll(".prev-form-btn");
const monthlyPlanDuration = document.querySelector(".monthly-plan-toggle");
const yearlyPlanDuration = document.querySelector(".yearly-plan-toggle");
const customSlider = document.querySelector(".custom-slider");
const customSliderCheckbox = document.querySelector('.custom-slider>input[type="checkbox"]');
const customSliderLabels = document.querySelectorAll(".toggle-plan-duration>p");
const planTypes = document.querySelectorAll(".radio-group");
const customRadios = document.querySelectorAll('input[name="plan"]');
const customRadioBoxes = document.querySelectorAll(".custom-radio");
const checkboxGroups = document.querySelectorAll(".checkbox-group");
const customCheckboxes = document.querySelectorAll(".custom-checkbox");
const formControls = document.querySelectorAll(".form-control");

let currentFormStep = 0;
let planDurationIdx = 0;

nextFormBtns.forEach((nxtBtn) => {
    nxtBtn.addEventListener("click", (e) => {
        if (currentFormStep === 0) {
            const shouldPass = validateInput();
            console.log("should pass: ", shouldPass);
            if (shouldPass) {
                clearInputErrors();
                currentFormStep++;
                updateFormStep();
                updateSidebarStep(currentFormStep);
            }
            return;
        }
        if (currentFormStep < 4) {
            currentFormStep++;
            if (currentFormStep < 3) {
                updateSidebarStep(currentFormStep);
            } else {
                updateSidebarStep(3);
            }
            updateFormStep();
            if (currentFormStep === 3) {
                setFinishingUpPlan();
                setFinishingUpAddOn();
                setTotal();
            }
        }
    });
});

prevFormBtns.forEach((prevBtn) => {
    prevBtn.addEventListener("click", (e) => {
        if (currentFormStep === 2) {
            clearSelectedAddons();
            clearCustomCheckboxes();
        }
        if (currentFormStep === 3) {
            removeFinishingUpAddons();
        }
        currentFormStep--;
        updateFormStep();
        updateSidebarStep(currentFormStep);
    });
});

customRadioBoxes.forEach((customRadio) => {
    customRadio.addEventListener("click", () => {
        clearCustomRadio();
        const actualRadio = customRadio.children[1];
        if (actualRadio.checked === true) {
            customRadio.classList.add("active");
        } else {
            customRadio.classList.remove("active");
        }
    });
});

customSliderCheckbox.addEventListener("click", (e) => {
    if (customSliderCheckbox.checked === true) {
        customSliderLabels[0].classList.remove("active");
        customSliderLabels[1].classList.add("active");
        updatePlanType(1);
        updateAddOns(1);
    } else {
        customSliderLabels[0].classList.add("active");
        customSliderLabels[1].classList.remove("active");
        updatePlanType(0);
        updateAddOns(0);
    }
});

customSliderLabels.forEach((label, idx) => {
    label.addEventListener("click", () => {
        if (idx === 0) {
            customSliderCheckbox.checked = false;
            customSliderLabels[0].classList.add("active");
            customSliderLabels[1].classList.remove("active");
            updatePlanType(idx);
            updateAddOns(idx);
        } else {
            customSliderCheckbox.checked = true;
            customSliderLabels[0].classList.remove("active");
            customSliderLabels[1].classList.add("active");
            updatePlanType(idx);
            updateAddOns(idx);
        }
    });
});

customCheckboxes.forEach((customCheckbox) => {
    customCheckbox.addEventListener("click", (e) => {
        const mainCheckbox = customCheckbox.children[0];
        if (mainCheckbox.checked === true) {
            customCheckbox.classList.add("active");
        } else {
            customCheckbox.classList.remove("active");
        }
    });
});

function clearCustomCheckboxes() {
    customCheckboxes.forEach((customCheckbox) => {
        customCheckbox.classList.contains("active") && customCheckbox.classList.remove("active");
    });
}

function updateFormStep() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("active") && formStep.classList.remove("active");
    });
    formSteps[currentFormStep].classList.add("active");
}

function updateSidebarStep(index) {
    sidebarSteps.forEach((sidebarStep) => {
        sidebarStep.classList.contains("active") && sidebarStep.classList.remove("active");
    });
    sidebarSteps[index].classList.add("active");
}

function updatePlanType(index) {
    planTypes.forEach((planType) => {
        planType.classList.contains("active") && planType.classList.remove("active");
    });
    planTypes[index].classList.add("active");
}

function updateAddOns(index) {
    checkboxGroups.forEach((checkboxGroup) => {
        checkboxGroup.classList.contains("active") && checkboxGroup.classList.remove("active");
    });
    checkboxGroups[index].classList.add("active");
}

function getSelectedPlan() {
    let selectedPlan = "";
    let selectedPlanValue = "";
    customRadios.forEach((radio) => {
        if (radio.checked === true) {
            selectedPlan = radio.id;
            selectedPlanValue = radio.value;
        }
    });
    return { selectedPlan, selectedPlanValue };
}

function getSelectedAddons() {
    const checkboxes = document.querySelectorAll('.custom-checkbox input[type="checkbox"]');
    const selectedAddOns = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked === true) {
            selectedAddOns.push({ name: checkbox.id, value: checkbox.value });
        }
    });
    return selectedAddOns;
}

function clearSelectedAddons() {
    const checkboxes = document.querySelectorAll('.custom-checkbox input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked === true) {
            checkbox.checked = false;
        }
    });
}

function setFinishingUpPlan() {
    const primaryOption = document.querySelector(".primary-option .plan");
    const primaryOptionDuration = document.querySelector(".primary-option .duration");
    const primaryOptionValue = document.querySelector(".primary-option>small");

    const { selectedPlan, selectedPlanValue } = getSelectedPlan();

    primaryOption.innerHTML = selectedPlan.split("-")[0];
    primaryOptionDuration.innerHTML = selectedPlan.split("-")[1];
    if (selectedPlan.split("-")[1] === "monthly") {
        primaryOptionValue.innerHTML = `$${selectedPlanValue}/mo`;
    } else {
        primaryOptionValue.innerHTML = `$${selectedPlanValue}/yr`;
    }
}

function setFinishingUpAddOn() {
    const selectedAddOns = getSelectedAddons();
    const chosenOpts = document.querySelector(".chosen-opts");

    selectedAddOns.forEach((addOn) => {
        const div = document.createElement("div");
        div.classList = "flex option";
        const smallName = document.createElement("small");
        smallName.classList = "txt-clr-cool-gray capitalize";
        smallName.innerHTML = `${addOn.name.split("-")[0]} ${addOn.name.split("-")[1]}`;
        const smallValue = document.createElement("small");
        smallValue.classList = "txt-clr-marine-blue";
        smallValue.innerHTML = `+$${addOn.value}/${addOn.name.split("-")[2]}`;

        div.appendChild(smallName);
        div.appendChild(smallValue);

        chosenOpts.appendChild(div);
    });
}

function removeFinishingUpAddons() {
    const options = document.querySelectorAll(".chosen-opts>.divider ~ *");
    options.forEach((option) => {
        option.remove();
    });
}

function clearCustomRadio() {
    customRadioBoxes.forEach((customRadio) => {
        customRadio.classList.contains("active") && customRadio.classList.remove("active");
    });
}

function getTotalSubscription() {
    let total = 0;
    let totalAddons = 0;
    let time;
    const { selectedPlanValue } = getSelectedPlan();
    const selectedAddOns = getSelectedAddons();
    selectedAddOns.forEach((addOn) => {
        totalAddons += parseInt(addOn.value);
    });
    total = totalAddons + parseInt(selectedPlanValue);
    time = selectedAddOns.pop().name.split("-")[2];
    return { total, time };
}

function setTotal() {
    const { total, time } = getTotalSubscription();
    const totalTitle = document.querySelector(".total-subscription>small");
    const totalValue = document.querySelector(".total-subscription>p");

    time === "mo" ? (totalTitle.innerHTML = "Total (per month)") : (totalTitle.innerHTML = "Total (per year)");
    totalValue.innerHTML = `$${total}/${time}`;
}

function validateInput() {
    const errors = [];
    formControls.forEach((formControl) => {
        const input = formControl.children[1];
        if (input.value === "") {
            formControl.classList.add("error");
            errors.push("error");
        }
    });

    return errors.length === 0;
}

function clearInputErrors() {
    formControls.forEach((formControl) => {
        formControl.classList.contains("error") && formControl.classList.remove("error");
    });
}
