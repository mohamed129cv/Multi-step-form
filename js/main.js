let btnNext = document.getElementsByClassName("next")[0];
let btnBack = document.getElementsByClassName("back")[0];
let steps = Array.from(document.getElementsByClassName("progress"));
let index = Array.from(document.getElementsByClassName("index"));
let aisdeSteps = document.querySelectorAll("aside section");

let form = document.querySelectorAll(".form input");
let errorMas = document.querySelectorAll(".form .error");

let plans = document.querySelectorAll(".cards .card");
let checkboxPlan = document.querySelector(
  '.progress_2 .time input[type="checkbox"]'
);
let monthly = document.querySelector(".Monthly");
let yearly = document.querySelector(".Yearly");
let subscriptionType = checkboxPlan.checked ? "Yearly" : "Monthly"; // Yearly or Monthly
let planSelceted = null;

let addHelp = document.querySelectorAll(".add-help .card");
let PicksSelceted = [];

let checkeH4Plane = document.querySelector(".check .type-data h4");
let priceSubcripeType = document.querySelector(".check .data-plan .price");
let rowAddHelp = document.querySelector(".check .data-add");
let totalPrice = document.querySelector(".total-price .price");
let totalTitel = document.getElementById("my-type");
let btnChange = document.getElementById("change");
btnChange.addEventListener("click", function () {
  removeActiveFromIndex();
  removeActiveFromProgerss();
  steps[1].classList.add("active");
  steps[3].classList.add("go-out");
  index[1].classList.add("active");
});

let currentStep = 0;
let btns = document.getElementsByClassName("btns")[0];

// add active on lode page
ActiveBtn();
updataActive();
function removeActiveFromProgerss() {
  steps.forEach((step) => {
    step.classList.remove("active", "go-out");
  });
}
function removeActiveFromIndex() {
  index.forEach((ind) => {
    ind.classList.remove("active");
  });
}
function removeActiveFromPlans() {
  plans.forEach((plan) => {
    plan.classList.remove("active");
  });
}

function checkInputValue() {
  let progress_1 = true;
  let isvaild = true;
  const regxEmail = /[a-zA-Z0-9]{3,}@/;
  const regxPhone = /01[1250][0-9]{8}/gm; // eg number phone
  form.forEach((input, ind) => {
    // requried
    if (input.value.trim() == "") {
      isvaild = false;
    } else {
      //  email valdition
      if (input.type == "email") {
        isvaild = regxEmail.test(input.value.trim());
        errorMas[ind].innerHTML = `this email not match`;
      }
      // min length
      if (input.type == "text") {
        isvaild = input.value.length < 3 ? false : true;
        errorMas[ind].innerHTML = `Name must be at least 3 chars`;
      }
      // phone
      if (input.type == "tel") {
        isvaild = regxPhone.test(input.value.trim());
        errorMas[ind].innerHTML = `This is not a valid phone number`;
      }
    }

    if (!isvaild) {
      input.classList.add("invaild");
      input.classList.remove("vaild");
      progress_1 = false;
    } else {
      input.classList.remove("invaild");
      input.classList.add("vaild");
      progress_1 = true;
    }
  });
  return progress_1;
}

//  step 2

plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    removeActiveFromPlans();
    plan.classList.add("active");
    planSelceted = plan;
  });
});
checkboxPlan.addEventListener("change", () => {
  subscriptionType = checkboxPlan.checked ? "Yearly" : "Monthly";

  updataActive();
});
monthly.addEventListener("click", () => {
  checkboxPlan.checked = false;
  subscriptionType = "Monthly";
  updataActive();
});
yearly.addEventListener("click", () => {
  checkboxPlan.checked = true;
  subscriptionType = "Yearly";

  updataActive();
});

function updataActive() {
  if (checkboxPlan.checked) {
    yearly.classList.add("active");
    monthly.classList.remove("active");
    plans.forEach((plan, ind) => {
      let price =
        parseFloat(
          plan.querySelector(".price").dataset.price.replace(/[^0-9]/g, "")
        ) * 10;
      plan.querySelector(".price").innerHTML = `$${price}/yr`;
      if (!plan.querySelector(".discount")) {
        let discount = document.createElement("p");
        discount.classList.add("discount");
        discount.textContent = "2 months free";
        plan.appendChild(discount);
        discount.classList.add("active");
      }
      let priceOfadd =
        parseFloat(
          addHelp[ind]
            .querySelector(".number")
            .dataset.price.replace(/[^0-9]/g, "")
        ) * 10;
      addHelp[ind].querySelector(".number").innerHTML = `+$${priceOfadd}/yr`;
    });
  } else {
    monthly.classList.add("active");
    yearly.classList.remove("active");
    plans.forEach((plan, ind) => {
      let price = parseFloat(
        plan.querySelector(".price").dataset.price.replace(/[^0-9]/g, "")
      );
      plan.querySelector(".price").innerHTML = `$${price}/mo`;
      let discount = plan.querySelector(".discount");
      if (discount) {
        discount.classList.replace("active", "getOut");
        setTimeout(() => discount.remove(), 600);
      }
      let priceOfadd = parseFloat(
        addHelp[ind]
          .querySelector(".number")
          .dataset.price.replace(/[^0-9]/g, "")
      );

      addHelp[ind].querySelector(".number").innerHTML = `+$${priceOfadd}/mo`;
    });
  }
}

// step 3
addHelp.forEach((card, ind) => {
  card.addEventListener("click", () => {
    let checkboxCard = card.querySelector("input");
    checkboxCard.checked = !checkboxCard.checked;
    card.classList.toggle("active", checkboxCard.checked);
    if (checkboxCard.checked) {
      if (!PicksSelceted.includes(card)) {
        PicksSelceted.push(card);
      }
    } else {
      PicksSelceted = PicksSelceted.filter((c) => c !== card);
    }
  });
});

// step 4

function initDdd() {
  if (!planSelceted) return;
  let planName = planSelceted.querySelector(".about-plan .plan-type").innerHTML;
  checkeH4Plane.innerHTML = `${planName} (<span id="timer">${subscriptionType}</span>) `;
  priceSubcripeType.innerHTML =
    planSelceted.querySelector(".about-plan .price").innerHTML;
  totalTitel.innerHTML = `${planName} ${subscriptionType}`;
  let data = ``;
  for (let i = 0; i < PicksSelceted.length; i++) {
    data += `
       <div class="add-pick">
              <p class="name">${
                PicksSelceted[i].querySelector(".card-body h4").innerHTML
              }</p>
              <p class="price">${
                PicksSelceted[i].querySelector(".number").innerHTML
              }</p>
            </div>
      `;
  }
  rowAddHelp.innerHTML = data;
}
function sumPrice() {
  if (!planSelceted) return;
  let priceOfPaln = parseFloat(
    planSelceted
      .querySelector(".about-plan .price")
      .innerHTML.replace(/[^0-9]/g, "")
  );
  let arrForPricePick = PicksSelceted.map((pik) => {
    return parseFloat(
      pik.querySelector(".number").innerHTML.replace(/[^0-9]/g, "")
    );
  });
  let priceOfAdd =
    arrForPricePick.reduce((sum, val) => {
      return sum + val;
    }, 0) || 0;
  return priceOfAdd + priceOfPaln;
}

btnNext.addEventListener("click", (e) => {
  e.preventDefault();
  if (!checkSutase(currentStep)) return;
  if (currentStep < steps.length - 1) {
    removeActiveFromProgerss();
    removeActiveFromIndex();
    steps[currentStep + 1].classList.add("active");
    steps[currentStep].classList.add("go-out");
    if (currentStep + 1 < index.length) {
      index[currentStep + 1].classList.add("active");
    }
    currentStep++;
    ActiveBtn();
  }
});

btnBack.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentStep > 0) {
    removeActiveFromProgerss();
    removeActiveFromIndex();
    console.log(currentStep);
    steps[currentStep - 1].classList.add("active");
    index[currentStep - 1].classList.add("active");
    if (currentStep > 0) {
      steps[currentStep].classList.add("go-out");
    }
    currentStep--;
    ActiveBtn();
  } else {
    btnBack.style.opcite = "0";
    btnBack.style.pointerEvents = "none";
  }
});

aisdeSteps.forEach((event, i) => {
  event.addEventListener("click", (e) => {
    e.preventDefault();
    if (!checkSutase(i)) return;
    currentStep = i
    ActiveBtn()
    removeActiveFromIndex();
    removeActiveFromProgerss();
    steps[i].classList.add("active");
    index[i].classList.add("active");
    currentStep = i;
    if (i != 0) {
      steps[i - 1].classList.add("go-out");
    }
  });
});
function checkSutase(ind) {
  if (ind == 0 && !checkInputValue()) return false;
  if (ind == 1 && planSelceted == null) return false;
  if (ind == 2 && planSelceted == null) {
    return false;
  } else {
    initDdd();
    if (subscriptionType == "Yearly") {
      totalPrice.innerHTML = `+$${sumPrice()}/yr`;
    } else if (subscriptionType == "Monthly") {
      totalPrice.innerHTML = `+$${sumPrice()}/mo`;
    }
  }
  if (ind == 3 && planSelceted == null) return false;
  return true;
}

function ActiveBtn() {
  if (currentStep == 0) {
    btnBack.style.opacity = "0";
  } else {
    btnBack.style.opacity = "1";
  }
  if (currentStep == 4) {
    btns.style.opacity = "0";
  } else {
    btns.style.opacity = "1";
  }
}
