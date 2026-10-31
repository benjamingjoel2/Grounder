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
const CTA = '<button class="btn blue" onclick="openInquiry(null,[],false,null,\'describe\')">Sofort-Angebot anfordern ' + ICON.arrow + '</button>';
const CTA_P = '<a class="btn blue" href="#/partners">Partner werden ' + ICON.arrow + '</a>';
const POPULAR = ['Italy','Japan','Peru','Kenya','Thailand','Portugal','Morocco','Tanzania','Iceland','Vietnam','Greece','Costa Rica'];
const chip = n => '<a class="pchip" href="#/explore" onclick="pendingSel=\'' + n.replace(/'/g, "\\'") + '\'">' + esc(n) + '</a>';
const PAGES = {
  'how-it-works': {
    title: 'So funktioniert’s — Grounder', desc: 'Ein Briefing senden. Grounder ordnet es geprüften lokalen DMCs zu, sammelt ihre Angebote in einem Dashboard und begleitet die Reise vor Ort.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">So funktioniert’s</div><h1>Ein Briefing rein.<br>Geprüfte Angebote raus.</h1><p class="lead">Grounder ersetzt das Hinterherschreiben bei DMCs. Fügen Sie die Kundenanfrage ein, lassen Sie die KI sie lesen und vergleichen Sie Angebote lokaler Partner an einem Ort.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/explore">Reiseziele entdecken</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-steps">
  <div class="p-step"><div class="step-n">1</div><h3>Briefing senden</h3><p>Fügen Sie die Kunden-E-Mail ein oder füllen Sie ein kurzes Formular aus. Grounder erkennt Ziel, Termine, Reisende, Budget und Stil und fragt nur nach, was fehlt.</p><small>Dauert etwa 30 Sekunden. Kein Konto nötig.</small></div>
  <div class="p-step"><div class="step-n">2</div><h3>KI-Zuordnung</h3><p>Unsere Zuordnung wählt lokale Partner, die zur Reise passen, nicht nur zum Land: Tempo, Stil, Hotelniveau und Sprache. Anbieternamen bleiben vertraulich, bis sie antworten.</p><small>In der Regel 3 bis 5 geprüfte DMCs pro Anfrage.</small></div>
  <div class="p-step"><div class="step-n">3</div><h3>Angebote vergleichen</h3><p>Angebote landen nebeneinander in Ihrem Grounder-Dashboard: Reiseverlauf, Leistungen, Preis pro Person, Zahlungs- und Stornobedingungen. Fragen in einem Verlauf stellen.</p><small>Nettopreise, bereit für Ihren Aufschlag.</small></div>
  <div class="p-step"><div class="step-n">4</div><h3>Wir setzen um</h3><p>Wählen Sie ein Angebot, und der lokale Partner führt die Reise durch: Guides, Transfers, Hotels, Aktivitäten. Der Grounder-Desk bleibt für Sie und Ihre Reisenden rund um die Uhr erreichbar.</p><small>Eine verantwortliche Stelle.</small></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Was Sie bekommen</div><h2>Gemacht für Reisebüros,<br>nicht für Anbieter.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Tempo</h3><p>Angebote kommen in Stunden, nicht in Tagen. Das Briefing ist strukturiert, bevor ein Partner es sieht, also kein Hin und Her bei den Grundlagen.</p></div>
  <div class="p-card"><h3>Margen</h3><p>Sie erhalten Nettopreise direkt von der Quelle mit einer klaren Grounder-Gebühr. Marge im Dashboard ergänzen und ein kundenfertiges Angebot versenden.</p></div>
  <div class="p-card"><h3>White Label</h3><p>Reiseverläufe und Kunden-Dashboards tragen Ihr Logo und Ihre Zahlungshinweise. Grounder bleibt im Hintergrund.</p></div>
  <div class="p-card"><h3>Vertrauen</h3><p>Jeder Partner wird auf Lizenz, Versicherung, Referenzen und Reaktionszeiten geprüft, bevor er eine einzige Anfrage sieht.</p></div>
  <div class="p-card"><h3>Rund um die Uhr vor Ort</h3><p>Ein lokaler Kontakt vor Ort plus der Grounder-Desk, rund um die Uhr, für Änderungen und Notfälle.</p></div>
  <div class="p-card"><h3>Datenschutz</h3><p>Ihre Kundendaten werden nie über die zugeordneten Partner hinaus geteilt, und Anbieternamen bleiben verborgen, bis sie Ihnen antworten.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Fragen</div><h2>Klare Antworten.</h2></div><div class="boxc"><div class="faq">
  <details><summary>Brauche ich ein Konto?</summary><p>Nein. Senden Sie eine Anfrage, und Sie erhalten eine Referenz und einen Dashboard-Link per E-Mail. Behalten Sie den Link, um Angebote und Nachrichten zu verfolgen.</p></details>
  <details><summary>Wie schnell kommen Angebote?</summary><p>Partner sagen eine erste Antwort innerhalb von 48 Stunden zu, die meisten antworten viel früher. Das Dashboard zeigt den Status jedes Partners in Echtzeit. <em>Genaue Service-Level-Zahlen vor Veröffentlichung prüfen.</em></p></details>
  <details><summary>Wer bezahlt wen?</summary><p>Sie zahlen an Grounder, Grounder zahlt den lokalen Partner. Eine Rechnung, eine Anzahlung, ein Satz Bedingungen, in der Währung des Angebots.</p></details>
  <details><summary>Kann ich meine eigene DMC mitbringen?</summary><p>Ja. Empfehlen Sie sie auf der Partnerseite. Besteht sie unsere Prüfung, kann sie über Grounder auf Ihre Anfragen anbieten.</p></details>
  <details><summary>Was, wenn vor Ort etwas schiefgeht?</summary><p>Reisende rufen die 24/7-Nummer des lokalen Partners an, Sie den Grounder-Desk. Wir klären es mit dem Partner, damit Sie es nicht müssen.</p></details>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Testen Sie es mit einer echten Anfrage.</h2><p>Fügen Sie eine Kunden-E-Mail ein. Grounder liest sie und zeigt Ihnen genau, was die Partner sehen.</p>${CTA}</div></section>`
  },
  'for-agents': {
    title: 'Für Reisebüros und Reiseberater — Grounder', desc: 'Nettopreise, White-Label-Angebote und Betreuung vor Ort rund um die Uhr durch geprüfte lokale DMCs in über 130 Ländern. Gemacht für Reisebüros, Berater und Veranstalter.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Für Reisebüros, Berater und Veranstalter</div><h1>Sie verkaufen die Welt.<br>Wir sorgen dafür, dass es läuft.</h1><p class="lead">Grounder ist der Partner vor Ort hinter Ihren Angeboten: lokale DMCs, denen Sie vertrauen können, vergleichbare Angebote und eine Durchführung, der Sie nicht hinterherlaufen müssen.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/how-it-works">So funktioniert’s</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><div class="p-num">Stunden</div><h3>Nicht Tage bis zum Angebot</h3><p>Strukturierte Briefings und passende Partner bedeuten schnellere, genauere erste Angebote. Gewinnen Sie den Kunden, während die Konkurrenz noch E-Mails schreibt.</p></div>
  <div class="p-card"><div class="p-num">Netto</div><h3>Preise mit Spielraum für Ihren Aufschlag</h3><p>Großhandelspreise direkt von der Quelle mit einer klaren Grounder-Gebühr. Ihre Marge gehört Ihnen; legen Sie sie im Dashboard fest, bevor etwas an den Kunden geht.</p></div>
  <div class="p-card"><div class="p-num">Ihres</div><h3>Standardmäßig White Label</h3><p>Reiseverläufe, Kunden-Dashboards und Zahlungshinweise in Ihrem Branding. Ihre Kunden sehen Ihre Agentur, nicht unsere.</p></div>
  <div class="p-card"><div class="p-num">24/7</div><h3>Hilfe vor Ort</h3><p>Ein geprüfter lokaler Partner vor Ort und der Grounder-Desk auf Abruf. Flugänderungen, medizinische Probleme, Wetter: erledigt.</p></div>
  <div class="p-card"><div class="p-num">1</div><h3>Verantwortliche Stelle</h3><p>Ein Vertrag, eine Rechnung, ein Team, das für die ganze Reise verantwortlich ist, in jedem Land, das Sie verkaufen.</p></div>
  <div class="p-card"><div class="p-num">0</div><h3>Anbieterverwaltung</h3><p>Keine Onboarding-Calls, keine Kreditanträge pro Land, kein Hinterherlaufen. Briefing senden und vergleichen.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Wer Grounder nutzt</div><h2>Gemacht für die Art, wie Sie verkaufen.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Reisebüros und Reiseberater</h3><p>Individualreisen, Hochzeitsreisen, Familien, Mehrgenerationenreisen. Erhalten Sie einen kalkulierbaren Reiseverlauf von lokalen Experten, ohne in jedem Land Anbieterbeziehungen aufzubauen.</p></div>
  <div class="p-card"><h3>Reiseveranstalter</h3><p>Serienabfahrten, Kleingruppen und individuelle Programme. Vergleichen Sie Agenturen vor Ort auf dasselbe Briefing und sichern Sie Nettopreise für die Saison.</p></div>
  <div class="p-card"><h3>Firmen- und MICE-Planer</h3><p>Incentives, Offsites und Konferenzen mit verlässlichen Transfers, Locations und Personal vor Ort. Ein Briefing, mehrere lokale Angebote, ein verantwortlicher Partner.</p></div>
  <div class="p-card"><h3>Luxusreise-Designer</h3><p>Private Guides, außergewöhnliche Häuser und Zugänge, die von lokalen Beziehungen abhängen. Genau dafür sind unsere Partner ausgewählt.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Preise</div><h2>Eine klare Gebühr.</h2><p>Grounder schlägt eine einzige Servicegebühr auf den Nettopreis des Partners auf. Sie steht auf jedem Angebot, bevor Sie entscheiden. Keine Abos, keine Mindestmengen. <em class="verify">Höhe der Gebühr vor dem Start zu bestätigen.</em></p></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Anfragen senden</h3><p class="p-big">Kostenlos</p><p>Unbegrenzt Briefings, Zuordnungen und Angebote. Sie zahlen nur bei Buchung.</p></div>
  <div class="p-card"><h3>Über Grounder buchen</h3><p class="p-big">Nettopreis + Gebühr</p><p>Auf jedem Angebot ausgewiesen. Ihre eigene Marge legen Sie obendrauf.</p></div>
  <div class="p-card"><h3>Dashboard und White Label</h3><p class="p-big">Inklusive</p><p>Kundenangebote, Reiseverläufe in Ihrem Branding und 24/7-Desk bei jeder Buchung.</p></div>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Senden Sie Ihre nächste Anfrage über Grounder.</h2><p>Kein Konto, kein Onboarding. Briefing einfügen und sehen, wer antwortet.</p>${CTA}</div></section>`
  },
  'partners': {
    title: 'Grounder-Partner werden — für lokale DMCs', desc: 'Lokale DMCs und Agenturen vor Ort: Erhalten Sie qualifizierte B2B-Anfragen von Reisebüros weltweit. Bewerben Sie sich für das Grounder-Partnernetzwerk.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Für lokale DMCs und Agenturen vor Ort</div><h1>Qualifizierte Anfragen.<br>Keine Vertriebskosten.</h1><p class="lead">Grounder sendet Ihnen strukturierte Briefings von Reisebüros und Veranstaltern, die buchen wollen. Sie kalkulieren und führen durch, Grounder kümmert sich um die Beziehung zum Reisebüro und die Zahlung.</p><div class="p-cta"><a class="btn blue" href="#apply" onclick="document.getElementById('apply').scrollIntoView({behavior:'smooth'});return false">Als Partner bewerben ${ICON.arrow}</a><a class="btn grey" href="#/how-it-works">So funktioniert Grounder</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Briefings statt Leads</h3><p>Jede Anfrage kommt mit Ziel, Terminen, Reisenden, Budgetrahmen und Stil bereits strukturiert. Sie entscheiden in Minuten, ob Sie anbieten.</p></div>
  <div class="p-card"><h3>Reisebüros, die Sie sonst nicht erreichen</h3><p>Berater und Veranstalter aus Märkten, in denen Sie keinen Vertrieb haben, ohne Messen oder reine Provisionsvertreter.</p></div>
  <div class="p-card"><h3>Bezahlt von Grounder</h3><p>Ein Vertragspartner. Anzahlungen und Restzahlungen zieht Grounder ein und zahlt sie Ihnen nach vereinbartem Zeitplan aus.</p></div>
  <div class="p-card"><h3>Ihr eigenes Dashboard</h3><p>Anfragen, Angebote, Nachrichten und Dokumente in einem Anbieter-Dashboard, betrieben von Hyperporter. Keine neue Software nötig.</p></div>
  <div class="p-card"><h3>Faire Zuordnung</h3><p>Anfragen gehen an wenige Partner, die zur Reise passen. Sie sind nie einer von fünfzig in einer Massenmail.</p></div>
  <div class="p-card"><h3>Vertraulich, bis Sie antworten</h3><p>Reisebüros sehen Ihre Firma erst nach Ihrem Angebot. Ihre Preise werden anderen Partnern nie gezeigt.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Prüfung</div><h2>Worauf wir achten.</h2><p>Grounder ist wählerisch. Partner werden vor der Freischaltung geprüft und anhand ihrer Leistung erneut bewertet.</p></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Lizenziert und versichert</h3><p>Gültige Veranstalter- oder DMC-Lizenz, wo erforderlich, plus eine zu Ihren Leistungen passende Haftpflichtversicherung.</p></div>
  <div class="p-card"><h3>Nachweisbare Erfahrung</h3><p>In der Regel mindestens drei Jahre Incoming-Erfahrung und Referenzen von zwei internationalen B2B-Kunden. <em class="verify">Schwelle bestätigen.</em></p></div>
  <div class="p-card"><h3>Kontakt vor Ort rund um die Uhr</h3><p>Eine feste Ansprechperson, rund um die Uhr erreichbar, solange eine Grounder-Reise läuft.</p></div>
  <div class="p-card"><h3>Reaktionszeiten</h3><p>Erste Antwort innerhalb von 48 Stunden; schneller ist besser und fließt in die Zuordnung ein.</p></div>
  <div class="p-card"><h3>Englischsprachige Abwicklung</h3><p>Angebote, Reiseverläufe und Nachrichten in klarem Englisch. Weitere Sprachen sind ein Plus.</p></div>
  <div class="p-card"><h3>Transparente Preise</h3><p>Nettopreise mit Leistungen, Ausschlüssen, Zahlungs- und Stornobedingungen auf jedem Angebot.</p></div>
</div></div></div></section>
<section id="apply"><div class="wrap"><div class="sec-head"><div class="kick">Bewerben</div><h2>Werden Sie Partner.</h2><p>Erzählen Sie uns von Ihrer Firma. Wir antworten innerhalb von fünf Werktagen. <em class="verify">Antwortzeit bestätigen.</em></p></div><div class="boxc"><form class="p-form" id="partner-form" onsubmit="return submitPartner(event)">
  <div class="row2"><div class="f"><label>Unternehmen</label><input name="company" required autocomplete="organization"></div><div class="f"><label>Website</label><input name="website" type="url" placeholder="https://" autocomplete="url"></div></div>
  <div class="row2"><div class="f"><label>Land</label><select name="country" required><option value="">Land wählen</option>${NAMES.map(n => '<option>' + esc(n) + '</option>').join('')}<option>Andere</option></select></div><div class="f"><label>Städte und Regionen, in denen Sie tätig sind</label><input name="regions" placeholder="z. B. Cusco, Heiliges Tal, Lima"></div></div>
  <div class="f"><label>Leistungen</label><div class="pick" id="p-services">${['Mehrtägige Reisen','Unterkünfte','Transfers','Tagestouren und Guides','MICE und Gruppen','Luxus und privat','Abenteuer','Wildtiere'].map(x => '<button type="button" onclick="this.classList.toggle(\'on\')">' + x + '</button>').join('')}</div></div>
  <div class="row2"><div class="f"><label>Jahre im Incoming</label><input name="years" type="number" min="0" max="99" inputmode="numeric"></div><div class="f"><label>Lizenz- oder Registernummer</label><input name="licence"></div></div>
  <div class="row2"><div class="f"><label>Ansprechperson</label><input name="name" required autocomplete="name"></div><div class="f"><label>Funktion</label><input name="role" placeholder="z. B. Geschäftsführer"></div></div>
  <div class="row2"><div class="f"><label>Geschäftliche E-Mail</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Telefon, mit Ländervorwahl</label><input name="phone" type="tel" autocomplete="tel"></div></div>
  <div class="f"><label>Sonstiges</label><textarea name="notes" rows="4" placeholder="Spezialgebiete, Sprachen, Referenzen, Märkte, die Sie bereits bedienen"></textarea></div>
  <div class="p-form-f"><span class="note">Geprüft vom Grounder-Partnerteam.</span><button class="btn blue" type="submit">Bewerbung senden ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="partner-ok" hidden><h3>Bewerbung erhalten</h3><p>Danke. Wir prüfen jede Bewerbung und antworten per E-Mail.</p></div>
</form></div></div></section>`
  },
  'about': {
    title: 'Über Grounder — das KI-gestützte globale DMC-Netzwerk', desc: 'Grounder baut das vertrauenswürdigste DMC-Netzwerk der Welt: geprüfte lokale Partner in über 130 Ländern, per KI zugeordnet, mit einer verantwortlichen Stelle.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Über Grounder</div><h1>Das vertrauenswürdigste<br>DMC-Netzwerk der Welt, mit KI.</h1><p class="lead">Reisebüros versprechen ihren Kunden die Welt. Grounder sorgt dafür, dass sie es halten können: geprüfte lokale Partner überall, Angebote ohne Nachhaken und ein Team, das für alles vor Ort verantwortlich ist.</p><div class="p-cta">${CTA}${CTA_P}</div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Warum es uns gibt</div><h2>Die Abwicklung vor Ort<br>hat sich seit Jahrzehnten nicht verändert.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Der alte Weg</h3><p>Pro Land eine DMC finden. Ein Briefing mailen. Tage warten. Ein PDF bekommen. Es für den Kunden umformatieren. Für jedes Ziel wiederholen und hoffen, dass der Partner ans Telefon geht, wenn um 2 Uhr nachts etwas schiefläuft.</p></div>
  <div class="p-card"><h3>Der Grounder-Weg</h3><p>Ein Briefing, von KI gelesen und geprüften, passenden Partnern zugeordnet. Angebote in einem Dashboard verglichen. Ein Vertrag, eine Rechnung, ein erreichbarer Desk. Die Expertise bleibt lokal, der Verwaltungsaufwand verschwindet.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Grundsätze</div><h2>Woran wir uns messen lassen.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Geprüft, dann gemessen</h3><p>Partner verdienen sich ihren Platz durch Lizenz, Referenzen und Reaktionszeiten und behalten ihn durch ihre Leistung auf echten Reisen.</p></div>
  <div class="p-card"><h3>Lokale Experten statt Callcenter</h3><p>Die Menschen, die Ihre Reise kalkulieren und durchführen, leben vor Ort. Die KI strukturiert die Anfrage, ersetzt sie aber nie.</p></div>
  <div class="p-card"><h3>Reisebüros behalten die Kontrolle</h3><p>Standardmäßig White Label, Nettopreise immer sichtbar, Anbieternamen vertraulich, bis sie antworten. Ihre Kundenbeziehung bleibt Ihre.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Netzwerk</div><h2>In Zahlen.</h2></div><div class="boxc"><div class="p-stats">
  <div><b>130+</b><span>Abgedeckte Länder</span></div>
  <div><b>[X]</b><span>Geprüfte lokale Partner <em class="verify">echte Zahl ergänzen</em></span></div>
  <div><b>[X]</b><span>Betreute Agenturen <em class="verify">echte Zahl ergänzen</em></span></div>
  <div><b>24/7</b><span>Betreuung vor Ort und per Desk</span></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Unternehmen</div><h2>Ein Unternehmen von Hyperporter.</h2><p>Grounder wird vom Team hinter <a href="https://hyperporter.com" target="_blank" rel="noopener">Hyperporter</a>entwickelt, dem Betriebssystem für Reiseunternehmen. Jedes Grounder-Dashboard läuft darauf. <em class="verify">Gründungsjahr, Sitz und Geschäftsführung ergänzen, sobald bestätigt.</em></p></div></div></section>
<section class="p-final"><div class="wrap"><h2>Testen Sie es mit Ihrer eigenen Anfrage.</h2><p>Am schnellsten verstehen Sie Grounder, wenn Sie ein Briefing senden.</p>${CTA}</div></section>`
  },
  'privacy': {
    title: 'Datenschutzerklärung — Grounder', desc: 'Wie Grounder die Angaben erhebt, nutzt und schützt, die Sie uns mitteilen.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Rechtliches</div><h1>Datenschutzerklärung.</h1><p class="lead">Was wir erheben, wenn Sie eine Anfrage senden, warum, und was Sie von uns verlangen können.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Zuletzt aktualisiert am 30. Oktober 2026</p>

<h2>Wer wir sind</h2>
<p>Grounder plant maßgeschneiderte Reisen für Reisebüros, Reiseberater und Veranstalter, durchgeführt von geprüften lokalen Partnern (DMCs) weltweit. Unsere Adresse lautet Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Vereinigtes Königreich. Wir entscheiden, wie die hier beschriebenen personenbezogenen Daten verwendet werden, und sind dafür verantwortlich. Schreiben Sie uns zu allem auf dieser Seite an <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>.</p>

<h2>Was wir erheben</h2>
<ul>
  <li><strong>Ihre Anfrage:</strong> was Sie uns über das Anfrageformular oder per E-Mail senden: Namen, E-Mail-Adresse, Telefonnummer, falls angegeben, Reisedaten, Gruppengröße und Alter der Kinder, Interessen, Budgetrahmen und Ihre Nachricht.</li>
  <li><strong>Angaben zur Planung und Buchung:</strong> sobald Sie uns bitten, eine Reise zu planen oder zu buchen, was dafür nötig ist, etwa Namen wie im Pass, Geburtsdaten, An- und Abreisedaten, Ernährungsbedürfnisse und, nur wenn Sie es uns mitteilen möchten, gesundheitliche Bedürfnisse oder Anforderungen an Barrierefreiheit.</li>
  <li><strong>Newsletter:</strong> wenn eine Newsletter-Anmeldung angeboten wird und Sie sie nutzen, Ihre E-Mail-Adresse.</li>
  <li><strong>Nutzung der Website:</strong> diese Website nutzt keine Analyse- oder Werbe-Tracker.</li>
</ul>
<p>Über diese Website nehmen wir keine Kartendaten entgegen.</p>

<h2>Wofür wir sie nutzen und auf welcher Grundlage</h2>
<ul>
  <li>Um Ihre Anfrage zu beantworten und ein Angebot zu erstellen, weil Sie uns darum gebeten haben (vorvertragliche Maßnahmen auf Ihre Anfrage).</li>
  <li>Um Ihre Reise zu planen, zu buchen und durchzuführen (Erfüllung unseres Vertrags mit Ihnen).</li>
  <li>Um gesundheitliche Bedürfnisse oder Anforderungen an Barrierefreiheit zu berücksichtigen, die Sie uns mitteilen, mit Ihrer ausdrücklichen Einwilligung, die Sie jederzeit widerrufen können.</li>
  <li>Um die gesetzlich vorgeschriebenen Buchhaltungs- und Buchungsunterlagen aufzubewahren (rechtliche Verpflichtung).</li>
  <li>Um unser Geschäft zu führen, etwa bei einer Beschwerde oder einem Anspruch (unser berechtigtes Interesse).</li>
</ul>
<p>Neuigkeiten oder Angebote senden wir Ihnen nur, wenn Sie danach gefragt haben, und Sie können sie jederzeit abbestellen. Wir verkaufen Ihre personenbezogenen Daten nie.</p>

<h2>An wen wir sie weitergeben</h2>
<p>Nur an diejenigen, die sie brauchen: die geprüften lokalen Partner (DMCs und Agenturen vor Ort), die Ihrer Anfrage zugeordnet sind und die Reise kalkulieren und durchführen, sowie die Unternehmen, die unsere E-Mail, Formularverarbeitung und das Website-Hosting bereitstellen. Jeder erhält nur, was er braucht. Wo das Gesetz es verlangt, können wir Daten ebenfalls weitergeben.</p>
<p>Ihre Reise findet außerhalb Ihres Wohnsitzlandes statt, daher erhalten die Menschen, die sie vor Ort durchführen, die nötigen Angaben dort. Wo das Gesetz es verlangt, treffen wir geeignete Garantien für diese Übermittlungen, etwa vertragliche Zusagen, oder stützen uns darauf, dass die Übermittlung für die gewünschte Reise erforderlich ist. Sie können uns dazu jederzeit fragen.</p>

<h2>Wie lange wir sie aufbewahren</h2>
<p>Anfragen, die nicht zu einer Buchung führen, werden innerhalb von zwei Jahren nach unserem letzten Kontakt gelöscht. Buchungsunterlagen werden so lange aufbewahrt, wie es Steuer- und Handelsrecht verlangen, und danach gelöscht. Gesundheits- und Barrierefreiheitsangaben werden nach Ende Ihrer Reise gelöscht, es sei denn, Sie bitten uns, sie für eine künftige Reise aufzubewahren.</p>

<h2>Sicherheit Ihrer Daten</h2>
<p>Wir speichern personenbezogene Daten in sicheren Systemen mit Zugriffskontrolle und geben sie nur wie hier beschrieben weiter. Geht etwas schief, das Ihre Daten betrifft, informieren wir Sie.</p>

<h2>Ihre Rechte</h2>
<p>Sie können eine Kopie Ihrer personenbezogenen Daten verlangen und uns bitten, sie zu berichtigen, zu löschen, ihre Nutzung einzuschränken oder sie Ihnen oder einem Dritten in einem übertragbaren Format zu senden. Sie können der Nutzung auf Grundlage unseres berechtigten Interesses widersprechen und jede erteilte Einwilligung widerrufen. Schreiben Sie an <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>; wir antworten innerhalb eines Monats. Sind Sie mit unserer Antwort nicht zufrieden, können Sie sich bei der Datenschutzbehörde des Landes beschweren, in dem Sie leben oder arbeiten.</p>

<h2>Cookies und Speicher</h2>
<p>Siehe unsere <a href="#/cookies">Cookie-Richtlinie</a>.</p>

<h2>Änderungen</h2>
<p>Wir aktualisieren diese Erklärung, wenn sich unsere Praxis ändert. Das Datum oben zeigt die aktuelle Fassung.</p>

</div></div></div></section>`
  },
  'terms': {
    title: 'Buchungsbedingungen — Grounder', desc: 'Die Buchungsbedingungen für Reisen, die über Grounder angefragt werden.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Rechtliches</div><h1>Buchungsbedingungen.</h1><p class="lead">Die Bedingungen für eine über Grounder angefragte Reise, vom ersten Briefing bis zur Heimkehr der Reisenden.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Zuletzt aktualisiert am 30. Oktober 2026</p>

<h2>Über diese Bedingungen</h2>
<p>Diese Bedingungen gelten für jede von Grounder („wir“, „uns“), Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Vereinigtes Königreich, organisierte Reise sowie für Ihre Nutzung dieser Website. Bitte lesen Sie sie vor der Buchung. „Sie“ meint das Reisebüro, den Reiseberater oder Veranstalter, der die Anfrage sendet, und die Reisenden der Buchung; wer bucht, akzeptiert diese Bedingungen für die ganze Gruppe.</p>

<h2>Anfragen und Angebote</h2>
<p>Eine Anfrage ist kostenlos und unverbindlich. Wir antworten mit Fragen und dann mit einem schriftlichen Angebot für Ihre Termine, Ihre Gruppe und Ihre Route. Die Preise auf dieser Website sind Richtwerte („ab“) und keine Angebote; Preis, Leistungen und Gültigkeit stehen im Angebot. Bis zur Bestätigung der Buchung hängen die Preise von der Verfügbarkeit ab.</p>

<h2>Buchung</h2>
<p>Eine Buchung kommt zustande, wenn Sie ein Angebot schriftlich annehmen, die darin genannte Anzahlung leisten und wir die Buchung schriftlich bestätigen. Ihre Bestätigung nennt die Reise, den Preis und das Fälligkeitsdatum der Restzahlung. Bitte prüfen Sie sie und melden Sie Fehler sofort, auch bei den Namen, die mit Ihren Pässen übereinstimmen müssen.</p>

<h2>Bezahlung Ihrer Reise</h2>
<p>Bei der Buchung ist eine Anzahlung fällig, der Restbetrag vor der Reise zu dem in Angebot und Bestätigung genannten Datum. Wird der Restbetrag nicht rechtzeitig gezahlt, können wir die Buchung als von Ihnen storniert behandeln, und die unten genannten Stornokosten fallen an.</p>

<h2>Änderungen auf Ihren Wunsch</h2>
<p>Wir versuchen zu helfen, wenn Sie eine bestätigte Buchung ändern möchten, können es aber nicht versprechen. Änderungen können Kosten verursachen, auch durch Camps, Hotels, Fluggesellschaften und andere Anbieter; wir nennen Ihnen diese, bevor Sie entscheiden.</p>

<h2>Wenn Sie stornieren</h2>
<p>Sie können jederzeit schriftlich stornieren. Dann fallen Stornokosten an: Sie steigen, je näher der Reisetermin rückt, und spiegeln die Kosten wider, die wir und unsere Anbieter nicht zurückerhalten. Die Kosten für Ihre Reise stehen in Angebot und Bestätigung. Ihre Reiseversicherung kann sie abdecken.</p>

<h2>Wenn wir Ihre Reise ändern oder absagen</h2>
<p>Maßgeschneiderte Reisen müssen manchmal angepasst werden. Müssen wir Ihre Reise vor Abreise wesentlich ändern, sagen wir es Ihnen so früh wie möglich und lassen Sie wählen: die Änderung annehmen, eine vergleichbare Alternative wählen oder mit voller Erstattung des Gezahlten stornieren. Nach Zahlung des Restbetrags sagen wir Ihre Reise nur aus Gründen ab, die außerhalb unserer Kontrolle liegen, und erstatten Ihnen dann, was Sie gezahlt haben.</p>

<h2>Ereignisse außerhalb jeder Kontrolle</h2>
<p>Wir sind nicht verantwortlich für Änderungen, Verspätungen oder Absagen durch Ereignisse, die weder wir noch unsere Anbieter vorhersehen oder vermeiden konnten, etwa extremes Wetter, Naturkatastrophen, Epidemien, Unruhen, Streiks oder amtliche Reisewarnungen. Verhindert ein solches Ereignis Ihre Reise, erstatten wir, was wir zurückerhalten können, und helfen bei der Neuplanung.</p>

<h2>Reiseversicherung</h2>
<p>Ab der Buchung brauchen Sie eine Reiseversicherung, die Rücktritt, medizinische Behandlung, Rücktransport und die Aktivitäten Ihrer Reise abdeckt. Bitte senden Sie uns die Policendaten vor der Abreise.</p>

<h2>Pässe, Visa und Gesundheit</h2>
<p>Sie sind verantwortlich für einen gültigen Pass, nötige Visa, die geforderten Impfungen und Gesundheitsdokumente sowie die Einhaltung der Einreisebestimmungen jedes Landes, durch das Sie reisen. Wir geben allgemeine Informationen nach bestem Wissen, aber Regeln ändern sich: Prüfen Sie sie vor der Reise immer bei offiziellen Stellen und Ihrem Arzt.</p>

<h2>Während Ihrer Reise</h2>
<p>Bitte folgen Sie den angemessenen Anweisungen der Menschen, die sich um Sie kümmern, respektieren Sie örtliche Gesetze und Bräuche und informieren Sie uns vor der Buchung über Erkrankungen, Behinderungen oder Bedürfnisse, die Ihre Reise beeinflussen könnten, damit wir prüfen können, ob sie zu Ihnen passt.</p>

<h2>Unsere Verantwortung Ihnen gegenüber</h2>
<p>Wir planen und organisieren Ihre Reise mit angemessener Sachkenntnis und Sorgfalt und sorgen dafür, dass die bestätigten Leistungen erbracht werden. Wir haften nicht, wenn ein Problem von Ihnen, von Dritten ohne Bezug zur Reise oder durch Ereignisse außerhalb jeder Kontrolle verursacht wird. Wo internationale Abkommen die Haftung von Fluggesellschaften, anderen Beförderern oder Hotels begrenzen, ist unsere Haftung ebenso begrenzt. Nichts in diesen Bedingungen beschränkt die Haftung für fahrlässig verursachten Tod oder Personenschaden oder für anderes, das gesetzlich nicht beschränkt werden kann.</p>

<h2>Wenn etwas schiefgeht</h2>
<p>Haben Sie während der Reise ein Problem, sagen Sie es der Person, die sich um Sie kümmert, und melden Sie sich sofort bei uns, damit wir es vor Ort beheben können. Sind Sie danach noch unzufrieden, schreiben Sie an <a href="mailto:grounder@tourground.com">grounder@tourground.com</a> innerhalb von 28 Tagen nach Ihrer Rückkehr; wir antworten innerhalb von 28 Tagen.</p>

<h2>Nutzung dieser Website</h2>
<p>Wir beschreiben Orte, Jahreszeiten und Einreisebestimmungen so sorgfältig wie möglich, doch sie ändern sich. Texte und Gestaltung dieser Website gehören uns; Fotos gehören ihren Urhebern und werden mit Erlaubnis oder unter ihren Lizenzen verwendet. Links zu anderen Websites dienen der Information; für deren Inhalte sind wir nicht verantwortlich.</p>

<h2>Anwendbares Recht</h2>
<p>Diese Bedingungen unterliegen dem Recht am Sitz von Grounder, und Streitigkeiten werden vor den dortigen Gerichten verhandelt. Ihre Rechte nach dem Verbraucherrecht Ihres Wohnsitzlandes bleiben davon unberührt.</p>

<h2>Kontakt</h2>
<p>Grounder, Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Vereinigtes Königreich. <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'cookies': {
    title: 'Cookie-Richtlinie — Grounder', desc: 'Was die Grounder-Website in Ihrem Browser speichert.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Rechtliches</div><h1>Cookie-Richtlinie.</h1><p class="lead">Was diese Website in Ihrem Browser speichert, genau aufgelistet.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Zuletzt aktualisiert am 30. Oktober 2026</p>

<h2>Was Cookies sind</h2>
<p>Cookies sind kleine Dateien, die eine Website in Ihrem Browser ablegt. Lokaler Speicher und Sitzungsspeicher sind ähnliche Speicher in Ihrem Browser. Beide können Einstellungen speichern oder Besuche zählen.</p>

<h2>Was diese Website speichert</h2>
<table class="legal-table"><thead><tr><th scope="col">Name</th><th scope="col">Art</th><th scope="col">Zweck</th><th scope="col">Dauer</th></tr></thead><tbody><tr><td><code>grounder.inquiries.v1</code></td><td>Lokaler Speicher, von dieser Website gesetzt</td><td>Speichert Ihre gesendeten Anfragen, damit eine Referenz Ihr Dashboard nach einem Neuladen auf demselben Gerät öffnet</td><td>Bis Sie Ihren Browserspeicher leeren</td></tr><tr><td><code>grounder.inquiries.v1.last</code></td><td>Lokaler Speicher, von dieser Website gesetzt</td><td>Merkt sich die Referenz Ihrer letzten Anfrage</td><td>Bis Sie Ihren Browserspeicher leeren</td></tr></tbody></table>
<p>Diese Website setzt keine eigenen Cookies und nutzt keine Analyse-, Werbe- oder Social-Media-Tracker.</p>

<h2>Ihre Einwilligung</h2>
<p>Der oben genannte Speicher ist für eine Funktion, die Sie bewusst nutzen, unbedingt erforderlich und braucht daher keine Einwilligung. Sollten wir je Cookies oder Speicher hinzufügen, die nicht unbedingt erforderlich sind, etwa für Analysen, fragen wir Sie vorher und führen sie hier auf. Sie können Cookies und Website-Daten jederzeit in Ihren Browsereinstellungen löschen.</p>

<h2>Weitere Anfragen Ihres Browsers</h2>
<p>Keine. Schriften, Bilder und Skripte werden von dieser Website ausgeliefert. Die Dashboard-Seiten laufen innerhalb dieser Website.</p>

<h2>Kontakt</h2>
<p>Fragen zu dieser Richtlinie: <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'contact': {
    title: 'Grounder kontaktieren — Angebot anfordern oder Partner werden', desc: 'Fordern Sie ein Sofort-Angebot für jedes Ziel an, bewerben Sie sich als lokaler Partner oder schreiben Sie dem Grounder-Team.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Kontakt</div><h1>Sprechen Sie mit Grounder.</h1><p class="lead">Für eine Reise ist eine Anfrage der schnellste Weg: Sie erreicht sofort die passenden lokalen Partner. Für alles andere schreiben Sie uns unten.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3 p-contact">
  <div class="p-card"><h3>Angebot anfordern</h3><p>Fügen Sie ein Kundenbriefing ein oder füllen Sie das Formular aus. Angebote kommen in Ihr Dashboard.</p>${CTA}</div>
  <div class="p-card"><h3>Partner werden</h3><p>Lokale DMCs und Agenturen vor Ort: Bewerben Sie sich für qualifizierte Anfragen.</p>${CTA_P}</div>
  <div class="p-card"><h3>Anfrage prüfen</h3><p>Sie haben eine Referenz? Öffnen Sie Ihr Dashboard für Angebote und Nachrichten.</p><button class="btn grey" onclick="openCheck()">Anfrage prüfen</button></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Schreiben Sie uns</div><h2>Alles andere.</h2><p>E-Mail <a href="mailto:${GX_CONFIG.contactEmail}">${GX_CONFIG.contactEmail}</a>. Unsere Adresse: ${esc(GX_CONFIG.address)}.</p></div><div class="boxc"><form class="p-form" id="contact-form" onsubmit="return submitContact(event)">
  <div class="row2"><div class="f"><label>Ihr Name</label><input name="name" required autocomplete="name"></div><div class="f"><label>Unternehmen</label><input name="company" autocomplete="organization"></div></div>
  <div class="row2"><div class="f"><label>E-Mail</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Thema</label><select name="topic"><option>Reiseanfrage</option><option>Partnerschaft</option><option>Presse</option><option>Etwas anderes</option></select></div></div>
  <div class="f"><label>Nachricht</label><textarea name="message" rows="5" required></textarea></div>
  <div class="p-form-f"><span class="note">Wir antworten per E-Mail.</span><button class="btn blue" type="submit">Nachricht senden ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="contact-ok" hidden><h3>Nachricht gesendet</h3><p>Danke. Wir antworten an die angegebene Adresse.</p></div>
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
  if(!r.ok) location.href = gxMailto('Grounder-Partnerbewerbung: ' + d.company, Object.entries(d).map(([k, v]) => k + ': ' + (Array.isArray(v) ? v.join(', ') : v)));
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('partner-ok').hidden = false; toast(r.ok ? 'Bewerbung gesendet' : 'Ihr E-Mail-Programm wird geöffnet, um die Bewerbung zu senden');
  return false;
}
async function submitContact(e){
  e.preventDefault(); const f = e.target, d = formData(f); const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  const r = await gxSend('contact', d); btn.disabled = false;
  if(!r.ok) location.href = gxMailto('Grounder — ' + d.topic + ' from ' + d.name, [d.message, '', d.name, d.company, d.email]);
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('contact-ok').hidden = false; toast(r.ok ? 'Nachricht gesendet' : 'Ihr E-Mail-Programm wird geöffnet, um die Nachricht zu senden');
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
