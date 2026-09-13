# Aura Dental Studio 🦷✨
> **Next-Generation Aesthetic & Restorative Dentistry**  
> *Black & Blue Luxury Theme &bull; 100% Client-Side Cryptographic Sanitization &bull; Zero External Vulnerabilities*

Live GitHub Repository: **[https://github.com/Tanmay2498/Dental-website](https://github.com/Tanmay2498/Dental-website)**

---

## 🔬 Research & Essential Requirements Analysis

Following thorough analysis of top modern dental practices (*Tend, Studio Dental, Aspen Dental, Pacific Dental Services*), the following essential requirements were identified and engineered into the website:

| Requirement Category | Industry Best Practice | Implementation in Aura Dental |
| :--- | :--- | :--- |
| **Instant Anxiety Relief** | Calming, luxurious dark palette avoiding clinical sterile white. | Black & midnight blue aesthetic (`#050811`, `#00D2FF`, `#0066FF`) with gentle glowing accents. |
| **Rapid Emergency Triage** | Immediate access for toothache, broken crowns, dental trauma. | Floating emergency hotline pill + Dedicated emergency banner with 24/7 direct dial. |
| **Interactive Smile Proof** | Before/after case comparisons proving cosmetic skill. | Real-time interactive before/after split slider with touch/mouse dragging for Whitening, Invisalign, and Veneers. |
| **Price Transparency** | Patients fear hidden dental bills and insurance confusion. | Interactive Cost & Insurance Calculator computing real copays and 0% APR monthly financing. |
| **Symptom Guidance** | Non-clinical patients often don't know what procedure they need. | "Where Does It Hurt?" Interactive Concierge matching symptoms to treatments and doctors. |
| **Online Scheduling** | Modern patients expect zero-friction digital reservations. | 3-step booking wizard with calendar date picker, time slot selector, and instant confirmation modal. |
| **Clinical Credibility** | Credentials, Ivy League pedigree, board certifications. | Detailed profiles of Dr. Vance (Columbia), Dr. Rostova (Harvard), and Dr. Chen (NYU). |
| **Cutting-Edge Tech** | Highlights safety and low pain to reduce anxiety. | Showcase of Low-Dose 3D CBCT, The Wand® computerized anesthesia, and CEREC same-day crowns. |
| **Social Proof** | Verified patient testimonials and star ratings. | 5-star verified patient reviews and Google/Zocdoc rating badges. |
| **Security & Privacy** | HIPAA-conscious, no data leakage, resilient to attacks. | Zero npm dependency footprint, strict CSP headers, anti-traversal protection, honeypot spam defence. |

---

## 🎨 Design System: Black & Blue Theme

- **Background Void**: `#050811` (Deep pitch obsidian)
- **Secondary Midnight**: `#0A101D` & `#0F172A`
- **Glass Surfaces**: `rgba(14, 23, 42, 0.75)` with `backdrop-filter: blur(16px)`
- **Electric Cyan Glow**: `#00D2FF`
- **Royal Sapphire Blue**: `#0066FF`
- **Contrast Typography**: Pure White (`#F8FAFC`) with Slate Subtitles (`#94A3B8`)
- **Emergency Accent**: Crimson Coral (`#EF4444`)

---

## 🛡️ Security Hardening & "Non-Hackable" Architecture

To deliver on the user's requirement for a secure, non-hackable foundation:

1. **Zero Supply-Chain Dependency Risk**:
   - Built using standard modern web APIs (HTML5, CSS3, ES6) and Node's standard library.
   - Zero third-party `node_modules` vulnerabilities, zero malicious packages, zero prototype pollution vectors.
2. **Content Security Policy (CSP)**:
   - Restricts executable scripts and styles to self-origin.
   - Prevents unauthorized inline script execution and unauthorized cross-site data exfiltration.
3. **Anti-Clickjacking & Anti-MIME Sniffing**:
   - `X-Frame-Options: DENY` stops iframe embedding and clickjacking attacks.
   - `X-Content-Type-Options: nosniff` prevents MIME confusion attacks.
4. **Directory Traversal Protection**:
   - Node server normalizes paths and verifies `filePath.startsWith(PUBLIC_DIR)`.
5. **Client-Side Sanitization**:
   - Uses DOM text nodes (`textContent`) instead of unescaped `innerHTML` to eliminate Cross-Site Scripting (XSS).
6. **Anti-Bot Honeypot**:
   - Invisible trap fields in the booking wizard detect and block automated bots.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Tanmay2498/Dental-website.git
cd Dental-website

# 2. Start the zero-dependency secure server
node server.js
# or
npm start

# 3. Open in your browser:
# http://localhost:3000
```

---

## 🌐 Production Hosting

- **GitHub Pages**: Enabled on `main` branch under Repository Settings -> Pages.
- **Vercel / Netlify**: Simply link the GitHub repository; zero build configuration required!
