/* ───────── Grounder: site configuration ─────────
   Set endpoint to a URL that accepts JSON POSTs (your CRM, a Zapier/Make webhook, Formspree, etc.)
   and every inquiry, partner application and contact message is sent there.
   Until then they are stored in this browser (localStorage) and the contact/partner forms fall back to email. */
const GX_CONFIG = {
  endpoint: '',                       // e.g. 'https://hooks.zapier.com/hooks/catch/xxxx/yyyy'
  contactEmail: 'grounder@tourground.com',  // inbox for inquiries, partner applications and contact messages
  address: 'Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, United Kingdom',  // business address (owner-approved coworking arrangement)
  demoQuotes: true                    // true = show illustrative quotes on the dashboard until DMCs are connected
};
async function gxSend(kind, payload){
  if(!GX_CONFIG.endpoint) return {ok:false, reason:'no-endpoint'};
  try{ const r = await fetch(GX_CONFIG.endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(Object.assign({kind, site:'grounder', at:new Date().toISOString()}, payload))}); return {ok:r.ok}; }
  catch(e){ return {ok:false, reason:String(e)}; }
}
function gxMailto(subject, lines){ return 'mailto:' + GX_CONFIG.contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n')); }

/* ───────── persistence (inquiries survive reloads) ───────── */
const GX_STORE = 'grounder.inquiries.v1';
function saveInqs(){ try{ localStorage.setItem(GX_STORE, JSON.stringify(INQS)); if(lastRef) localStorage.setItem(GX_STORE + '.last', lastRef); }catch(e){} }
function loadInqs(){ try{ const a = JSON.parse(localStorage.getItem(GX_STORE) || '[]'); if(Array.isArray(a)) a.forEach(i => { if(i && i.ref && !INQS.some(x => x.ref === i.ref)) INQS.push(i); }); lastRef = localStorage.getItem(GX_STORE + '.last') || lastRef; }catch(e){} }

/* ───────── mobile menu ───────── */
// Language switch: keep the current view (#/for-agents stays #/for-agents) when changing language.
document.addEventListener('click', function(e){ const a = e.target.closest && e.target.closest('.lang-switch a'); if(a && location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash; });
function toggleMenu(){ document.body.classList.contains('menu-open') ? closeMenu() : openMenu(); }
function openMenu(){ document.body.classList.add('menu-open'); $('menu').setAttribute('aria-hidden', 'false'); $('nav-burger').setAttribute('aria-expanded', 'true'); }
function closeMenu(){ document.body.classList.remove('menu-open'); $('menu').setAttribute('aria-hidden', 'true'); $('nav-burger').setAttribute('aria-expanded', 'false'); }
$('menu').addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });

/* ───────── pages ───────── */
const CTA = '<button class="btn blue" onclick="openInquiry(null,[],false,null,\'describe\')">Get an instant quote ' + ICON.arrow + '</button>';
const CTA_P = '<a class="btn blue" href="#/partners">Partner with us ' + ICON.arrow + '</a>';
const POPULAR = ['Italy','Japan','Peru','Kenya','Thailand','Portugal','Morocco','Tanzania','Iceland','Vietnam','Greece','Costa Rica'];
const chip = n => '<a class="pchip" href="#/explore" onclick="pendingSel=\'' + n.replace(/'/g, "\\'") + '\'">' + esc(n) + '</a>';
const PAGES = {
  'how-it-works': {
    title: 'How it works — Grounder', desc: 'Send one brief. Grounder matches it to vetted local DMCs, collects their quotes in one dashboard and runs the trip on the ground.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">How it works</div><h1>One brief in.<br>Vetted quotes out.</h1><p class="lead">Grounder replaces the DMC email chase. Paste your client's request, let the AI read it, and compare offers from local partners in one place.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/explore">Explore destinations</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-steps">
  <div class="p-step"><div class="step-n">1</div><h3>Send the brief</h3><p>Paste the client's email or fill in a short form. Grounder reads destination, dates, travellers, budget and style, and asks only for what is missing.</p><small>Takes about 30 seconds. No account needed.</small></div>
  <div class="p-step"><div class="step-n">2</div><h3>AI matching</h3><p>Our matching picks the local partners that fit the trip, not just the country: pace, style, hotel level and language. Supplier names stay private until they reply.</p><small>Typically 3 to 5 vetted DMCs per request.</small></div>
  <div class="p-step"><div class="step-n">3</div><h3>Compare quotes</h3><p>Offers land in your Grounder dashboard side by side: itinerary, inclusions, price per person, payment and cancellation terms. Ask questions in one thread.</p><small>Net rates, ready for your markup.</small></div>
  <div class="p-step"><div class="step-n">4</div><h3>We operate</h3><p>Select a quote and the local partner runs the trip: guides, transfers, hotels, activities. The Grounder desk stays on call for you and your travellers 24/7.</p><small>One point of accountability.</small></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">What you get</div><h2>Built for agents,<br>not for suppliers.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Speed</h3><p>Quotes arrive in hours, not days. The brief is structured before a partner sees it, so there is no back-and-forth on basics.</p></div>
  <div class="p-card"><h3>Margins</h3><p>You receive net rates from the source with one clear Grounder fee. Add your margin in the dashboard and send a client-ready proposal.</p></div>
  <div class="p-card"><h3>White-label</h3><p>Itineraries and client dashboards carry your logo and your payment instructions. Grounder stays in the background.</p></div>
  <div class="p-card"><h3>Trust</h3><p>Every partner is vetted for licensing, insurance, references and response times before they see a single request.</p></div>
  <div class="p-card"><h3>24/7 on the ground</h3><p>A local contact in-destination plus the Grounder desk, around the clock, for changes and emergencies.</p></div>
  <div class="p-card"><h3>Privacy</h3><p>Your client details are never shared beyond the matched partners, and supplier names are hidden until they reply to you.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Questions</div><h2>Straight answers.</h2></div><div class="boxc"><div class="faq">
  <details><summary>Do I need an account?</summary><p>No. Send an inquiry and you get a reference and a dashboard link by email. Keep the link to follow quotes and messages.</p></details>
  <details><summary>How fast are quotes?</summary><p>Partners commit to a first response within 48 hours and most reply much sooner. The dashboard shows each partner's status in real time. <em>Verify exact service-level figures before publishing.</em></p></details>
  <details><summary>Who pays whom?</summary><p>You pay Grounder; Grounder pays the local partner. One invoice, one deposit, one set of terms, in the currency shown on the quote.</p></details>
  <details><summary>Can I bring my own DMC?</summary><p>Yes. Recommend them on the Partners page. If they pass vetting they can quote on your requests through Grounder.</p></details>
  <details><summary>What if something goes wrong in destination?</summary><p>Travellers call the local partner's 24/7 line; you call the Grounder desk. We own the resolution with the partner so you do not have to.</p></details>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Try it with a real request.</h2><p>Paste a client email. Grounder reads it and shows you exactly what partners will see.</p>${CTA}</div></section>`
  },
  'for-agents': {
    title: 'For travel agents and advisors — Grounder', desc: 'Net rates, white-label proposals and 24/7 on-ground support from vetted local DMCs in 130+ countries. Built for agents, advisors and tour operators.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">For agents, advisors and tour operators</div><h1>You sell the world.<br>We make sure it runs.</h1><p class="lead">Grounder is the ground partner behind your proposals: local DMCs you can trust, quotes you can compare, and operations you do not have to chase.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/how-it-works">See how it works</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><div class="p-num">Hours</div><h3>Not days to quote</h3><p>Structured briefs and matched partners mean faster, more accurate first quotes. Win the client while the competition is still emailing.</p></div>
  <div class="p-card"><div class="p-num">Net</div><h3>Rates you can mark up</h3><p>Wholesale pricing from the source with one clear Grounder fee. Your margin is yours; set it in the dashboard before anything goes to the client.</p></div>
  <div class="p-card"><div class="p-num">Yours</div><h3>White-label by default</h3><p>Branded itineraries, client dashboards and payment instructions. Your clients see your agency, not ours.</p></div>
  <div class="p-card"><div class="p-num">24/7</div><h3>Help on the ground</h3><p>A vetted local partner in destination and the Grounder desk on call. Flight changes, medical issues, weather: handled.</p></div>
  <div class="p-card"><div class="p-num">1</div><h3>Point of accountability</h3><p>One contract, one invoice, one team responsible for the whole trip, across every country you sell.</p></div>
  <div class="p-card"><div class="p-num">0</div><h3>Supplier admin</h3><p>No onboarding calls, no credit applications per country, no chasing. Send the brief and compare.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Who uses Grounder</div><h2>Made for the way you sell.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Travel agencies and advisors</h3><p>FIT, honeymoons, families, multi-generational trips. Get a quotable itinerary from a local expert without building supplier relationships in every country.</p></div>
  <div class="p-card"><h3>Tour operators</h3><p>Series departures, small groups and custom programmes. Compare ground handlers on the same brief and lock in net rates for the season.</p></div>
  <div class="p-card"><h3>Corporate and MICE planners</h3><p>Incentives, offsites and conferences with reliable transfers, venues and on-site staff. One brief, several local proposals, one accountable partner.</p></div>
  <div class="p-card"><h3>Luxury travel designers</h3><p>Private guides, exceptional properties and access that depends on local relationships. Our partners are selected for exactly that.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Pricing</div><h2>One clear fee.</h2><p>Grounder adds a single service fee to the partner's net rate. It is shown on every quote before you decide. There are no subscriptions and no minimum volumes. <em class="verify">Fee level to be confirmed before launch.</em></p></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Send inquiries</h3><p class="p-big">Free</p><p>Unlimited briefs, matching and quotes. Pay only when you book.</p></div>
  <div class="p-card"><h3>Book through Grounder</h3><p class="p-big">Net rate + fee</p><p>Shown on each quote. You set your own margin on top.</p></div>
  <div class="p-card"><h3>Dashboard and white-label</h3><p class="p-big">Included</p><p>Client proposals, branded itineraries and 24/7 desk with every booking.</p></div>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Send your next request through Grounder.</h2><p>No account, no onboarding. Paste the brief and see who answers.</p>${CTA}</div></section>`
  },
  'partners': {
    title: 'Become a Grounder partner — for local DMCs', desc: 'Local DMCs and ground operators: receive qualified B2B requests from travel agents worldwide. Apply to join the Grounder partner network.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">For local DMCs and ground operators</div><h1>Qualified requests.<br>No sales cost.</h1><p class="lead">Grounder sends you structured briefs from travel agents and operators who are ready to book. You quote, you operate, Grounder handles the agent relationship and payment.</p><div class="p-cta"><a class="btn blue" href="#apply" onclick="document.getElementById('apply').scrollIntoView({behavior:'smooth'});return false">Apply to partner ${ICON.arrow}</a><a class="btn grey" href="#/how-it-works">How Grounder works</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Briefs, not leads</h3><p>Every request arrives with destination, dates, travellers, budget band and style already structured. You decide in minutes whether to quote.</p></div>
  <div class="p-card"><h3>Agents you could not reach</h3><p>Advisors and operators from markets where you have no sales presence, without trade shows or commission-only reps.</p></div>
  <div class="p-card"><h3>Paid by Grounder</h3><p>One counterparty. Deposits and balances are collected by Grounder and paid to you on the agreed schedule.</p></div>
  <div class="p-card"><h3>Your own dashboard</h3><p>Requests, quotes, messages and documents in one supplier dashboard, powered by Hyperporter. No new software to buy.</p></div>
  <div class="p-card"><h3>Fair matching</h3><p>Requests go to a small number of partners that fit the trip. You are never one of fifty on a blast email.</p></div>
  <div class="p-card"><h3>Private until you reply</h3><p>Agents see your company only after you quote. Your rates are never shown to other partners.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Vetting</div><h2>What we look for.</h2><p>Grounder is selective. Partners are reviewed before activation and re-reviewed on performance.</p></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Licensed and insured</h3><p>Valid tour-operator or DMC licence where required, plus public liability insurance appropriate to your services.</p></div>
  <div class="p-card"><h3>Operating track record</h3><p>Typically three or more years of inbound operations and references from two international B2B clients. <em class="verify">Confirm the threshold.</em></p></div>
  <div class="p-card"><h3>24/7 in-destination contact</h3><p>A named person reachable around the clock while a Grounder trip is on the ground.</p></div>
  <div class="p-card"><h3>Response times</h3><p>First response within 48 hours of a request; faster is better and is reflected in matching.</p></div>
  <div class="p-card"><h3>English-speaking operations</h3><p>Quotes, itineraries and messages in clear English. Other languages are a plus.</p></div>
  <div class="p-card"><h3>Transparent pricing</h3><p>Net rates with inclusions, exclusions, payment and cancellation terms stated on every quote.</p></div>
</div></div></div></section>
<section id="apply"><div class="wrap"><div class="sec-head"><div class="kick">Apply</div><h2>Partner with us.</h2><p>Tell us about your company. We reply within five working days. <em class="verify">Confirm the reply time.</em></p></div><div class="boxc"><form class="p-form" id="partner-form" onsubmit="return submitPartner(event)">
  <div class="row2"><div class="f"><label>Company</label><input name="company" required autocomplete="organization"></div><div class="f"><label>Website</label><input name="website" type="url" placeholder="https://" autocomplete="url"></div></div>
  <div class="row2"><div class="f"><label>Country</label><select name="country" required><option value="">Choose a country</option>${NAMES.map(n => '<option>' + esc(n) + '</option>').join('')}<option>Other</option></select></div><div class="f"><label>Cities and regions you operate</label><input name="regions" placeholder="e.g. Cusco, Sacred Valley, Lima"></div></div>
  <div class="f"><label>Services</label><div class="pick" id="p-services">${['Multi-day packages','Accommodation','Transfers','Day tours and guides','MICE and groups','Luxury and private','Adventure','Wildlife'].map(x => '<button type="button" onclick="this.classList.toggle(\'on\')">' + x + '</button>').join('')}</div></div>
  <div class="row2"><div class="f"><label>Years operating inbound</label><input name="years" type="number" min="0" max="99" inputmode="numeric"></div><div class="f"><label>Licence or registration number</label><input name="licence"></div></div>
  <div class="row2"><div class="f"><label>Contact name</label><input name="name" required autocomplete="name"></div><div class="f"><label>Role</label><input name="role" placeholder="e.g. Managing director"></div></div>
  <div class="row2"><div class="f"><label>Work email</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Phone, with country code</label><input name="phone" type="tel" autocomplete="tel"></div></div>
  <div class="f"><label>Anything else</label><textarea name="notes" rows="4" placeholder="Specialities, languages, references, markets you already serve"></textarea></div>
  <div class="p-form-f"><span class="note">Reviewed by the Grounder partner team.</span><button class="btn blue" type="submit">Send application ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="partner-ok" hidden><h3>Application received</h3><p>Thank you. We review every application and reply by email.</p></div>
</form></div></div></section>`
  },
  'about': {
    title: 'About Grounder — the AI-powered global DMC network', desc: 'Grounder is building the world\'s most trusted DMC network: vetted local partners in 130+ countries, matched by AI, operated with one point of accountability.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">About Grounder</div><h1>The world's most trusted<br>DMC network, powered by AI.</h1><p class="lead">Travel agents promise their clients the world. Grounder exists so they can deliver it: vetted local partners everywhere, quotes without the chase, and one team accountable for what happens on the ground.</p><div class="p-cta">${CTA}${CTA_P}</div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Why we exist</div><h2>Ground operations<br>have not changed in decades.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>The old way</h3><p>Find a DMC per country. Email a brief. Wait days. Receive a PDF. Reformat it for the client. Repeat for every destination, and hope the partner answers the phone when something goes wrong at 2 a.m.</p></div>
  <div class="p-card"><h3>The Grounder way</h3><p>One brief, read by AI and matched to vetted partners that fit the trip. Quotes compared in one dashboard. One contract, one invoice, one desk on call. The local expertise stays local; the admin disappears.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Principles</div><h2>What we hold ourselves to.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Vetted, then measured</h3><p>Partners earn their place through licensing, references and response times, and keep it through performance on real trips.</p></div>
  <div class="p-card"><h3>Local experts, not call centres</h3><p>The people who quote and operate your trip live in the destination. AI structures the request; it never replaces them.</p></div>
  <div class="p-card"><h3>Agents stay in control</h3><p>White-label by default, net rates always visible, supplier names private until they reply. Your client relationship stays yours.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Network</div><h2>In numbers.</h2></div><div class="boxc"><div class="p-stats">
  <div><b>130+</b><span>Countries covered</span></div>
  <div><b>[X]</b><span>Vetted local partners <em class="verify">add real count</em></span></div>
  <div><b>[X]</b><span>Agencies served <em class="verify">add real count</em></span></div>
  <div><b>24/7</b><span>On-ground and desk support</span></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Company</div><h2>A Hyperporter company.</h2><p>Grounder is built by the team behind <a href="https://hyperporter.com" target="_blank" rel="noopener">Hyperporter</a>, the operating system for travel businesses. Every Grounder dashboard runs on it. <em class="verify">Add founding year, HQ and leadership once confirmed.</em></p></div></div></section>
<section class="p-final"><div class="wrap"><h2>See it on your own request.</h2><p>The fastest way to understand Grounder is to send a brief.</p>${CTA}</div></section>`
  },
  'privacy': {
    title: 'Privacy policy — Grounder', desc: 'How Grounder collects, uses and protects the details you share.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Legal</div><h1>Privacy policy.</h1><p class="lead">What we collect when you send a request, why, and what you can ask us to do with it.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Last updated 1 November 2026</p>

<h2>Who we are</h2>
<p>Grounder plans tailor-made trips for travel agents, advisors and tour operators, delivered by vetted local partners (DMCs) worldwide. Our address is Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, United Kingdom. We decide how the personal data described here is used and are responsible for it. Write to us about anything on this page at <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>.</p>

<h2>What we collect</h2>
<ul>
  <li><strong>Your enquiry:</strong> what you send through our enquiry form or by email: names, email address, phone number if you give one, travel dates, group size and ages of children, interests, budget band and your message.</li>
  <li><strong>Planning and booking details:</strong> once you ask us to plan or book a trip, what is needed to arrange it, such as names as they appear in passports, dates of birth, arrival and departure details, dietary needs and, only if you choose to tell us, health or access needs.</li>
  <li><strong>Newsletter:</strong> if a newsletter sign-up is offered and you use it, your email address.</li>
  <li><strong>Site usage:</strong> this site runs no analytics or advertising trackers.</li>
</ul>
<p>We do not take payment card details through this site.</p>

<h2>Why we use it, and on what basis</h2>
<ul>
  <li>To answer your enquiry and prepare a proposal, because you asked us to (steps taken at your request before a contract).</li>
  <li>To plan, book and run your trip (performance of our contract with you).</li>
  <li>To handle health or access needs you tell us about, with your explicit consent, which you can withdraw at any time.</li>
  <li>To keep the accounting and booking records the law requires (legal obligation).</li>
  <li>To look after our business, for example to deal with a complaint or a claim (our legitimate interests).</li>
</ul>
<p>We only send you news or offers if you have asked for them, and you can stop them at any time. We never sell your personal data.</p>

<h2>Who we share it with</h2>
<p>Only those who need it: the vetted local partners (DMCs and ground operators) matched to your request, who quote and deliver the trip, and the companies that provide our email, form handling and website hosting. Each receives only what it needs. We may also share data where the law requires it.</p>
<p>This website is hosted by Vercel Inc., which processes the technical data needed to deliver each page, such as your IP address and browser details, in short-lived server logs (kept no more than 30 days). Inquiries you create are kept in your own browser so your dashboard keeps working after a reload, and the contact and partner forms send their details to us by opening a pre-filled email in your own email program.</p>
<p>Your trip takes place outside the country where you may live, so the people delivering it will receive the details they need there. Where the law requires it, we put appropriate safeguards in place for those transfers, such as contractual commitments, or rely on the transfer being necessary to arrange the trip you asked for. You can ask us about them.</p>
<p>Where data protection law requires it, we rely on recognised safeguards such as the European Commission’s standard contractual clauses and the UK International Data Transfer Addendum, adequacy regulations, or the fact that the transfer is necessary to perform the contract you asked us to arrange.</p>

<h2>How long we keep it</h2>
<p>Enquiries that do not lead to a booking are deleted within two years of our last contact. Booking records are kept for as long as tax and accounting law requires, and then deleted. Health and access details are deleted once your trip is over, unless you ask us to keep them for a future trip. Server logs are kept by our hosting provider for no more than 30 days.</p>

<h2>Keeping it safe</h2>
<p>We keep personal data in secure, access-controlled systems and share it only as described here. If something goes wrong that affects your data, we will tell you.</p>

<h2>Your rights</h2>
<p>You can ask us for a copy of your personal data, and ask us to correct it, delete it, limit how we use it, or send it to you or someone else in a portable form. You can object to our using it on the basis of our legitimate interests, and withdraw any consent you have given. Write to <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>; we reply within one month. If you are not happy with our answer, you can complain to the data protection authority in the country where you live or work.</p>
<p>Our supervisory authority is the UK Information Commissioner’s Office (ico.org.uk). If you live in the European Union, you can also complain to the data protection authority of your country.</p>

<h2>Cookies and storage</h2>
<p>See our <a href="#/cookies">cookie policy</a>.</p>

<h2>Changes</h2>
<p>We update this policy when our practices change. The date at the top shows the latest version.</p>

<h2>Children</h2>
<p>This website is for travel professionals and adults. We do not knowingly collect personal data directly from children under 16. Details of children travelling in a group are given to us by the agent or a parent or guardian and are used only to plan and run the trip.</p>

<h2>Contact</h2>
<p>Grounder, Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, United Kingdom. <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'terms': {
    title: 'Booking terms — Grounder', desc: 'The booking terms for trips requested through Grounder.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Legal</div><h1>Booking terms.</h1><p class="lead">The terms for a trip requested through Grounder, from first brief to the traveller coming home.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Last updated 1 November 2026</p>

<h2>About these terms</h2>
<p>These terms apply to every trip arranged by Grounder (“we”, “us”), Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, United Kingdom, and to your use of this website. Please read them before you book. “You” means the agent, advisor or tour operator who sends the request, and the travellers on the booking; the person who makes the booking accepts these terms for the whole group.</p>

<h2>Enquiries and proposals</h2>
<p>Sending an enquiry is free and commits you to nothing. We reply with questions, then a written proposal built for your dates, group and route. Prices shown on this site are guides (“from”) and are not offers; the price of your trip, what it includes and how long the proposal stays open are set out in the proposal. Prices depend on availability until the booking is confirmed.</p>

<h2>Making a booking</h2>
<p>A booking is made when you accept a proposal in writing and pay the deposit stated in it, and we confirm the booking in writing. Your confirmation sets out the trip, the price and the date the balance is due. Please check it and tell us straight away if anything is wrong, including names, which must match your passports.</p>

<h2>Paying for your trip</h2>
<p>A deposit is due when you book and the balance is due before you travel, on the date set out in your proposal and confirmation. If the balance is not paid on time, we may treat the booking as cancelled by you, and the cancellation charges below apply.</p>
<p>Unless your proposal states otherwise, the deposit is 30% of the total price and the balance is due 60 days before departure; if you book within 60 days of departure, the full price is due when you book.</p>

<h2>What is included</h2>
<p>Your proposal and confirmation list exactly what is included: typically accommodation, the meals stated, private transfers and transport, the guiding, activities and entrance or park fees listed, and support before and during the trip. Unless the proposal says otherwise, the price does not include international flights, visas, travel insurance, vaccinations and medical costs, tips, drinks and meals not listed, optional activities and personal expenses.</p>

<h2>Changes you ask for</h2>
<p>We will try to help if you want to change a confirmed booking, but cannot promise to. Changes may carry a cost, including charges from camps, hotels, airlines and other suppliers, and we will tell you what it is before you decide.</p>

<h2>If you cancel</h2>
<p>You can cancel at any time by writing to us; the cancellation takes effect on the day we receive it. Because we commit money to partners on your behalf, unless your proposal states otherwise these charges apply, as a percentage of the total price: more than 60 days before departure, loss of the deposit (30%); 60 to 31 days, 50%; 30 to 15 days, 75%; 14 days or fewer, or if the travellers do not travel, 100%. Where a supplier’s own terms are stricter, for example non-refundable flights, permits or peak-season stays, the proposal will say so and those charges apply instead. Travel insurance may cover cancellation charges.</p>

<h2>If we change or cancel your trip</h2>
<p>Tailor-made travel sometimes needs adjusting. If we have to make a significant change to your trip before you travel, we will tell you as soon as possible and offer you the choice of accepting the change, taking a comparable alternative, or cancelling with a full refund of what you have paid us. We will not cancel your trip after the balance is paid except for reasons beyond our control, and if we do, we will refund what you have paid us.</p>

<h2>Events beyond anyone’s control</h2>
<p>We are not responsible for changes, delays or cancellations caused by events that neither we nor our suppliers could foresee or avoid, such as extreme weather, natural disasters, epidemics, civil unrest, strikes, or official advice against travel. If such an event stops your trip, we will refund what we can recover and help you rearrange.</p>

<h2>Travel insurance</h2>
<p>You must have travel insurance that covers cancellation, medical treatment, repatriation and the activities in your trip, from the moment you book. Please send us the policy details before you travel.</p>

<h2>Passports, visas and health</h2>
<p>You are responsible for a valid passport, any visa you need, the vaccinations and health documents required, and for meeting the entry rules of every country you pass through. We give general information in good faith, but rules change: always check them with official sources and your doctor before you travel.</p>

<h2>During your trip</h2>
<p>Please follow the reasonable instructions of the people looking after you, respect local laws and customs, and tell us before you book about any medical condition, disability or needs that may affect your trip, so we can check that it suits you.</p>

<h2>Our responsibility to you</h2>
<p>We will plan and arrange your trip with reasonable skill and care and are responsible for making sure the arrangements we confirm are provided. We are not responsible where a problem is caused by you, by someone unconnected with your trip, or by events beyond anyone’s control. Where international conventions limit the liability of airlines, other carriers or hotels, our liability is limited in the same way. Nothing in these terms limits liability for death or personal injury caused by negligence, or anything else that cannot be limited by law.</p>

<h2>If something goes wrong</h2>
<p>If you have a problem during your trip, tell the person looking after you and contact us straight away, so we can try to put it right on the spot. If you are still unhappy, write to <a href="mailto:grounder@tourground.com">grounder@tourground.com</a> within 28 days of coming home; we will reply within 28 days.</p>

<h2>Using this website</h2>
<p>We describe places, seasons and entry rules as carefully as we can, but these change. The text and design of this site belong to us; photographs belong to their owners and are used with permission or under their licences. We link to other sites for information and are not responsible for their content.</p>

<h2>Data protection</h2>
<p>We use personal details only as described in our <a href="#/privacy">privacy policy</a>.</p>

<h2>Law</h2>
<p>These terms, and any dispute arising from them, are governed by the laws of England and Wales, and the courts of England and Wales have jurisdiction. If you live elsewhere, this does not take away any mandatory rights you have under the consumer law of your country of residence, and you may also bring proceedings there.</p>

<h2>Contact</h2>
<p>Grounder, Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, United Kingdom. <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'cookies': {
    title: 'Cookie policy — Grounder', desc: 'What the Grounder website stores in your browser.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Legal</div><h1>Cookie policy.</h1><p class="lead">What this site stores in your browser, listed exactly.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Last updated 1 November 2026</p>

<h2>What cookies are</h2>
<p>Cookies are small files a website saves in your browser. Local and session storage are similar stores inside your browser. Both can remember choices or count visits.</p>

<h2>What this site stores</h2>
<table class="legal-table"><thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Lasts</th></tr></thead><tbody><tr><td><code>grounder.inquiries.v1</code></td><td>Local storage, set by this site</td><td>Keeps the inquiries you send, so a reference opens your dashboard after a reload on the same device</td><td>Until you clear your browser storage</td></tr><tr><td><code>grounder.inquiries.v1.last</code></td><td>Local storage, set by this site</td><td>Remembers your most recent inquiry reference</td><td>Until you clear your browser storage</td></tr><tr><td><code>grounder.partners</code></td><td>Local storage, set by this site</td><td>Keeps a copy of a partner application you submit on this device</td><td>Until you clear your browser storage</td></tr></tbody></table>
<p>This site sets no cookies of its own and runs no analytics, advertising or social-media trackers.</p>

<h2>Your consent</h2>
<p>The storage listed above is strictly necessary for a feature you choose to use, so it does not need consent. If we ever add cookies or storage that are not strictly necessary, such as analytics, we will ask you first and list them here. You can delete cookies and site storage at any time in your browser’s settings.</p>

<h2>Other requests your browser makes</h2>
<p>None. Fonts, images and scripts are served from this site. The dashboard pages run inside this site.</p>

<h2>Changes to this policy</h2>
<p>If the website starts storing anything new, we will update this page, and the date at the top, before it does.</p>

<h2>Contact</h2>
<p>Questions about this policy: <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'contact': {
    title: 'Contact Grounder — get a quote or partner with us', desc: 'Get an instant quote for any destination, apply as a local partner, or send the Grounder team a message.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Contact</div><h1>Talk to Grounder.</h1><p class="lead">For a trip, the fastest route is an inquiry: it reaches matched local partners immediately. For everything else, write to us below.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3 p-contact">
  <div class="p-card"><h3>Get a quote</h3><p>Paste a client brief or fill in the form. Quotes arrive in your dashboard.</p>${CTA}</div>
  <div class="p-card"><h3>Become a partner</h3><p>Local DMCs and ground operators: apply to receive qualified requests.</p>${CTA_P}</div>
  <div class="p-card"><h3>Check an inquiry</h3><p>Have a reference? Open your dashboard to see quotes and messages.</p><button class="btn grey" onclick="openCheck()">Check an inquiry</button></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Message us</div><h2>Anything else.</h2><p>Email <a href="mailto:${GX_CONFIG.contactEmail}">${GX_CONFIG.contactEmail}</a>. Our address: ${esc(GX_CONFIG.address)}.</p></div><div class="boxc"><form class="p-form" id="contact-form" onsubmit="return submitContact(event)">
  <div class="row2"><div class="f"><label>Your name</label><input name="name" required autocomplete="name"></div><div class="f"><label>Company</label><input name="company" autocomplete="organization"></div></div>
  <div class="row2"><div class="f"><label>Email</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Topic</label><select name="topic"><option>Trip inquiry</option><option>Partnership</option><option>Press</option><option>Something else</option></select></div></div>
  <div class="f"><label>Message</label><textarea name="message" rows="5" required></textarea></div>
  <div class="p-form-f"><span class="note">We reply by email.</span><button class="btn blue" type="submit">Send message ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="contact-ok" hidden><h3>Message sent</h3><p>Thanks. We will reply to the address you gave.</p></div>
</form></div></div></section>`
  }
};
let curPage = null;
function renderPage(key){
  const P = PAGES[key]; if(!P) return false;
  if(curPage !== key){ $('page').innerHTML = P.html(); curPage = key; }
  document.title = P.title; setMeta(P.desc);
  document.body.classList.add('is-page'); $('nav').classList.add('solid');
  return true;
}
function setMeta(d){ const m = document.querySelector('meta[name="description"]'); if(m) m.setAttribute('content', d); const o = document.querySelector('meta[property="og:description"]'); if(o) o.setAttribute('content', d); }
const HOME_TITLE = document.title, HOME_DESC = (document.querySelector('meta[name="description"]') || {}).content || '';

/* ───────── forms ───────── */
function formData(f){ const o = {}; new FormData(f).forEach((v, k) => o[k] = String(v).trim()); return o; }
async function submitPartner(e){
  e.preventDefault(); const f = e.target, d = formData(f); d.services = [...f.querySelectorAll('#p-services button.on')].map(b => b.textContent);
  const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  try{ const all = JSON.parse(localStorage.getItem('grounder.partners') || '[]'); all.push(Object.assign({at:Date.now()}, d)); localStorage.setItem('grounder.partners', JSON.stringify(all)); }catch(x){}
  const r = await gxSend('partner-application', d); btn.disabled = false;
  if(!r.ok) location.href = gxMailto('Grounder partner application: ' + d.company, Object.entries(d).map(([k, v]) => k + ': ' + (Array.isArray(v) ? v.join(', ') : v)));
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('partner-ok').hidden = false; toast(r.ok ? 'Application sent' : 'Opening your email app to send the application');
  return false;
}
async function submitContact(e){
  e.preventDefault(); const f = e.target, d = formData(f); const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  const r = await gxSend('contact', d); btn.disabled = false;
  if(!r.ok) location.href = gxMailto('Grounder — ' + d.topic + ' from ' + d.name, [d.message, '', d.name, d.company, d.email]);
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('contact-ok').hidden = false; toast(r.ok ? 'Message sent' : 'Opening your email app to send the message');
  return false;
}
/* ───────── smooth transitions between views ───────── */
let curView = null, leaveTimer = 0;
function viewOf(h){ if(/^#\/track\//.test(h)) return 'track'; if(h === '#/explore') return 'explore'; const m = /^#\/([a-z-]+)$/.exec(h); return m && PAGES[m[1]] ? 'page:' + m[1] : 'home'; }
const visibleMain = () => [...document.querySelectorAll('main.landing, main.explore, main.page, main.track')].find(m => getComputedStyle(m).display !== 'none');
function routeSmooth(){
  const next = viewOf(location.hash), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(curView === null || next === curView || reduce){ curView = next; route(); return; }
  clearTimeout(leaveTimer); document.body.classList.add('is-leaving');
  leaveTimer = setTimeout(() => {
    curView = next; route(); document.body.classList.remove('is-leaving');
    const m = visibleMain(); if(m){ m.classList.remove('view-in'); void m.offsetWidth; m.classList.add('view-in'); m.addEventListener('animationend', () => m.classList.remove('view-in'), {once:true}); }
  }, 180);
}
addEventListener('hashchange', routeSmooth);
$('foot-year').textContent = new Date().getFullYear();
loadInqs();
