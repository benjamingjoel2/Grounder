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
const CTA = '<button class="btn blue" onclick="openInquiry(null,[],false,null,\'describe\')">Cotización instantánea ' + ICON.arrow + '</button>';
const CTA_P = '<a class="btn blue" href="#/partners">Asóciate con nosotros ' + ICON.arrow + '</a>';
const POPULAR = ['Italy','Japan','Peru','Kenya','Thailand','Portugal','Morocco','Tanzania','Iceland','Vietnam','Greece','Costa Rica'];
const chip = n => '<a class="pchip" href="#/explore" onclick="pendingSel=\'' + n.replace(/'/g, "\\'") + '\'">' + esc(n) + '</a>';
const PAGES = {
  'how-it-works': {
    title: 'Cómo funciona — Grounder', desc: 'Envía un solo brief. Grounder lo asigna a DMC locales verificadas, reúne sus cotizaciones en un panel y gestiona el viaje sobre el terreno.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Cómo funciona</div><h1>Un brief de entrada.<br>Cotizaciones verificadas de salida.</h1><p class="lead">Grounder acaba con la persecución de DMC por correo. Pega la solicitud de tu cliente, deja que la IA la lea y compara ofertas de socios locales en un solo lugar.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/explore">Explorar destinos</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-steps">
  <div class="p-step"><div class="step-n">1</div><h3>Envía el brief</h3><p>Pega el correo del cliente o rellena un formulario breve. Grounder lee destino, fechas, viajeros, presupuesto y estilo, y solo pregunta lo que falta.</p><small>Unos 30 segundos. Sin necesidad de cuenta.</small></div>
  <div class="p-step"><div class="step-n">2</div><h3>Asignación por IA</h3><p>Nuestra asignación elige los socios locales que encajan con el viaje, no solo con el país: ritmo, estilo, categoría de hotel e idioma. Los nombres de los proveedores son privados hasta que responden.</p><small>Normalmente de 3 a 5 DMC verificadas por solicitud.</small></div>
  <div class="p-step"><div class="step-n">3</div><h3>Compara cotizaciones</h3><p>Las ofertas llegan una junto a otra a tu panel de Grounder: itinerario, servicios incluidos, precio por persona y condiciones de pago y cancelación. Pregunta en un único hilo.</p><small>Tarifas netas, listas para tu margen.</small></div>
  <div class="p-step"><div class="step-n">4</div><h3>Nosotros operamos</h3><p>Elige una cotización y el socio local se encarga del viaje: guías, traslados, hoteles y actividades. El equipo de Grounder sigue disponible para ti y tus viajeros 24/7.</p><small>Un único responsable.</small></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Lo que obtienes</div><h2>Pensado para agentes,<br>no para proveedores.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Rapidez</h3><p>Las cotizaciones llegan en horas, no en días. El brief se estructura antes de que lo vea un socio, así que no hay idas y venidas con lo básico.</p></div>
  <div class="p-card"><h3>Márgenes</h3><p>Recibes tarifas netas de origen con una única tarifa clara de Grounder. Añade tu margen en el panel y envía una propuesta lista para el cliente.</p></div>
  <div class="p-card"><h3>Marca blanca</h3><p>Los itinerarios y paneles de cliente llevan tu logo y tus instrucciones de pago. Grounder se queda en segundo plano.</p></div>
  <div class="p-card"><h3>Confianza</h3><p>Cada socio se verifica en licencias, seguros, referencias y tiempos de respuesta antes de ver una sola solicitud.</p></div>
  <div class="p-card"><h3>24/7 sobre el terreno</h3><p>Un contacto local en destino y el equipo de Grounder, a todas horas, para cambios y emergencias.</p></div>
  <div class="p-card"><h3>Privacidad</h3><p>Los datos de tus clientes nunca se comparten más allá de los socios asignados, y los nombres de los proveedores se ocultan hasta que te responden.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Preguntas</div><h2>Respuestas claras.</h2></div><div class="boxc"><div class="faq">
  <details><summary>¿Necesito una cuenta?</summary><p>No. Envía una solicitud y recibirás una referencia y un enlace al panel por correo. Guarda el enlace para seguir cotizaciones y mensajes.</p></details>
  <details><summary>¿Qué rapidez tienen las cotizaciones?</summary><p>Los socios se comprometen a responder en 48 horas y la mayoría lo hace mucho antes. El panel muestra el estado de cada socio en tiempo real. <em>Verificar las cifras exactas de nivel de servicio antes de publicar.</em></p></details>
  <details><summary>¿Quién paga a quién?</summary><p>Tú pagas a Grounder y Grounder paga al socio local. Una factura, un depósito y unas condiciones, en la moneda de la cotización.</p></details>
  <details><summary>¿Puedo traer mi propia DMC?</summary><p>Sí. Recomiéndala en la página de Socios. Si supera la verificación, podrá cotizar tus solicitudes a través de Grounder.</p></details>
  <details><summary>¿Y si algo sale mal en destino?</summary><p>Los viajeros llaman a la línea 24/7 del socio local y tú llamas al equipo de Grounder. Nosotros resolvemos con el socio para que tú no tengas que hacerlo.</p></details>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Pruébalo con una solicitud real.</h2><p>Pega el correo de un cliente. Grounder lo lee y te muestra exactamente lo que verán los socios.</p>${CTA}</div></section>`
  },
  'for-agents': {
    title: 'Para agentes y asesores de viajes — Grounder', desc: 'Tarifas netas, propuestas de marca blanca y asistencia sobre el terreno 24/7 de DMC locales verificadas en más de 130 países. Pensado para agentes, asesores y turoperadores.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Para agentes, asesores y turoperadores</div><h1>Tú vendes el mundo.<br>Nosotros nos aseguramos de que funcione.</h1><p class="lead">Grounder es el socio sobre el terreno detrás de tus propuestas: DMC locales de confianza, cotizaciones comparables y operaciones que no tienes que perseguir.</p><div class="p-cta">${CTA}<a class="btn grey" href="#/how-it-works">Ver cómo funciona</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><div class="p-num">Horas</div><h3>No días para cotizar</h3><p>Briefs estructurados y socios bien asignados significan primeras cotizaciones más rápidas y precisas. Gana al cliente mientras la competencia sigue enviando correos.</p></div>
  <div class="p-card"><div class="p-num">Neto</div><h3>Tarifas a las que añadir tu margen</h3><p>Precios mayoristas de origen con una única tarifa clara de Grounder. Tu margen es tuyo: fíjalo en el panel antes de enviar nada al cliente.</p></div>
  <div class="p-card"><div class="p-num">Tuyo</div><h3>Marca blanca por defecto</h3><p>Itinerarios, paneles de cliente e instrucciones de pago con tu marca. Tus clientes ven tu agencia, no la nuestra.</p></div>
  <div class="p-card"><div class="p-num">24/7</div><h3>Ayuda sobre el terreno</h3><p>Un socio local verificado en destino y el equipo de Grounder disponible. Cambios de vuelo, problemas médicos, clima: resuelto.</p></div>
  <div class="p-card"><div class="p-num">1</div><h3>Responsable único</h3><p>Un contrato, una factura y un equipo responsable de todo el viaje, en cada país que vendes.</p></div>
  <div class="p-card"><div class="p-num">0</div><h3>Gestión de proveedores</h3><p>Sin llamadas de alta, sin solicitudes de crédito por país, sin persecuciones. Envía el brief y compara.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Quién usa Grounder</div><h2>Hecho a la medida de cómo vendes.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Agencias y asesores de viajes</h3><p>Viajes individuales, lunas de miel, familias, viajes multigeneracionales. Obtén un itinerario cotizable de un experto local sin crear relaciones con proveedores en cada país.</p></div>
  <div class="p-card"><h3>Turoperadores</h3><p>Salidas en serie, grupos pequeños y programas a medida. Compara receptivos sobre el mismo brief y asegura tarifas netas para la temporada.</p></div>
  <div class="p-card"><h3>Organizadores corporativos y MICE</h3><p>Incentivos, retiros y congresos con traslados, espacios y personal en destino fiables. Un brief, varias propuestas locales y un socio responsable.</p></div>
  <div class="p-card"><h3>Diseñadores de viajes de lujo</h3><p>Guías privados, alojamientos excepcionales y accesos que dependen de relaciones locales. Nuestros socios se eligen precisamente por eso.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Precios</div><h2>Una tarifa clara.</h2><p>Grounder añade una única tarifa de servicio a la tarifa neta del socio. Aparece en cada cotización antes de que decidas. Sin suscripciones ni volúmenes mínimos. <em class="verify">Importe de la tarifa por confirmar antes del lanzamiento.</em></p></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Enviar solicitudes</h3><p class="p-big">Gratis</p><p>Briefs, asignaciones y cotizaciones ilimitados. Solo pagas al reservar.</p></div>
  <div class="p-card"><h3>Reservar a través de Grounder</h3><p class="p-big">Tarifa neta + tarifa</p><p>Se muestra en cada cotización. Tú añades tu propio margen.</p></div>
  <div class="p-card"><h3>Panel y marca blanca</h3><p class="p-big">Incluido</p><p>Propuestas para clientes, itinerarios con tu marca y equipo 24/7 en cada reserva.</p></div>
</div></div></div></section>
<section class="p-final"><div class="wrap"><h2>Envía tu próxima solicitud a través de Grounder.</h2><p>Sin cuenta ni alta. Pega el brief y mira quién responde.</p>${CTA}</div></section>`
  },
  'partners': {
    title: 'Hazte socio de Grounder — para DMC locales', desc: 'DMC y operadores locales: recibid solicitudes B2B cualificadas de agentes de viajes de todo el mundo. Solicita unirte a la red de socios de Grounder.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Para DMC y operadores locales</div><h1>Solicitudes cualificadas.<br>Sin coste comercial.</h1><p class="lead">Grounder te envía briefs estructurados de agentes y operadores listos para reservar. Tú cotizas y operas; Grounder gestiona la relación con el agente y el pago.</p><div class="p-cta"><a class="btn blue" href="#apply" onclick="document.getElementById('apply').scrollIntoView({behavior:'smooth'});return false">Solicitar ser socio ${ICON.arrow}</a><a class="btn grey" href="#/how-it-works">Cómo funciona Grounder</a></div></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Briefs, no leads</h3><p>Cada solicitud llega con destino, fechas, viajeros, presupuesto y estilo ya estructurados. Decides en minutos si cotizas.</p></div>
  <div class="p-card"><h3>Agentes a los que no llegarías</h3><p>Asesores y operadores de mercados donde no tienes presencia comercial, sin ferias ni representantes a comisión.</p></div>
  <div class="p-card"><h3>Pagado por Grounder</h3><p>Una sola contraparte. Grounder cobra depósitos y saldos y te los paga según el calendario acordado.</p></div>
  <div class="p-card"><h3>Tu propio panel</h3><p>Solicitudes, cotizaciones, mensajes y documentos en un panel de proveedor con tecnología de Hyperporter. Sin software nuevo que comprar.</p></div>
  <div class="p-card"><h3>Asignación justa</h3><p>Las solicitudes van a pocos socios que encajan con el viaje. Nunca eres uno de cincuenta en un correo masivo.</p></div>
  <div class="p-card"><h3>Privado hasta que respondes</h3><p>Los agentes solo ven tu empresa después de que cotices. Tus tarifas nunca se muestran a otros socios.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Verificación</div><h2>Lo que buscamos.</h2><p>Grounder es selectivo. Los socios se revisan antes de activarse y se vuelven a evaluar según su desempeño.</p></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>Con licencia y seguro</h3><p>Licencia válida de turoperador o DMC cuando se exija, y seguro de responsabilidad civil adecuado a tus servicios.</p></div>
  <div class="p-card"><h3>Trayectoria operativa</h3><p>Normalmente tres o más años de operaciones receptivas y referencias de dos clientes B2B internacionales. <em class="verify">Confirmar el umbral.</em></p></div>
  <div class="p-card"><h3>Contacto en destino 24/7</h3><p>Una persona de contacto disponible a todas horas mientras dura un viaje de Grounder.</p></div>
  <div class="p-card"><h3>Tiempos de respuesta</h3><p>Primera respuesta en 48 horas; cuanto antes, mejor, y se tiene en cuenta en la asignación.</p></div>
  <div class="p-card"><h3>Operaciones en inglés</h3><p>Cotizaciones, itinerarios y mensajes en un inglés claro. Otros idiomas son un plus.</p></div>
  <div class="p-card"><h3>Precios transparentes</h3><p>Tarifas netas con lo incluido, lo excluido y las condiciones de pago y cancelación en cada cotización.</p></div>
</div></div></div></section>
<section id="apply"><div class="wrap"><div class="sec-head"><div class="kick">Solicitar</div><h2>Asóciate con nosotros.</h2><p>Háblanos de tu empresa. Respondemos en cinco días laborables. <em class="verify">Confirmar el plazo de respuesta.</em></p></div><div class="boxc"><form class="p-form" id="partner-form" onsubmit="return submitPartner(event)">
  <div class="row2"><div class="f"><label>Empresa</label><input name="company" required autocomplete="organization"></div><div class="f"><label>Sitio web</label><input name="website" type="url" placeholder="https://" autocomplete="url"></div></div>
  <div class="row2"><div class="f"><label>País</label><select name="country" required><option value="">Elige un país</option>${NAMES.map(n => '<option>' + esc(n) + '</option>').join('')}<option>Otro</option></select></div><div class="f"><label>Ciudades y regiones donde operas</label><input name="regions" placeholder="p. ej. Cusco, Valle Sagrado, Lima"></div></div>
  <div class="f"><label>Servicios</label><div class="pick" id="p-services">${['Paquetes de varios días','Alojamiento','Traslados','Excursiones y guías','MICE y grupos','Lujo y privado','Aventura','Fauna'].map(x => '<button type="button" onclick="this.classList.toggle(\'on\')">' + x + '</button>').join('')}</div></div>
  <div class="row2"><div class="f"><label>Años en receptivo</label><input name="years" type="number" min="0" max="99" inputmode="numeric"></div><div class="f"><label>Número de licencia o registro</label><input name="licence"></div></div>
  <div class="row2"><div class="f"><label>Nombre de contacto</label><input name="name" required autocomplete="name"></div><div class="f"><label>Cargo</label><input name="role" placeholder="p. ej. Director general"></div></div>
  <div class="row2"><div class="f"><label>Correo de trabajo</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Teléfono, con prefijo del país</label><input name="phone" type="tel" autocomplete="tel"></div></div>
  <div class="f"><label>Algo más</label><textarea name="notes" rows="4" placeholder="Especialidades, idiomas, referencias, mercados que ya atiendes"></textarea></div>
  <div class="p-form-f"><span class="note">Revisado por el equipo de socios de Grounder.</span><button class="btn blue" type="submit">Enviar solicitud ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="partner-ok" hidden><h3>Solicitud recibida</h3><p>Gracias. Revisamos cada solicitud y respondemos por correo.</p></div>
</form></div></div></section>`
  },
  'about': {
    title: 'Sobre Grounder — la red global de DMC impulsada por IA', desc: 'Grounder construye la red de DMC más fiable del mundo: socios locales verificados en más de 130 países, asignados por IA y con un único responsable.',
    html: () => `
<section class="p-hero"><div class="wrap"><div class="kick">Sobre Grounder</div><h1>La red de DMC<br>más fiable del mundo, impulsada por IA.</h1><p class="lead">Los agentes de viajes prometen el mundo a sus clientes. Grounder existe para que puedan cumplirlo: socios locales verificados en todas partes, cotizaciones sin perseguir a nadie y un equipo responsable de lo que ocurre sobre el terreno.</p><div class="p-cta">${CTA}${CTA_P}</div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Por qué existimos</div><h2>Las operaciones sobre el terreno<br>no han cambiado en décadas.</h2></div><div class="boxc"><div class="p-grid2">
  <div class="p-card"><h3>A la antigua</h3><p>Buscar una DMC por país. Enviar un brief por correo. Esperar días. Recibir un PDF. Rehacerlo para el cliente. Repetir con cada destino y esperar que el socio coja el teléfono cuando algo falle a las 2 de la madrugada.</p></div>
  <div class="p-card"><h3>A la manera de Grounder</h3><p>Un brief, leído por IA y asignado a socios verificados que encajan con el viaje. Cotizaciones comparadas en un panel. Un contrato, una factura y un equipo disponible. La experiencia sigue siendo local; el papeleo desaparece.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Principios</div><h2>Nuestros compromisos.</h2></div><div class="boxc"><div class="p-grid3">
  <div class="p-card"><h3>Verificados y luego evaluados</h3><p>Los socios se ganan su sitio con licencias, referencias y tiempos de respuesta, y lo mantienen con su desempeño en viajes reales.</p></div>
  <div class="p-card"><h3>Expertos locales, no centros de llamadas</h3><p>Quienes cotizan y operan tu viaje viven en el destino. La IA estructura la solicitud; nunca los sustituye.</p></div>
  <div class="p-card"><h3>Los agentes mantienen el control</h3><p>Marca blanca por defecto, tarifas netas siempre visibles y nombres de proveedores privados hasta que responden. La relación con tu cliente sigue siendo tuya.</p></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Red</div><h2>En cifras.</h2></div><div class="boxc"><div class="p-stats">
  <div><b>130+</b><span>Países cubiertos</span></div>
  <div><b>[X]</b><span>Socios locales verificados <em class="verify">añadir cifra real</em></span></div>
  <div><b>[X]</b><span>Agencias atendidas <em class="verify">añadir cifra real</em></span></div>
  <div><b>24/7</b><span>Asistencia sobre el terreno y remota</span></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Empresa</div><h2>Una empresa de Hyperporter.</h2><p>Grounder lo desarrolla el equipo de <a href="https://hyperporter.com" target="_blank" rel="noopener">Hyperporter</a>, el sistema operativo para empresas de viajes. Todos los paneles de Grounder funcionan con él. <em class="verify">Añadir año de fundación, sede y dirección cuando se confirmen.</em></p></div></div></section>
<section class="p-final"><div class="wrap"><h2>Compruébalo con tu propia solicitud.</h2><p>La forma más rápida de entender Grounder es enviar un brief.</p>${CTA}</div></section>`
  },
  'privacy': {
    title: 'Política de privacidad — Grounder', desc: 'Cómo recoge, usa y protege Grounder los datos que compartes.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Legal</div><h1>Política de privacidad.</h1><p class="lead">Qué recogemos cuando envías una solicitud, por qué y qué puedes pedirnos que hagamos con ello.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Última actualización: 1 de noviembre de 2026</p>

<h2>Quiénes somos</h2>
<p>Grounder organiza viajes a medida para agentes, asesores de viajes y turoperadores, realizados por socios locales verificados (DMC) en todo el mundo. Nuestra dirección es Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Reino Unido. Decidimos cómo se usan los datos personales descritos aquí y somos responsables de ellos. Escríbenos sobre cualquier punto de esta página a <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>.</p>

<h2>Qué recogemos</h2>
<ul>
  <li><strong>Tu consulta:</strong> lo que nos envías mediante el formulario o por correo: nombres, correo electrónico, teléfono si nos lo das, fechas del viaje, tamaño del grupo y edades de los niños, intereses, franja de presupuesto y tu mensaje.</li>
  <li><strong>Datos de planificación y reserva:</strong> una vez que nos pides planificar o reservar un viaje, lo necesario para organizarlo, como los nombres tal como aparecen en los pasaportes, fechas de nacimiento, datos de llegada y salida, necesidades alimentarias y, solo si decides contárnoslo, necesidades de salud o de accesibilidad.</li>
  <li><strong>Boletín:</strong> si se ofrece la suscripción a un boletín y la usas, tu correo electrónico.</li>
  <li><strong>Uso del sitio:</strong> este sitio no usa analítica ni rastreadores publicitarios.</li>
</ul>
<p>No recogemos datos de tarjetas de pago a través de este sitio.</p>

<h2>Para qué los usamos y con qué base</h2>
<ul>
  <li>Para responder a tu consulta y preparar una propuesta, porque nos lo has pedido (medidas a petición tuya antes de un contrato).</li>
  <li>Para planificar, reservar y organizar tu viaje (ejecución de nuestro contrato contigo).</li>
  <li>Para atender las necesidades de salud o accesibilidad que nos indiques, con tu consentimiento explícito, que puedes retirar en cualquier momento.</li>
  <li>Para conservar los registros contables y de reservas que exige la ley (obligación legal).</li>
  <li>Para gestionar nuestro negocio, por ejemplo atender una queja o una reclamación (nuestro interés legítimo).</li>
</ul>
<p>Solo te enviamos novedades u ofertas si las has pedido, y puedes darte de baja en cualquier momento. Nunca vendemos tus datos personales.</p>

<h2>Con quién los compartimos</h2>
<p>Solo con quien los necesita: los socios locales verificados (DMC y operadores locales) asignados a tu solicitud, que cotizan y realizan el viaje, y las empresas que prestan nuestro correo, la gestión de formularios y el alojamiento web. Cada uno recibe solo lo que necesita. También podemos compartir datos cuando la ley lo exige.</p>
<p>Este sitio está alojado en Vercel Inc., que trata los datos técnicos necesarios para servir cada página, como tu dirección IP y los datos de tu navegador, en registros de servidor de corta duración (conservados 30 días como máximo). Las solicitudes que creas se guardan en tu propio navegador para que tu panel siga funcionando tras recargar, y los formularios de contacto y de socios nos envían tus datos abriendo un correo prerrellenado en tu propio programa de correo.</p>
<p>Tu viaje transcurre fuera del país donde puedes vivir, así que quienes lo hacen posible allí recibirán los datos que necesitan. Cuando la ley lo exige, aplicamos garantías adecuadas para esas transferencias, como compromisos contractuales, o nos basamos en que la transferencia es necesaria para organizar el viaje que has pedido. Puedes preguntarnos por ellas.</p>
<p>Cuando la normativa de protección de datos lo exige, nos apoyamos en garantías reconocidas como las cláusulas contractuales tipo de la Comisión Europea y el anexo británico de transferencias internacionales de datos, decisiones de adecuación o el hecho de que la transferencia sea necesaria para ejecutar el contrato que nos has pedido organizar.</p>

<h2>Cuánto tiempo los conservamos</h2>
<p>Las consultas que no terminan en reserva se eliminan en un plazo de dos años desde nuestro último contacto. Los registros de reserva se conservan el tiempo que exige la normativa fiscal y contable, y después se eliminan. Los datos de salud y accesibilidad se eliminan al terminar tu viaje, salvo que nos pidas conservarlos para un próximo viaje. Nuestro proveedor de alojamiento conserva los registros del servidor 30 días como máximo.</p>

<h2>Seguridad de los datos</h2>
<p>Guardamos los datos personales en sistemas seguros con control de acceso y solo los compartimos como se describe aquí. Si ocurre algo que afecte a tus datos, te lo diremos.</p>

<h2>Tus derechos</h2>
<p>Puedes pedirnos una copia de tus datos personales y que los corrijamos, los eliminemos, limitemos su uso o te los enviemos, a ti o a otra persona, en un formato portable. Puedes oponerte a que los usemos con base en nuestro interés legítimo y retirar cualquier consentimiento que hayas dado. Escribe a <a href="mailto:grounder@tourground.com">grounder@tourground.com</a>; respondemos en el plazo de un mes. Si no estás conforme con nuestra respuesta, puedes reclamar ante la autoridad de protección de datos del país donde vives o trabajas.</p>
<p>Nuestra autoridad de control es la Information Commissioner’s Office del Reino Unido (ico.org.uk). Si vives en la Unión Europea, también puedes reclamar ante la autoridad de protección de datos de tu país (en España, la AEPD).</p>

<h2>Cookies y almacenamiento</h2>
<p>Consulta nuestra <a href="#/cookies">política de cookies</a>.</p>

<h2>Cambios</h2>
<p>Actualizamos esta política cuando cambian nuestras prácticas. La fecha de arriba indica la versión más reciente.</p>

<h2>Niños</h2>
<p>Este sitio está dirigido a profesionales del viaje y a adultos. No recogemos a sabiendas datos personales directamente de menores de 16 años. Los datos de los niños que viajan en un grupo nos los facilita el agente, su padre, madre o tutor, y solo se usan para planificar y realizar el viaje.</p>

<h2>Contacto</h2>
<p>Grounder, Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Reino Unido. <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'terms': {
    title: 'Condiciones de reserva — Grounder', desc: 'Las condiciones de reserva de los viajes solicitados a través de Grounder.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Legal</div><h1>Condiciones de reserva.</h1><p class="lead">Las condiciones de un viaje solicitado a través de Grounder, desde el primer brief hasta la vuelta del viajero.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Última actualización: 1 de noviembre de 2026</p>

<h2>Sobre estas condiciones</h2>
<p>Estas condiciones se aplican a todos los viajes organizados por Grounder («nosotros»), Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Reino Unido, y a tu uso de este sitio web. Léelas antes de reservar. «Tú» se refiere al agente, asesor o turoperador que envía la solicitud y a los viajeros de la reserva; quien hace la reserva acepta estas condiciones en nombre de todo el grupo.</p>

<h2>Consultas y propuestas</h2>
<p>Enviar una consulta es gratis y no te compromete a nada. Respondemos con preguntas y después con una propuesta por escrito hecha para tus fechas, tu grupo y tu ruta. Los precios de este sitio son orientativos («desde») y no son ofertas; el precio de tu viaje, lo que incluye y el tiempo que sigue abierta la propuesta figuran en la propuesta. Los precios dependen de la disponibilidad hasta que se confirma la reserva.</p>

<h2>Hacer una reserva</h2>
<p>Una reserva se formaliza cuando aceptas una propuesta por escrito y pagas el depósito indicado, y nosotros la confirmamos por escrito. Tu confirmación detalla el viaje, el precio y la fecha de pago del resto. Revísala y avísanos enseguida si algo no está bien, incluidos los nombres, que deben coincidir con tus pasaportes.</p>

<h2>Pago del viaje</h2>
<p>Al reservar se paga un depósito y el resto antes de viajar, en la fecha indicada en tu propuesta y confirmación. Si el resto no se paga a tiempo, podemos considerar la reserva cancelada por ti y se aplican los gastos de cancelación indicados abajo.</p>
<p>Salvo que tu propuesta indique otra cosa, el depósito es del 30 % del precio total y el saldo se paga 60 días antes de la salida; si reservas con menos de 60 días de antelación, el precio total se paga al reservar.</p>

<h2>Qué está incluido</h2>
<p>Tu propuesta y tu confirmación detallan exactamente qué está incluido: normalmente el alojamiento, las comidas indicadas, los traslados y transportes privados, el acompañamiento, las actividades y las entradas o tasas de parques que se mencionan, y asistencia antes y durante el viaje. Salvo que la propuesta diga otra cosa, el precio no incluye vuelos internacionales, visados, seguro de viaje, vacunas y gastos médicos, propinas, bebidas y comidas no indicadas, actividades opcionales ni gastos personales.</p>

<h2>Cambios que nos pidas</h2>
<p>Intentaremos ayudarte si quieres cambiar una reserva confirmada, pero no podemos prometerlo. Los cambios pueden tener un coste, incluidos cargos de campamentos, hoteles, aerolíneas y otros proveedores, y te lo diremos antes de que decidas.</p>

<h2>Si cancelas</h2>
<p>Puedes cancelar en cualquier momento escribiéndonos; la cancelación surte efecto el día en que la recibimos. Como comprometemos dinero con los socios en tu nombre, salvo que tu propuesta indique otra cosa se aplican estos gastos, en porcentaje del precio total: más de 60 días antes de la salida, pérdida del depósito (30 %); de 60 a 31 días, 50 %; de 30 a 15 días, 75 %; 14 días o menos, o si los viajeros no viajan, 100 %. Cuando las condiciones de un proveedor son más estrictas, por ejemplo vuelos, permisos o estancias de temporada alta no reembolsables, la propuesta lo indicará y se aplicarán esos gastos. El seguro de viaje puede cubrir los gastos de cancelación.</p>

<h2>Si modificamos o cancelamos tu viaje</h2>
<p>Los viajes a medida a veces necesitan ajustes. Si tenemos que hacer un cambio importante en tu viaje antes de la salida, te lo diremos lo antes posible y podrás elegir entre aceptar el cambio, optar por una alternativa comparable o cancelar con el reembolso íntegro de lo que nos hayas pagado. No cancelaremos tu viaje después de pagado el resto salvo por causas ajenas a nuestro control y, si lo hacemos, te devolveremos lo que hayas pagado.</p>

<h2>Hechos fuera del control de cualquiera</h2>
<p>No somos responsables de cambios, retrasos o cancelaciones causados por hechos que ni nosotros ni nuestros proveedores podíamos prever o evitar, como fenómenos meteorológicos extremos, catástrofes naturales, epidemias, disturbios, huelgas o recomendaciones oficiales de no viajar. Si un hecho así impide tu viaje, te devolveremos lo que podamos recuperar y te ayudaremos a reorganizarlo.</p>

<h2>Seguro de viaje</h2>
<p>Debes tener, desde el momento de la reserva, un seguro de viaje que cubra cancelación, asistencia médica, repatriación y las actividades del viaje. Envíanos los datos de la póliza antes de viajar.</p>

<h2>Pasaportes, visados y salud</h2>
<p>Eres responsable de tener un pasaporte válido, los visados necesarios, las vacunas y documentos sanitarios exigidos, y de cumplir los requisitos de entrada de cada país por el que pases. Damos información general de buena fe, pero las normas cambian: compruébalas siempre en fuentes oficiales y con tu médico antes de viajar.</p>

<h2>Durante el viaje</h2>
<p>Sigue las indicaciones razonables de quienes te atienden, respeta las leyes y costumbres locales y cuéntanos antes de reservar cualquier problema de salud, discapacidad o necesidad que pueda afectar a tu viaje, para que comprobemos que se adapta a ti.</p>

<h2>Nuestra responsabilidad contigo</h2>
<p>Planificamos y organizamos tu viaje con una competencia y un cuidado razonables y nos aseguramos de que se presten los servicios confirmados. No somos responsables cuando un problema lo causas tú, una persona ajena a tu viaje o hechos fuera del control de cualquiera. Cuando los convenios internacionales limitan la responsabilidad de aerolíneas, otros transportistas u hoteles, la nuestra se limita del mismo modo. Nada de estas condiciones limita la responsabilidad por muerte o lesiones personales causadas por negligencia, ni ninguna otra que la ley no permita limitar.</p>

<h2>Si algo va mal</h2>
<p>Si tienes un problema durante el viaje, díselo a la persona que te atiende y contacta con nosotros enseguida para que intentemos solucionarlo sobre la marcha. Si sigues sin estar satisfecho, escribe a <a href="mailto:grounder@tourground.com">grounder@tourground.com</a> en los 28 días siguientes a tu regreso; responderemos en un plazo de 28 días.</p>

<h2>Uso de este sitio web</h2>
<p>Describimos lugares, temporadas y requisitos de entrada con el mayor cuidado posible, pero cambian. Los textos y el diseño de este sitio son nuestros; las fotografías pertenecen a sus autores y se usan con permiso o bajo sus licencias. Enlazamos a otros sitios a título informativo y no somos responsables de su contenido.</p>

<h2>Protección de datos</h2>
<p>Usamos los datos personales solo como se describe en nuestra <a href="#/privacy">política de privacidad</a>.</p>

<h2>Legislación aplicable</h2>
<p>Estas condiciones, y cualquier controversia derivada de ellas, se rigen por las leyes de Inglaterra y Gales, y son competentes los tribunales de Inglaterra y Gales. Si resides en otro país, ello no te priva de los derechos imperativos que te reconozca la legislación de consumo de tu país de residencia, y también puedes acudir a sus tribunales.</p>

<h2>Contacto</h2>
<p>Grounder, Second Home Spitalfields, 68 Hanbury Street, London E1 5JL, Reino Unido. <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'cookies': {
    title: 'Política de cookies — Grounder', desc: 'Lo que la web de Grounder guarda en tu navegador.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Legal</div><h1>Política de cookies.</h1><p class="lead">Lo que este sitio guarda en tu navegador, con detalle.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-legal"><p class="p-legal-date">Última actualización: 1 de noviembre de 2026</p>

<h2>Qué son las cookies</h2>
<p>Las cookies son pequeños archivos que un sitio web guarda en tu navegador. El almacenamiento local y el de sesión son espacios parecidos dentro del navegador. Ambos pueden recordar elecciones o contar visitas.</p>

<h2>Lo que guarda este sitio</h2>
<table class="legal-table"><thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Finalidad</th><th scope="col">Duración</th></tr></thead><tbody><tr><td><code>grounder.inquiries.v1</code></td><td>Almacenamiento local, de este sitio</td><td>Guarda las solicitudes que envías para que una referencia abra tu panel tras recargar en el mismo dispositivo</td><td>Hasta que borres el almacenamiento del navegador</td></tr><tr><td><code>grounder.inquiries.v1.last</code></td><td>Almacenamiento local, de este sitio</td><td>Recuerda la referencia de tu última solicitud</td><td>Hasta que borres el almacenamiento del navegador</td></tr><tr><td><code>grounder.partners</code></td><td>Almacenamiento local, de este sitio</td><td>Guarda una copia de la solicitud de socio que envías desde este dispositivo</td><td>Hasta que borres el almacenamiento del navegador</td></tr></tbody></table>
<p>Este sitio no instala cookies propias ni utiliza herramientas de analítica, publicidad o seguimiento de redes sociales.</p>

<h2>Tu consentimiento</h2>
<p>El almacenamiento indicado es estrictamente necesario para una función que eliges usar, así que no requiere consentimiento. Si alguna vez añadimos cookies o almacenamiento que no sean estrictamente necesarios, como analítica, te lo pediremos antes y lo indicaremos aquí. Puedes borrar las cookies y los datos del sitio en cualquier momento desde los ajustes del navegador.</p>

<h2>Otras solicitudes que hace tu navegador</h2>
<p>Ninguna. Las fuentes, imágenes y scripts se sirven desde este sitio. Las páginas del panel funcionan dentro de este sitio.</p>

<h2>Cambios en esta política</h2>
<p>Si el sitio empieza a guardar algo nuevo, actualizaremos antes esta página y la fecha de arriba.</p>

<h2>Contacto</h2>
<p>Preguntas sobre esta política: <a href="mailto:grounder@tourground.com">grounder@tourground.com</a></p>

</div></div></div></section>`
  },
  'contact': {
    title: 'Contactar con Grounder — pide una cotización o hazte socio', desc: 'Pide una cotización instantánea para cualquier destino, solicita ser socio local o envía un mensaje al equipo de Grounder.',
    html: () => `
<section class="p-hero p-hero-s"><div class="wrap"><div class="kick">Contacto</div><h1>Habla con Grounder.</h1><p class="lead">Para un viaje, lo más rápido es una solicitud: llega de inmediato a los socios locales asignados. Para todo lo demás, escríbenos abajo.</p></div></section>
<section><div class="wrap"><div class="boxc"><div class="p-grid3 p-contact">
  <div class="p-card"><h3>Pedir cotización</h3><p>Pega el brief de un cliente o rellena el formulario. Las cotizaciones llegan a tu panel.</p>${CTA}</div>
  <div class="p-card"><h3>Hazte socio</h3><p>DMC y operadores locales: solicita recibir solicitudes cualificadas.</p>${CTA_P}</div>
  <div class="p-card"><h3>Consultar una solicitud</h3><p>¿Tienes una referencia? Abre tu panel para ver cotizaciones y mensajes.</p><button class="btn grey" onclick="openCheck()">Consultar una solicitud</button></div>
</div></div></div></section>
<section><div class="wrap"><div class="sec-head"><div class="kick">Escríbenos</div><h2>Todo lo demás.</h2><p>Correo electrónico <a href="mailto:${GX_CONFIG.contactEmail}">${GX_CONFIG.contactEmail}</a>. Nuestra dirección: ${esc(GX_CONFIG.address)}.</p></div><div class="boxc"><form class="p-form" id="contact-form" onsubmit="return submitContact(event)">
  <div class="row2"><div class="f"><label>Tu nombre</label><input name="name" required autocomplete="name"></div><div class="f"><label>Empresa</label><input name="company" autocomplete="organization"></div></div>
  <div class="row2"><div class="f"><label>Correo electrónico</label><input name="email" type="email" required autocomplete="email"></div><div class="f"><label>Tema</label><select name="topic"><option>Solicitud de viaje</option><option>Colaboración</option><option>Prensa</option><option>Otra cosa</option></select></div></div>
  <div class="f"><label>Mensaje</label><textarea name="message" rows="5" required></textarea></div>
  <div class="p-form-f"><span class="note">Respondemos por correo.</span><button class="btn blue" type="submit">Enviar mensaje ${ICON.arrow}</button></div>
  <div class="p-form-ok" id="contact-ok" hidden><h3>Mensaje enviado</h3><p>Gracias. Responderemos a la dirección que nos has dado.</p></div>
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
  if(!r.ok) location.href = gxMailto('Solicitud de socio de Grounder: ' + d.company, Object.entries(d).map(([k, v]) => k + ': ' + (Array.isArray(v) ? v.join(', ') : v)));
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('partner-ok').hidden = false; toast(r.ok ? 'Solicitud enviada' : 'Abriendo tu aplicación de correo para enviar la solicitud');
  return false;
}
async function submitContact(e){
  e.preventDefault(); const f = e.target, d = formData(f); const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  const r = await gxSend('contact', d); btn.disabled = false;
  if(!r.ok) location.href = gxMailto('Grounder — ' + d.topic + ' from ' + d.name, [d.message, '', d.name, d.company, d.email]);
  f.querySelectorAll('.f, .p-form-f').forEach(x => x.hidden = true); $('contact-ok').hidden = false; toast(r.ok ? 'Mensaje enviado' : 'Abriendo tu aplicación de correo para enviar el mensaje');
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
