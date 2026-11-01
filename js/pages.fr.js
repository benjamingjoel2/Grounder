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
const CTA = '<button class="btn blue" onclick="openInquiry(null,[],false,null,\'describe\')">Devis instantané ' + ICON.arrow + '</button>';
const CTA_P = '<a class="btn blue" href="#/partners">Devenez partenaire ' + ICON.arrow + '</a>';
const POPULAR = ['Italy','Japan','Peru','Kenya','Thailand','Portugal','Morocco','Tanzania','Iceland','Vietnam','Greece','Costa Rica'];
const chip = n => '<a class="pchip" href="#/explore" onclick="pendingSel=\'' + n.replace(/'/g, "\\'") + '\'">' + esc(n) + '</a>';
const PAGES = {
  'how-it-works': {
    title: 'Comment ça marche — Grounder', desc: 'Envoyez un seul brief. Grounder le transmet à des DMC locaux vérifiés, rassemble leurs devis dans un tableau de bord et gère le voyage sur place.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Comment ça marche</div><h1>Un brief envoyé.<br>Des devis vérifiés en retour.</h1><p class="lead">Grounder met fin aux relances par e-mail auprès des DMC. Collez la demande de votre client, laissez l’IA la lire et comparez les offres des partenaires locaux au même endroit.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/explore">Explorer les destinations</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-steps">
  <div class="p-step"><div class="step-n">1</div><h3>Envoyez le brief</h3><p>Collez l’e-mail du client ou remplissez un court formulaire. Grounder identifie destination, dates, voyageurs, budget et style, et ne demande que ce qui manque.</p><small>Environ 30 secondes. Aucun compte nécessaire.</small></div>
  <div class="p-step"><div class="step-n">2</div><h3>Mise en relation par l’IA</h3><p>Notre système choisit les partenaires locaux adaptés au voyage, pas seulement au pays : rythme, style, niveau d’hôtel et langue. Les noms des fournisseurs restent confidentiels jusqu’à leur réponse.</p><small>En général 3 à 5 DMC vérifiés par demande.</small></div>
  <div class="p-step"><div class="step-n">3</div><h3>Comparez les devis</h3><p>Les offres arrivent côte à côte dans votre tableau de bord Grounder : itinéraire, prestations, prix par personne, conditions de paiement et d’annulation. Posez vos questions dans un seul fil.</p><small>Des tarifs nets, prêts pour votre marge.</small></div>
  <div class="p-step"><div class="step-n">4</div><h3>Nous opérons</h3><p>Choisissez un devis et le partenaire local prend le voyage en main : guides, transferts, hôtels, activités. L’équipe Grounder reste joignable pour vous et vos voyageurs 24 h/24.</p><small>Un seul interlocuteur responsable.</small></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Ce que vous obtenez</div><h2>Conçu pour les agents,<br>pas pour les fournisseurs.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Rapidité</h3><p>Les devis arrivent en quelques heures, pas en plusieurs jours. Le brief est structuré avant qu’un partenaire ne le voie : pas d’allers-retours sur l’essentiel.</p></div>
  <div class="p-card"><h3>Marges</h3><p>Vous recevez des tarifs nets à la source avec des frais Grounder clairs et uniques. Ajoutez votre marge dans le tableau de bord et envoyez une proposition prête pour le client.</p></div>
  <div class="p-card"><h3>Marque blanche</h3><p>Itinéraires et tableaux de bord clients portent votre logo et vos instructions de paiement. Grounder reste en coulisses.</p></div>
  <div class="p-card"><h3>Confiance</h3><p>Chaque partenaire est vérifié (licence, assurance, références, délais de réponse) avant de voir la moindre demande.</p></div>
  <div class="p-card"><h3>24 h/24 sur place</h3><p>Un contact local sur place et l’équipe Grounder, jour et nuit, pour les changements et les urgences.</p></div>
  <div class="p-card"><h3>Confidentialité</h3><p>Les informations de vos clients ne sont jamais partagées au-delà des partenaires sélectionnés, et les noms des fournisseurs restent masqués jusqu’à leur réponse.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Questions</div><h2>Des réponses claires.</h2></div><div class="boxc"><div class="faq">
  <details><summary>Faut-il un compte ?</summary><p>Non. Envoyez une demande et vous recevez une référence et un lien vers votre tableau de bord par e-mail. Conservez ce lien pour suivre devis et messages.</p></details>
  <details><summary>Les devis arrivent-ils vite ?</summary><p>Les partenaires s’engagent à répondre sous 48 heures et la plupart répondent bien plus tôt. Le tableau de bord affiche le statut de chacun en temps réel. <em>Vérifier les chiffres exacts de niveau de service avant publication.</em></p></details>
  <details><summary>Qui paie qui ?</summary><p>Vous payez Grounder ; Grounder paie le partenaire local. Une facture, un acompte, des conditions uniques, dans la devise indiquée sur le devis.</p></details>
  <details><summary>Puis-je travailler avec mon propre DMC ?</summary><p>Oui. Recommandez-le sur la page Partenaires. S’il passe notre vérification, il pourra répondre à vos demandes via Grounder.</p></details>
  <details><summary>Et en cas de problème sur place ?</summary><p>Les voyageurs appellent la ligne 24 h/24 du partenaire local ; vous appelez l’équipe Grounder. Nous gérons la résolution avec le partenaire pour que vous n’ayez pas à le faire.</p></details>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Essayez avec une vraie demande.</h2><p>Collez l’e-mail d’un client. Grounder le lit et vous montre exactement ce que verront les partenaires.</p>${CTA}</div></section>`
  },
  'for-agents': {
    title: 'Pour les agents et conseillers voyage — Grounder', desc: 'Tarifs nets, propositions en marque blanche et assistance sur place 24 h/24 par des DMC locaux vérifiés dans plus de 130 pays. Conçu pour les agents, conseillers et tour-opérateurs.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Pour les agents, conseillers et tour-opérateurs</div><h1>Vous vendez le monde.<br>Nous veillons à ce que tout fonctionne.</h1><p class="lead">Grounder est le partenaire terrain derrière vos propositions : des DMC locaux de confiance, des devis comparables et des opérations que vous n’avez pas à relancer.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/how-it-works">Voir comment ça marche</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><div class="p-num">Des heures</div><h3>Pas des jours pour un devis</h3><p>Des briefs structurés et des partenaires bien choisis, c’est des premiers devis plus rapides et plus justes. Remportez le client pendant que la concurrence en est encore aux e-mails.</p></div>
  <div class="p-card"><div class="p-num">Net</div><h3>Des tarifs sur lesquels prendre votre marge</h3><p>Des prix de gros à la source avec des frais Grounder clairs et uniques. Votre marge vous appartient : fixez-la dans le tableau de bord avant tout envoi au client.</p></div>
  <div class="p-card"><div class="p-num">À vous</div><h3>Marque blanche par défaut</h3><p>Itinéraires, tableaux de bord clients et instructions de paiement à vos couleurs. Vos clients voient votre agence, pas la nôtre.</p></div>
  <div class="p-card"><div class="p-num">24/7</div><h3>De l’aide sur place</h3><p>Un partenaire local vérifié sur place et l’équipe Grounder joignable. Changements de vol, soucis médicaux, météo : c’est géré.</p></div>
  <div class="p-card"><div class="p-num">1</div><h3>Interlocuteur responsable</h3><p>Un contrat, une facture, une équipe responsable de tout le voyage, dans chaque pays que vous vendez.</p></div>
  <div class="p-card"><div class="p-num">0</div><h3>Administratif fournisseurs</h3><p>Pas d’appels d’intégration, pas de demandes de crédit par pays, pas de relances. Envoyez le brief et comparez.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Qui utilise Grounder</div><h2>Pensé pour votre façon de vendre.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Agences et conseillers voyage</h3><p>Voyages individuels, de noces, en famille, multigénérationnels. Obtenez un itinéraire chiffrable par un expert local sans tisser de relations fournisseurs dans chaque pays.</p></div>
  <div class="p-card"><h3>Tour-opérateurs</h3><p>Départs en série, petits groupes et programmes sur mesure. Comparez les réceptifs sur un même brief et fixez vos tarifs nets pour la saison.</p></div>
  <div class="p-card"><h3>Organisateurs d’événements d’entreprise et MICE</h3><p>Incentives, séminaires et conférences avec transferts, lieux et personnel sur place fiables. Un brief, plusieurs propositions locales, un partenaire responsable.</p></div>
  <div class="p-card"><h3>Créateurs de voyages de luxe</h3><p>Guides privés, établissements d’exception et accès qui reposent sur des relations locales. Nos partenaires sont choisis précisément pour cela.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Tarifs</div><h2>Des frais clairs et uniques.</h2><p>Grounder ajoute des frais de service uniques au tarif net du partenaire. Ils figurent sur chaque devis avant votre décision. Pas d’abonnement, pas de volume minimum. <em class="verify">Montant des frais à confirmer avant le lancement.</em></p></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Envoyer des demandes</h3><p class="p-big">Gratuit</p><p>Briefs, mises en relation et devis illimités. Vous ne payez qu’à la réservation.</p></div>
  <div class="p-card"><h3>Réserver via Grounder</h3><p class="p-big">Tarif net + frais</p><p>Indiqué sur chaque devis. Vous ajoutez votre propre marge.</p></div>
  <div class="p-card"><h3>Tableau de bord et marque blanche</h3><p class="p-big">Inclus</p><p>Propositions clients, itinéraires à vos couleurs et assistance 24 h/24 avec chaque réservation.</p></div>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Envoyez votre prochaine demande via Grounder.</h2><p>Pas de compte, pas d’intégration. Collez le brief et voyez qui répond.</p>${CTA}</div></section>`
  },
  'partners': {
    title: 'Devenir partenaire Grounder — pour les DMC locaux', desc: 'DMC et opérateurs locaux : recevez des demandes B2B qualifiées d’agents de voyage du monde entier. Postulez pour rejoindre le réseau de partenaires Grounder.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Pour les DMC et opérateurs locaux</div><h1>Des demandes qualifiées.<br>Aucun coût commercial.</h1><p class="lead">Grounder vous envoie des briefs structurés d’agents et de voyagistes prêts à réserver. Vous chiffrez, vous opérez ; Grounder gère la relation avec l’agent et le paiement.</p><div class="p-cta"><a class="btn blue" href="#apply" onclick="document.getElementById('apply').scrollIntoView({behavior:'smooth'});return false">Devenir partenaire ${ICON.arrow}</a><a class="btn grey" href="#/how-it-works">Le fonctionnement de Grounder</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Des briefs, pas des prospects</h3><p>Chaque demande arrive avec destination, dates, voyageurs, budget et style déjà structurés. Vous décidez en quelques minutes si vous chiffrez.</p></div>
  <div class="p-card"><h3>Des agents hors de votre portée</h3><p>Des conseillers et voyagistes de marchés où vous n’êtes pas présent commercialement, sans salons ni agents rémunérés à la commission.</p></div>
  <div class="p-card"><h3>Payé par Grounder</h3><p>Un seul interlocuteur. Acomptes et soldes sont encaissés par Grounder et vous sont versés selon le calendrier convenu.</p></div>
  <div class="p-card"><h3>Votre propre tableau de bord</h3><p>Demandes, devis, messages et documents dans un tableau de bord fournisseur, propulsé par Hyperporter. Aucun logiciel à acheter.</p></div>
  <div class="p-card"><h3>Une mise en relation équitable</h3><p>Les demandes vont à un petit nombre de partenaires adaptés au voyage. Vous n’êtes jamais un destinataire parmi cinquante d’un e-mail groupé.</p></div>
  <div class="p-card"><h3>Confidentiel jusqu’à votre réponse</h3><p>Les agents ne voient votre société qu’après votre devis. Vos tarifs ne sont jamais montrés aux autres partenaires.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Vérification</div><h2>Nos critères.</h2><p>Grounder est sélectif. Les partenaires sont évalués avant activation, puis réévalués sur leurs performances.</p></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Licenciés et assurés</h3><p>Licence de tour-opérateur ou de DMC valide lorsque requise, et assurance responsabilité civile adaptée à vos services.</p></div>
  <div class="p-card"><h3>Expérience opérationnelle</h3><p>En général au moins trois ans d’activité réceptive et des références de deux clients B2B internationaux. <em class="verify">Seuil à confirmer.</em></p></div>
  <div class="p-card"><h3>Contact sur place 24 h/24</h3><p>Une personne référente joignable jour et nuit pendant chaque voyage Grounder.</p></div>
  <div class="p-card"><h3>Délais de réponse</h3><p>Première réponse sous 48 heures ; plus vite, c’est mieux, et cela compte dans la mise en relation.</p></div>
  <div class="p-card"><h3>Opérations en anglais</h3><p>Devis, itinéraires et messages dans un anglais clair. D’autres langues sont un plus.</p></div>
  <div class="p-card"><h3>Tarification transparente</h3><p>Tarifs nets avec prestations incluses et exclues, conditions de paiement et d’annulation précisées sur chaque devis.</p></div>
</div></div></div></section>
<section id="apply"><div class="wrap"><div class="sec-head"><div class="kick">Postuler</div><h2>Devenez partenaire.</h2><p>Présentez-nous votre société. Nous répondons sous cinq jours ouvrés. <em class="verify">Délai de réponse à confirmer.</em></p></div><div class="boxc"><form class="p-form" id="partner-form" onsubmit="return submitPartner(event)">
  <div class="row2"><div class="f"><label>Entreprise</label><input name="company" required autocomplete="organization"></div><div class="f"><label>Site web</label><input name="website" type="url" placeholder="https://" autocomplete="url"></div></div>
  <div class="row2"><div class="f"><label>Pays</label><select name="country" required><option value="">Choisir un pays</option>${NAMES.map(n => '<option>' + esc(n) + '</option>').join('')}<option>Autre</option></select></div><div class="f"><label>Villes et régions où vous opérez</label><input name="regions" placeholder="ex. Cusco, Vallée sacrée, Lima"></div></div>
  <div class="f"><label>Services</label><div class="pick" id="p-services">${['Circuits de plusieurs jours','Hébergement','Transferts','Excursions et guides','MICE et groupes','Luxe et privé','Aventure','Faune'].map(x => '<button type="button" onclick="this.classList.toggle(\'on\')">' + x + '</button>').join('')}</div></div>
  <div class="row2"><div class="f"><label>Années d’activité réceptive</label><input name="years" type="number" min="0" max="99" inputmode="numeric"></div><div class="f"><label>Numéro de licence ou d’immatriculation</label><input name="licence"></div></div>
  <div class="row2"><div class="f"><label>Nom du contact</label><input name="name" required autocomplete="name"></div><div class="f"><label>Fonction</label><input name="role" placeholder="ex. Directeur général"></div></div>
  <div class="row2"><div class="f"><label>E-mail professionnel</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Téléphone, avec l’indicatif pays</label><input name="phone" type="tel" autocomplete="tel"></div></div>
  <div class="f"><label>Autre chose</label><textarea name="notes" rows="4" placeholder="Spécialités, langues, références, marchés que vous servez déjà"></textarea></div>
  <div class="p-form-f"><span class="note">Examiné par l’équipe partenaires de Grounder.</span><button class="btn blue" type="submit">Envoyer la candidature ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="partner-ok" hidden><h3>Candidature reçue</h3><p>Merci. Nous examinons chaque candidature et répondons par e-mail.</p></div>
</form></div></div></section>`
  },
  'about': {
    title: 'À propos de Grounder — le réseau mondial de DMC propulsé par l’IA', desc: 'Grounder bâtit le réseau de DMC le plus fiable au monde : des partenaires locaux vérifiés dans plus de 130 pays, sélectionnés par l’IA, avec un seul interlocuteur responsable.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">À propos de Grounder</div><h1>Le réseau de DMC<br>le plus fiable au monde, propulsé par l’IA.</h1><p class="lead">Les agents de voyage promettent le monde à leurs clients. Grounder existe pour qu’ils puissent tenir parole : des partenaires locaux vérifiés partout, des devis sans relances et une équipe responsable de ce qui se passe sur place.</p><div class="p-cta">${CTA}${CTA_P}</div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Notre raison d’être</div><h2>Les opérations sur place<br>n’ont pas changé depuis des décennies.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>L’ancienne méthode</h3><p>Trouver un DMC par pays. Envoyer un brief par e-mail. Attendre des jours. Recevoir un PDF. Le remettre en forme pour le client. Recommencer pour chaque destination, et espérer que le partenaire décroche quand un problème survient à 2 h du matin.</p></div>
  <div class="p-card"><h3>La méthode Grounder</h3><p>Un brief, lu par l’IA et transmis à des partenaires vérifiés adaptés au voyage. Des devis comparés dans un tableau de bord. Un contrat, une facture, une équipe joignable. L’expertise reste locale ; l’administratif disparaît.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Principes</div><h2>Ce à quoi nous nous engageons.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Vérifiés, puis évalués</h3><p>Les partenaires gagnent leur place par leur licence, leurs références et leurs délais de réponse, et la conservent par leurs performances sur des voyages réels.</p></div>
  <div class="p-card"><h3>Des experts locaux, pas des centres d’appels</h3><p>Ceux qui chiffrent et opèrent votre voyage vivent sur place. L’IA structure la demande ; elle ne les remplace jamais.</p></div>
  <div class="p-card"><h3>Les agents gardent la main</h3><p>Marque blanche par défaut, tarifs nets toujours visibles, noms des fournisseurs confidentiels jusqu’à leur réponse. La relation client reste la vôtre.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Réseau</div><h2>En chiffres.</h2></div><div class="boxc"><div class="p-stats">
  <div><b>130+</b><span>Pays couverts</span></div>
  <div><b>[X]</b><span>Partenaires locaux vérifiés <em class="verify">ajouter le chiffre réel</em></span></div>
  <div><b>[X]</b><span>Agences servies <em class="verify">ajouter le chiffre réel</em></span></div>
  <div><b>24/7</b><span>Assistance sur place et à distance</span></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Entreprise</div><h2>Une société Hyperporter.</h2><p>Grounder est développé par l’équipe à l’origine d’ <a href="https://hyperporter.com" target="_blank" rel="noopener">Hyperporter</a>, le système d’exploitation des entreprises du voyage. Chaque tableau de bord Grounder fonctionne avec lui. <em class="verify">Ajouter l’année de création, le siège et la direction une fois confirmés.</em></p></div></div></section>
<section class="p-final"><div class="wrap"><h2>Testez-le sur votre propre demande.</h2><p>Le plus rapide pour comprendre Grounder, c’est d’envoyer un brief.</p>${CTA}</div></section>`
  },
  'privacy': {
    title: 'Politique de confidentialité — Grounder', desc: 'Comment Grounder collecte, utilise et protège les informations que vous nous confiez.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Mentions légales</div><h1>Politique de confidentialité.</h1><p class="lead">Ce que nous collectons lorsque vous envoyez une demande, pourquoi, et ce que vous pouvez nous demander d’en faire.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Dernière mise à jour : 1er novembre 2026</p>

<h2>Qui sommes-nous</h2>
<p>Grounder organise des voyages sur mesure pour les agents, conseillers voyage et tour-opérateurs, réalisés par des partenaires locaux vérifiés (DMC) dans le monde entier. Notre adresse est Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Royaume-Uni. Nous décidons de l’utilisation des données personnelles décrites ici et en sommes responsables. Pour toute question sur cette page, écrivez-nous à <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>.</p>

<h2>Ce que nous collectons</h2>
<ul>
  <li><strong>Votre demande :</strong> ce que vous nous envoyez via notre formulaire ou par e-mail : noms, adresse e-mail, numéro de téléphone si vous le donnez, dates de voyage, taille du groupe et âge des enfants, centres d’intérêt, fourchette de budget et votre message.</li>
  <li><strong>Informations de préparation et de réservation :</strong> dès que vous nous demandez de préparer ou de réserver un voyage, ce qui est nécessaire pour l’organiser : noms tels qu’ils figurent sur les passeports, dates de naissance, informations d’arrivée et de départ, besoins alimentaires et, seulement si vous choisissez de nous les communiquer, besoins de santé ou d’accessibilité.</li>
  <li><strong>Newsletter :</strong> si une inscription à une newsletter est proposée et que vous l’utilisez, votre adresse e-mail.</li>
  <li><strong>Utilisation du site :</strong> ce site n’utilise aucun outil d’analyse ni traceur publicitaire.</li>
</ul>
<p>Nous ne recueillons aucune donnée de carte bancaire via ce site.</p>

<h2>Pourquoi nous les utilisons, et sur quelle base</h2>
<ul>
  <li>Pour répondre à votre demande et préparer une proposition, parce que vous nous l’avez demandé (mesures prises à votre demande avant un contrat).</li>
  <li>Pour préparer, réserver et organiser votre voyage (exécution de notre contrat avec vous).</li>
  <li>Pour tenir compte des besoins de santé ou d’accessibilité que vous nous signalez, avec votre consentement explicite, que vous pouvez retirer à tout moment.</li>
  <li>Pour conserver les documents comptables et de réservation exigés par la loi (obligation légale).</li>
  <li>Pour gérer notre activité, par exemple traiter une réclamation ou un litige (notre intérêt légitime).</li>
</ul>
<p>Nous ne vous envoyons des nouvelles ou des offres que si vous l’avez demandé, et vous pouvez y mettre fin à tout moment. Nous ne vendons jamais vos données personnelles.</p>

<h2>Avec qui nous les partageons</h2>
<p>Uniquement avec ceux qui en ont besoin : les partenaires locaux vérifiés (DMC et opérateurs locaux) sélectionnés pour votre demande, qui chiffrent et réalisent le voyage, et les sociétés qui fournissent notre messagerie, la gestion des formulaires et l’hébergement du site. Chacun ne reçoit que ce dont il a besoin. Nous pouvons aussi partager des données lorsque la loi l’exige.</p>
<p>Ce site est hébergé par Vercel Inc., qui traite les données techniques nécessaires à l’affichage de chaque page, comme votre adresse IP et les informations sur votre navigateur, dans des journaux serveur de courte durée (conservés 30 jours au plus). Les demandes que vous créez sont conservées dans votre propre navigateur pour que votre tableau de bord fonctionne après un rechargement, et les formulaires de contact et de partenariat nous transmettent vos informations en ouvrant un e-mail prérempli dans votre propre messagerie.</p>
<p>Votre voyage se déroule hors de votre pays de résidence ; les personnes qui l’assurent sur place reçoivent donc les informations dont elles ont besoin. Lorsque la loi l’exige, nous mettons en place des garanties appropriées pour ces transferts, comme des engagements contractuels, ou nous nous appuyons sur le fait que le transfert est nécessaire pour organiser le voyage demandé. Vous pouvez nous interroger à ce sujet.</p>
<p>Lorsque la législation sur la protection des données l’exige, nous nous appuyons sur des garanties reconnues, comme les clauses contractuelles types de la Commission européenne et l’avenant britannique sur les transferts internationaux de données, des décisions d’adéquation, ou le fait que le transfert est nécessaire à l’exécution du contrat que vous nous avez demandé d’organiser.</p>

<h2>Durée de conservation</h2>
<p>Les demandes qui n’aboutissent pas à une réservation sont supprimées dans les deux ans suivant notre dernier contact. Les dossiers de réservation sont conservés aussi longtemps que l’exige la législation fiscale et comptable, puis supprimés. Les informations de santé et d’accessibilité sont supprimées à la fin de votre voyage, sauf si vous nous demandez de les conserver pour un prochain séjour. Les journaux du serveur sont conservés par notre hébergeur 30 jours au plus.</p>

<h2>Sécurité des données</h2>
<p>Nous conservons les données personnelles dans des systèmes sécurisés à accès contrôlé et ne les partageons que comme décrit ici. En cas d’incident affectant vos données, nous vous en informerons.</p>

<h2>Vos droits</h2>
<p>Vous pouvez nous demander une copie de vos données personnelles, ainsi que leur rectification, leur suppression, la limitation de leur utilisation ou leur transmission, à vous ou à un tiers, dans un format portable. Vous pouvez vous opposer à leur utilisation fondée sur notre intérêt légitime et retirer tout consentement donné. Écrivez à <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>; nous répondons sous un mois. Si notre réponse ne vous satisfait pas, vous pouvez saisir l’autorité de protection des données du pays où vous vivez ou travaillez.</p>
<p>Notre autorité de contrôle est l’Information Commissioner’s Office du Royaume-Uni (ico.org.uk). Si vous vivez dans l’Union européenne, vous pouvez aussi saisir l’autorité de protection des données de votre pays (en France, la CNIL).</p>

<h2>Cookies et stockage</h2>
<p>Consultez notre <a href="#/cookies">politique relative aux cookies</a>.</p>

<h2>Modifications</h2>
<p>Nous mettons à jour cette politique lorsque nos pratiques évoluent. La date en haut de page indique la dernière version.</p>

<h2>Enfants</h2>
<p>Ce site s’adresse aux professionnels du voyage et aux adultes. Nous ne collectons pas sciemment de données personnelles directement auprès d’enfants de moins de 16 ans. Les informations sur les enfants qui voyagent dans un groupe nous sont transmises par l’agent, un parent ou un tuteur, et servent uniquement à préparer et à organiser le voyage.</p>

<h2>Contact</h2>
<p>Grounder, Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Royaume-Uni. <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'terms': {
    title: 'Conditions de réservation — Grounder', desc: 'Les conditions de réservation des voyages demandés via Grounder.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Mentions légales</div><h1>Conditions de réservation.</h1><p class="lead">Les conditions d’un voyage demandé via Grounder, du premier brief au retour du voyageur.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Dernière mise à jour : 1er novembre 2026</p>

<h2>À propos de ces conditions</h2>
<p>Ces conditions s’appliquent à tout voyage organisé par Grounder (« nous »), Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Royaume-Uni, ainsi qu’à votre utilisation de ce site. Merci de les lire avant de réserver. « Vous » désigne l’agent, le conseiller ou le tour-opérateur qui envoie la demande, ainsi que les voyageurs de la réservation ; la personne qui réserve accepte ces conditions pour l’ensemble du groupe.</p>

<h2>Demandes et propositions</h2>
<p>Envoyer une demande est gratuit et sans engagement. Nous vous répondons par des questions, puis par une proposition écrite construite pour vos dates, votre groupe et votre itinéraire. Les prix affichés sur ce site sont indicatifs (« à partir de ») et ne constituent pas des offres ; le prix de votre voyage, ce qu’il comprend et la durée de validité de la proposition figurent dans la proposition. Les prix dépendent des disponibilités jusqu’à la confirmation de la réservation.</p>

<h2>Réserver</h2>
<p>Une réservation est effective lorsque vous acceptez une proposition par écrit, réglez l’acompte qui y figure et que nous confirmons la réservation par écrit. Votre confirmation précise le voyage, le prix et la date d’échéance du solde. Vérifiez-la et signalez-nous immédiatement toute erreur, notamment dans les noms, qui doivent correspondre à vos passeports.</p>

<h2>Paiement de votre voyage</h2>
<p>Un acompte est dû à la réservation et le solde avant le départ, à la date indiquée dans votre proposition et votre confirmation. Si le solde n’est pas réglé à temps, nous pouvons considérer la réservation comme annulée par vous, et les frais d’annulation ci-dessous s’appliquent.</p>
<p>Sauf mention contraire dans votre proposition, l’acompte s’élève à 30 % du prix total et le solde est dû 60 jours avant le départ ; si vous réservez moins de 60 jours avant le départ, la totalité du prix est due à la réservation.</p>

<h2>Ce qui est compris</h2>
<p>Votre proposition et votre confirmation précisent exactement ce qui est compris : en général l’hébergement, les repas indiqués, les transferts et transports privés, l’accompagnement, les activités et les droits d’entrée ou de parc mentionnés, ainsi qu’une assistance avant et pendant le voyage. Sauf mention contraire dans la proposition, le prix ne comprend pas les vols internationaux, les visas, l’assurance voyage, les vaccins et frais médicaux, les pourboires, les boissons et repas non mentionnés, les activités optionnelles et les dépenses personnelles.</p>

<h2>Modifications à votre demande</h2>
<p>Nous essaierons de vous aider si vous souhaitez modifier une réservation confirmée, sans pouvoir le garantir. Les modifications peuvent avoir un coût, notamment des frais facturés par les hébergements, hôtels, compagnies aériennes et autres prestataires ; nous vous l’indiquerons avant votre décision.</p>

<h2>Si vous annulez</h2>
<p>Vous pouvez annuler à tout moment en nous écrivant ; l’annulation prend effet le jour où nous la recevons. Comme nous engageons des fonds auprès des partenaires pour votre compte, et sauf mention contraire dans votre proposition, les frais suivants s’appliquent, en pourcentage du prix total : plus de 60 jours avant le départ, perte de l’acompte (30 %) ; de 60 à 31 jours, 50 % ; de 30 à 15 jours, 75 % ; 14 jours ou moins, ou si les voyageurs ne partent pas, 100 %. Lorsque les conditions d’un prestataire sont plus strictes, par exemple pour des vols, permis ou séjours en haute saison non remboursables, la proposition le précise et ces frais s’appliquent à la place. L’assurance voyage peut couvrir les frais d’annulation.</p>

<h2>Si nous modifions ou annulons votre voyage</h2>
<p>Un voyage sur mesure doit parfois être ajusté. Si nous devons apporter une modification importante à votre voyage avant le départ, nous vous en informerons dès que possible et vous laisserons le choix : accepter la modification, opter pour une alternative comparable, ou annuler avec le remboursement intégral des sommes versées. Nous n’annulerons pas votre voyage après le paiement du solde, sauf pour des raisons indépendantes de notre volonté ; dans ce cas, nous vous rembourserons les sommes versées.</p>

<h2>Événements indépendants de toute volonté</h2>
<p>Nous ne sommes pas responsables des modifications, retards ou annulations dus à des événements que ni nous ni nos prestataires ne pouvions prévoir ou éviter, comme des conditions météorologiques extrêmes, des catastrophes naturelles, des épidémies, des troubles civils, des grèves ou des avis officiels déconseillant de voyager. Si un tel événement empêche votre voyage, nous vous rembourserons ce que nous pouvons récupérer et vous aiderons à réorganiser.</p>

<h2>Assurance voyage</h2>
<p>Vous devez souscrire, dès la réservation, une assurance voyage couvrant l’annulation, les frais médicaux, le rapatriement et les activités prévues. Merci de nous en transmettre les références avant le départ.</p>

<h2>Passeports, visas et santé</h2>
<p>Il vous appartient de disposer d’un passeport valide, des visas nécessaires, des vaccinations et documents sanitaires exigés, et de respecter les règles d’entrée de chaque pays traversé. Nous donnons des informations générales de bonne foi, mais les règles changent : vérifiez-les toujours auprès des sources officielles et de votre médecin avant de partir.</p>

<h2>Pendant votre voyage</h2>
<p>Merci de suivre les consignes raisonnables des personnes qui s’occupent de vous, de respecter les lois et coutumes locales, et de nous signaler avant de réserver tout problème de santé, handicap ou besoin susceptible d’affecter votre voyage, afin que nous vérifiions qu’il vous convient.</p>

<h2>Notre responsabilité envers vous</h2>
<p>Nous préparons et organisons votre voyage avec compétence et diligence raisonnables, et veillons à ce que les prestations confirmées soient fournies. Nous ne sommes pas responsables lorsqu’un problème est causé par vous, par une personne étrangère à votre voyage ou par des événements indépendants de toute volonté. Lorsque des conventions internationales limitent la responsabilité des compagnies aériennes, d’autres transporteurs ou des hôtels, notre responsabilité est limitée de la même manière. Rien dans ces conditions ne limite la responsabilité en cas de décès ou de dommage corporel dû à une négligence, ni toute autre responsabilité qui ne peut être limitée par la loi.</p>

<h2>En cas de problème</h2>
<p>En cas de problème pendant votre voyage, prévenez la personne qui s’occupe de vous et contactez-nous immédiatement pour que nous tentions d’y remédier sur place. Si vous n’êtes toujours pas satisfait, écrivez à <a href="mailto:grounder@tourground.com">grounder@tourground.com</a> dans les 28 jours suivant votre retour ; nous répondrons sous 28 jours.</p>

<h2>Utilisation de ce site</h2>
<p>Nous décrivons les lieux, les saisons et les règles d’entrée avec le plus grand soin, mais ils évoluent. Les textes et la conception de ce site nous appartiennent ; les photographies appartiennent à leurs auteurs et sont utilisées avec autorisation ou sous leurs licences. Les liens vers d’autres sites sont fournis à titre d’information et nous ne sommes pas responsables de leur contenu.</p>

<h2>Protection des données</h2>
<p>Nous utilisons les données personnelles uniquement comme décrit dans notre <a href="#/privacy">politique de confidentialité</a>.</p>

<h2>Droit applicable</h2>
<p>Les présentes conditions, et tout litige qui en découle, sont régies par le droit de l’Angleterre et du pays de Galles, et les tribunaux d’Angleterre et du pays de Galles sont compétents. Si vous résidez ailleurs, cela ne vous prive d’aucun droit impératif que vous confère le droit de la consommation de votre pays de résidence, et vous pouvez également y engager une procédure.</p>

<h2>Contact</h2>
<p>Grounder, Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Royaume-Uni. <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'cookies': {
    title: 'Politique relative aux cookies — Grounder', desc: 'Ce que le site Grounder enregistre dans votre navigateur.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Mentions légales</div><h1>Politique relative aux cookies.</h1><p class="lead">Ce que ce site enregistre dans votre navigateur, liste exacte.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Dernière mise à jour : 1er novembre 2026</p>

<h2>Qu’est-ce qu’un cookie</h2>
<p>Les cookies sont de petits fichiers qu’un site enregistre dans votre navigateur. Le stockage local et le stockage de session sont des espaces comparables à l’intérieur de votre navigateur. Les uns comme les autres peuvent mémoriser des choix ou compter des visites.</p>

<h2>Ce que ce site enregistre</h2>
<table class="legal-table"><thead><tr><th scope="col">Nom</th><th scope="col">Type</th><th scope="col">Finalité</th><th scope="col">Durée</th></tr></thead><tbody><tr><td><code>grounder.inquiries.v1</code></td><td>Stockage local, défini par ce site</td><td>Conserve les demandes que vous envoyez, pour qu’une référence ouvre votre tableau de bord après un rechargement sur le même appareil</td><td>Jusqu’à ce que vous vidiez le stockage de votre navigateur</td></tr><tr><td><code>grounder.inquiries.v1.last</code></td><td>Stockage local, défini par ce site</td><td>Mémorise la référence de votre dernière demande</td><td>Jusqu’à ce que vous vidiez le stockage de votre navigateur</td></tr><tr><td><code>grounder.partners</code></td><td>Stockage local, défini par ce site</td><td>Conserve une copie de la candidature de partenaire que vous envoyez depuis cet appareil</td><td>Jusqu’à ce que vous vidiez le stockage de votre navigateur</td></tr></tbody></table>
<p>Ce site ne dépose aucun cookie propre et n’utilise aucun outil d’analyse, de publicité ou de suivi des réseaux sociaux.</p>

<h2>Votre consentement</h2>
<p>Le stockage décrit ci-dessus est strictement nécessaire à une fonction que vous choisissez d’utiliser ; il ne requiert donc pas de consentement. Si nous ajoutons un jour des cookies ou un stockage qui ne sont pas strictement nécessaires, comme des outils d’analyse, nous vous le demanderons d’abord et les indiquerons ici. Vous pouvez supprimer les cookies et les données du site à tout moment dans les réglages de votre navigateur.</p>

<h2>Autres requêtes effectuées par votre navigateur</h2>
<p>Aucune. Les polices, images et scripts sont servis par ce site. Les pages de tableau de bord s’exécutent au sein de ce site.</p>

<h2>Modifications de cette politique</h2>
<p>Si le site commence à enregistrer quoi que ce soit de nouveau, nous mettrons cette page à jour, ainsi que la date en haut, au préalable.</p>

<h2>Contact</h2>
<p>Questions sur cette politique : <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'contact': {
    title: 'Contacter Grounder — obtenir un devis ou devenir partenaire', desc: 'Obtenez un devis instantané pour n’importe quelle destination, postulez comme partenaire local ou envoyez un message à l’équipe Grounder.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Contact</div><h1>Parlez à Grounder.</h1><p class="lead">Pour un voyage, le plus rapide est une demande : elle parvient immédiatement aux partenaires locaux sélectionnés. Pour tout le reste, écrivez-nous ci-dessous.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3 p-contact">
  <div class="p-card"><h3>Obtenir un devis</h3><p>Collez le brief d’un client ou remplissez le formulaire. Les devis arrivent dans votre tableau de bord.</p>${CTA}</div>
  <div class="p-card"><h3>Devenir partenaire</h3><p>DMC et opérateurs locaux : postulez pour recevoir des demandes qualifiées.</p>${CTA_P}</div>
  <div class="p-card"><h3>Suivre une demande</h3><p>Vous avez une référence ? Ouvrez votre tableau de bord pour voir devis et messages.</p><button class="btn grey" onclick="openCheck()">Suivre une demande</button></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Écrivez-nous</div><h2>Pour tout le reste.</h2><p>E-mail <a href="mailto:${GX_CONFIG.contactEmail}">${GX_CONFIG.contactEmail}</a>. Notre adresse : ${esc(GX_CONFIG.address)}.</p></div><div class="boxc"><form class="p-form" id="contact-form" onsubmit="return submitContact(event)">
  <div class="row2"><div class="f"><label>Votre nom</label><input name="name" required autocomplete="name"></div><div class="f"><label>Entreprise</label><input name="company" autocomplete="organization"></div></div>
  <div class="row2"><div class="f"><label>E-mail</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Sujet</label><select name="topic"><option>Demande de voyage</option><option>Partenariat</option><option>Presse</option><option>Autre chose</option></select></div></div>
  <div class="f"><label>Message</label><textarea name="message" rows="5" required></textarea></div>
  <div class="p-form-f"><span class="note">Nous répondons par e-mail.</span><button class="btn blue" type="submit">Envoyer le message ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="contact-ok" hidden><h3>Message envoyé</h3><p>Merci. Nous répondrons à l’adresse indiquée.</p></div>
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
  if(!r.ok) location.href = gxMailto('Candidature partenaire Grounder : ' + d.company, Object.entries(d).map(([k, v]) => k + ': ' + (Array.isArray(v) ? v.join(', ') : v)));
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('partner-ok').hidden = false; toast(r.ok ? 'Candidature envoyée' : 'Ouverture de votre messagerie pour envoyer la candidature');
  return false;
}
async function submitContact(e){
  e.preventDefault(); const f = e.target, d = formData(f); const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  const r = await gxSend('contact', d); btn.disabled = false;
  if(!r.ok) location.href = gxMailto('Grounder — ' + d.topic + ' from ' + d.name, [d.message, '', d.name, d.company, d.email]);
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('contact-ok').hidden = false; toast(r.ok ? 'Message envoyé' : 'Ouverture de votre messagerie pour envoyer le message');
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
