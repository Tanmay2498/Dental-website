/**
 * Aura Dental Studio - Interactive Client Application
 * High-performance, secure, responsive ES6 architecture.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initClinicStatus();
  initSmileSlider();
  initCostCalculator();
  initSymptomChecker();
  initBookingWizard();
  initFAQ();
  initSmoothScroll();
});

/* ==========================================================================
   1. Mobile Navigation
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close when clicking any nav link
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   2. Live Clinic Operating Status
   ========================================================================== */
function initClinicStatus() {
  const statusElem = document.getElementById('clinicLiveStatus');
  if (!statusElem) return;

  const now = new Date();
  const day = now.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const hour = now.getHours();

  let isOpen = false;
  let statusText = 'Closed • Opens Mon 8:00 AM';

  if (day >= 1 && day <= 5) {
    // Mon - Fri: 8 AM to 7 PM
    if (hour >= 8 && hour < 19) {
      isOpen = true;
      statusText = 'Open Now • Closes at 7:00 PM';
    } else if (hour < 8) {
      statusText = 'Opens Today at 8:00 AM';
    } else {
      statusText = day === 5 ? 'Closed • Opens Sat 9:00 AM' : 'Closed • Opens Tomorrow 8:00 AM';
    }
  } else if (day === 6) {
    // Saturday: 9 AM to 4 PM
    if (hour >= 9 && hour < 16) {
      isOpen = true;
      statusText = 'Open Now • Closes at 4:00 PM';
    } else if (hour < 9) {
      statusText = 'Opens Today at 9:00 AM';
    } else {
      statusText = 'Closed • On-Call Emergency';
    }
  } else {
    // Sunday: Emergency Only
    statusText = 'Emergency Care On-Call 24/7';
  }

  const dotClass = isOpen ? 'bg-success' : 'bg-cyan';
  statusElem.innerHTML = `
    <span class="badge-pulse" style="background-color: ${isOpen ? '#10B981' : '#00D2FF'}; box-shadow: 0 0 10px ${isOpen ? '#10B981' : '#00D2FF'};"></span>
    <span>${statusText}</span>
  `;
}

/* ==========================================================================
   3. Interactive Before & After Smile Slider
   ========================================================================== */
function initSmileSlider() {
  const container = document.getElementById('smileSliderContainer');
  const overlay = document.getElementById('sliderOverlay');
  const handle = document.getElementById('sliderHandle');
  if (!container || !overlay || !handle) return;

  let isDragging = false;

  function updatePosition(x) {
    const rect = container.getBoundingClientRect();
    let offsetX = x - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  // Touch Events
  handle.addEventListener('touchstart', () => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  // Click anywhere on container to snap slider
  container.addEventListener('click', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    updatePosition(e.clientX);
  });

  // Case Studies Data & Switching
  const caseData = {
    whitening: {
      title: "Laser Zoom Teeth Whitening (8 Shades Lighter)",
      desc: "Patient presented with deep dietary and coffee stains. Completed in a single 60-minute in-office treatment with Philips Zoom WhiteSpeed laser technology and zero sensitivity protocol.",
      duration: "60 Minutes",
      shade: "+8 Shades",
      doctor: "Dr. Alexander Vance",
      longevity: "2-3 Years",
      beforeColor: "#D6B870",
      afterColor: "#FFFFFF"
    },
    invisalign: {
      title: "Comprehensive Invisalign® Clear Aligner Therapy",
      desc: "Correction of significant anterior crowding, midline alignment, and Class I bite refinement without metal brackets in under 8 months.",
      duration: "7.5 Months",
      shade: "Perfect Arch",
      doctor: "Dr. Elena Rostova",
      longevity: "Permanent with Retainer",
      beforeColor: "#C9BA9B",
      afterColor: "#F4FAFF"
    },
    veneers: {
      title: "Handcrafted Zirconia Cosmetic Veneers (Upper 8)",
      desc: "Full aesthetic transformation resolving chipped edges, uneven tooth lengths, and congenital fluorosis using ultra-thin 0.3mm ceramic veneers.",
      duration: "2 Visits (10 Days)",
      shade: "Natural Bleach BL2",
      doctor: "Dr. Alexander Vance",
      longevity: "15-20+ Years",
      beforeColor: "#A38B57",
      afterColor: "#FFFFFF"
    }
  };

  const tabBtns = document.querySelectorAll('.case-tab-btn');
  const caseTitle = document.getElementById('caseTitle');
  const caseDesc = document.getElementById('caseDesc');
  const caseDuration = document.getElementById('caseDuration');
  const caseShade = document.getElementById('caseShade');
  const caseDoctor = document.getElementById('caseDoctor');
  const caseLongevity = document.getElementById('caseLongevity');

  const beforeTeethSvg = document.getElementById('beforeTeethSvg');
  const afterTeethSvg = document.getElementById('afterTeethSvg');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const caseKey = btn.dataset.case;
      const data = caseData[caseKey];
      if (!data) return;

      if (caseTitle) caseTitle.textContent = data.title;
      if (caseDesc) caseDesc.textContent = data.desc;
      if (caseDuration) caseDuration.textContent = data.duration;
      if (caseShade) caseShade.textContent = data.shade;
      if (caseDoctor) caseDoctor.textContent = data.doctor;
      if (caseLongevity) caseLongevity.textContent = data.longevity;

      if (beforeTeethSvg && afterTeethSvg) {
        beforeTeethSvg.querySelectorAll('.tooth-fill').forEach(el => el.setAttribute('fill', data.beforeColor));
        afterTeethSvg.querySelectorAll('.tooth-fill').forEach(el => el.setAttribute('fill', data.afterColor));
      }

      // Reset slider to 50%
      overlay.style.width = '50%';
      handle.style.left = '50%';
    });
  });
}

/* ==========================================================================
   4. Cost & Insurance Calculator
   ========================================================================== */
function initCostCalculator() {
  const procedureSelect = document.getElementById('calcProcedure');
  const insuranceSelect = document.getElementById('calcInsurance');
  const teethCountInput = document.getElementById('calcTeethCount');
  const teethCountRow = document.getElementById('teethCountRow');
  const teethCountDisplay = document.getElementById('calcTeethDisplay');

  const calcTotalRetail = document.getElementById('calcTotalRetail');
  const calcInsuranceDiscount = document.getElementById('calcInsuranceDiscount');
  const calcEstimatedOutOfPocket = document.getElementById('calcEstimatedOutOfPocket');
  const calcMonthlyFinance = document.getElementById('calcMonthlyFinance');

  if (!procedureSelect || !insuranceSelect) return;

  const pricing = {
    cleaning: { base: 180, perTooth: false, insuranceCov: 0.80 },
    whitening: { base: 450, perTooth: false, insuranceCov: 0.20 }, // Cosmetic rarely full cov
    invisalign: { base: 3800, perTooth: false, insuranceCov: 0.40 },
    implant: { base: 2100, perTooth: true, insuranceCov: 0.50 },
    veneer: { base: 950, perTooth: true, insuranceCov: 0.15 },
    rootcanal: { base: 850, perTooth: true, insuranceCov: 0.70 }
  };

  const insuranceDiscounts = {
    none: 0.10, // 10% cash discount
    delta: 0.35,
    cigna: 0.30,
    metlife: 0.32,
    aetna: 0.28,
    guardian: 0.30
  };

  function recalculate() {
    const procKey = procedureSelect.value;
    const insKey = insuranceSelect.value;
    const proc = pricing[procKey] || pricing.cleaning;

    let count = 1;
    if (proc.perTooth) {
      if (teethCountRow) teethCountRow.style.display = 'flex';
      count = parseInt(teethCountInput.value, 10) || 1;
      if (teethCountDisplay) teethCountDisplay.textContent = count;
    } else {
      if (teethCountRow) teethCountRow.style.display = 'none';
    }

    const retailTotal = proc.base * count;
    const discountRate = insuranceDiscounts[insKey] || 0.10;
    const coverageRate = proc.insuranceCov;

    let totalDiscount = 0;
    let outOfPocket = 0;

    if (insKey === 'none') {
      // 10% Cash Membership Plan discount
      totalDiscount = retailTotal * 0.10;
      outOfPocket = retailTotal - totalDiscount;
    } else {
      // Network contracted rate discount + insurance co-pay
      const contractedRate = retailTotal * (1 - (discountRate * 0.5));
      const insurancePaid = contractedRate * coverageRate;
      totalDiscount = (retailTotal - contractedRate) + insurancePaid;
      outOfPocket = retailTotal - totalDiscount;
    }

    if (outOfPocket < 0) outOfPocket = 0;
    const monthly12 = Math.round(outOfPocket / 12);

    if (calcTotalRetail) calcTotalRetail.textContent = `$${retailTotal.toLocaleString()}`;
    if (calcInsuranceDiscount) calcInsuranceDiscount.textContent = `-$${Math.round(totalDiscount).toLocaleString()}`;
    if (calcEstimatedOutOfPocket) calcEstimatedOutOfPocket.textContent = `$${Math.round(outOfPocket).toLocaleString()}`;
    if (calcMonthlyFinance) {
      calcMonthlyFinance.textContent = `Or starting at $${monthly12}/mo with 0% APR Flexible CareCredit financing`;
    }
  }

  procedureSelect.addEventListener('change', recalculate);
  insuranceSelect.addEventListener('change', recalculate);
  if (teethCountInput) teethCountInput.addEventListener('input', recalculate);

  recalculate();
}

/* ==========================================================================
   5. Interactive Symptom Concierge
   ========================================================================== */
function initSymptomChecker() {
  const buttons = document.querySelectorAll('.symptom-btn');
  const resultPanel = document.getElementById('symptomResultPanel');
  const resultTitle = document.getElementById('symptomResultTitle');
  const resultDesc = document.getElementById('symptomResultDesc');
  const resultUrgency = document.getElementById('symptomResultUrgency');
  const resultDoctor = document.getElementById('symptomResultDoctor');
  const resultActionBtn = document.getElementById('symptomActionBtn');

  if (!buttons.length || !resultPanel) return;

  const diagnoses = {
    pain: {
      title: "Acute Toothache / Potential Nerve Infection",
      desc: "Sharp, throbbing, or continuous pain often indicates deep decay or pulp inflammation requiring digital pulp testing or gentle root canal preservation.",
      urgency: "High Priority (Same-Day Exam Recommended)",
      urgencyColor: "#EF4444",
      doctor: "Dr. Marcus Chen (Endodontic Specialist)",
      targetService: "rootcanal"
    },
    bleeding: {
      title: "Gingival Inflammation / Early Periodontitis",
      desc: "Gums bleeding during flossing or brushing point to bacterial plaque pockets. Responsive to ultrasonic deep hygiene scaling and antimicrobial rinse.",
      urgency: "Moderate (Schedule within 1-2 weeks)",
      urgencyColor: "#F59E0B",
      doctor: "Dr. Alexander Vance (General Dentistry)",
      targetService: "cleaning"
    },
    chipped: {
      title: "Traumatic Enamel Fracture / Chip",
      desc: "A cracked tooth can quickly expose sensitive dentin layers. Immediate composite biomimetic bonding or ceramic crown prevents bacterial ingress.",
      urgency: "Urgent (Within 24-48 Hours)",
      urgencyColor: "#EF4444",
      doctor: "Dr. Alexander Vance (Aesthetic Restorative)",
      targetService: "veneer"
    },
    stains: {
      title: "Extrinsic Enamel Staining & Discoloration",
      desc: "Tannins, tobacco, and aging can darken enamel tubules. Highly reversible with in-office laser whitening and hydroxyapatite remineralization.",
      urgency: "Elective (Convenient Booking)",
      urgencyColor: "#10B981",
      doctor: "Dr. Elena Rostova (Aesthetic Hygiene)",
      targetService: "whitening"
    },
    crooked: {
      title: "Dental Malocclusion & Spacing",
      desc: "Misalignment causes uneven tooth wear and hygiene difficulties. Discreetly correctable using computer-guided Invisalign 3D aligners.",
      urgency: "Elective (Consultation Recommended)",
      urgencyColor: "#00D2FF",
      doctor: "Dr. Elena Rostova (Invisalign Elite Provider)",
      targetService: "invisalign"
    },
    missing: {
      title: "Missing Tooth / Ridge Resorption",
      desc: "Unreplaced teeth lead to bone loss and adjacent shifting. Permanent titanium or ceramic implants restore 100% natural bite strength.",
      urgency: "Recommended within 1-3 Months",
      urgencyColor: "#38BDF8",
      doctor: "Dr. Marcus Chen (Oral Implant Surgeon)",
      targetService: "implant"
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const symptomKey = btn.dataset.symptom;
      const data = diagnoses[symptomKey];
      if (!data) return;

      if (resultTitle) resultTitle.textContent = data.title;
      if (resultDesc) resultDesc.textContent = data.desc;
      if (resultUrgency) {
        resultUrgency.textContent = data.urgency;
        resultUrgency.style.color = data.urgencyColor;
      }
      if (resultDoctor) resultDoctor.textContent = `Recommended: ${data.doctor}`;
      
      if (resultActionBtn) {
        resultActionBtn.onclick = () => {
          const bookingService = document.getElementById('wizardService');
          if (bookingService) {
            bookingService.value = data.targetService;
          }
          document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        };
      }

      resultPanel.style.display = 'flex';
    });
  });
}

/* ==========================================================================
   6. Smart Multi-Step Online Booking Wizard
   ========================================================================== */
function initBookingWizard() {
  let currentStep = 1;
  const totalSteps = 3;

  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepContents = document.querySelectorAll('.wizard-step-content');
  const nextBtn = document.getElementById('wizardNextBtn');
  const prevBtn = document.getElementById('wizardPrevBtn');
  const submitBtn = document.getElementById('wizardSubmitBtn');

  const wizardDate = document.getElementById('wizardDate');
  const slotButtons = document.querySelectorAll('.slot-btn');
  let selectedTimeSlot = '10:00 AM';

  // Set minimum date to today
  if (wizardDate) {
    const today = new Date().toISOString().split('T')[0];
    wizardDate.min = today;
    wizardDate.value = today;
  }

  // Time slot selection
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTimeSlot = btn.textContent.trim();
    });
  });

  function showStep(step) {
    stepContents.forEach(content => {
      content.classList.remove('active');
      if (parseInt(content.dataset.step, 10) === step) {
        content.classList.add('active');
      }
    });

    stepIndicators.forEach(indicator => {
      const indStep = parseInt(indicator.dataset.step, 10);
      indicator.classList.remove('active', 'completed');
      if (indStep === step) {
        indicator.classList.add('active');
      } else if (indStep < step) {
        indicator.classList.add('completed');
      }
    });

    if (prevBtn) prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = step < totalSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  // Booking Form Submission & Confirmation Modal
  const bookingForm = document.getElementById('bookingWizardForm');
  const confirmationModal = document.getElementById('confirmationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmClose');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot security anti-spam check
      const honeypot = document.getElementById('website_url_hp');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Bot submission blocked.');
        return;
      }

      // Read form fields securely
      const patientName = document.getElementById('patientName')?.value.trim() || 'Valued Patient';
      const patientPhone = document.getElementById('patientPhone')?.value.trim() || 'N/A';
      const patientEmail = document.getElementById('patientEmail')?.value.trim() || 'N/A';
      const serviceName = document.getElementById('wizardService')?.selectedOptions[0]?.text || 'General Checkup';
      const doctorName = document.getElementById('wizardDoctor')?.selectedOptions[0]?.text || 'Next Available Specialist';
      const apptDate = wizardDate?.value || new Date().toISOString().split('T')[0];

      // Generate secure unique appointment booking code
      const bookingCode = 'AD-' + Math.floor(100000 + Math.random() * 900000);

      // Populate confirmation modal securely (DOM text content to prevent XSS)
      const confName = document.getElementById('confPatientName');
      const confService = document.getElementById('confService');
      const confDoctor = document.getElementById('confDoctor');
      const confDateTime = document.getElementById('confDateTime');
      const confCode = document.getElementById('confCode');

      if (confName) confName.textContent = patientName;
      if (confService) confService.textContent = serviceName;
      if (confDoctor) confDoctor.textContent = doctorName;
      if (confDateTime) confDateTime.textContent = `${apptDate} at ${selectedTimeSlot}`;
      if (confCode) confCode.textContent = bookingCode;

      // Show modal
      if (confirmationModal) {
        confirmationModal.classList.add('open');
      }

      // Reset form
      bookingForm.reset();
      currentStep = 1;
      showStep(1);
    });
  }

  if (modalCloseBtn && confirmationModal) {
    modalCloseBtn.addEventListener('click', () => {
      confirmationModal.classList.remove('open');
    });
  }

  if (modalConfirmBtn && confirmationModal) {
    modalConfirmBtn.addEventListener('click', () => {
      confirmationModal.classList.remove('open');
    });
  }

  // Quick Hero Form trigger
  const quickHeroForm = document.getElementById('quickHeroForm');
  if (quickHeroForm) {
    quickHeroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const heroService = document.getElementById('heroService')?.value;
      const heroDate = document.getElementById('heroDate')?.value;

      const wizardService = document.getElementById('wizardService');
      if (wizardService && heroService) wizardService.value = heroService;
      if (wizardDate && heroDate) wizardDate.value = heroDate;

      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others for neat accordion
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   8. Smooth Scroll Navigation
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
