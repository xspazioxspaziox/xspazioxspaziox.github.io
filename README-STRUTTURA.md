STRUTTURA REPOSITORY:

/
├─ index.html                      # Home minimale (link principali a flyer/info correnti)
├─ 404.html                        # Pagina di errore "Pagina non trovata"
│
├─ assets/
│  ├─ css/
│  │  └─ style.css                 # Stili globali (layout, cornice, link, responsive)
│  ├─ js/
│  │  └─ include.js                # Inietta header/footer e riscrive i percorsi assets/
│  └─ img/
│     ├─ favicon.ico               # Icona del sito
│     ├─ volo.png                  # Oggetto volante decorativo animato
│     └─ (altre immagini generiche)
│
├─ partials/
│  ├─ head.html                    # Script vari (incluso nelle pagine)
│  ├─ header.html                  # Header globale (logo o menu, iniettato da include.js)
│  └─ footer.html                  # Footer globale (link social, contatti, script ready)
│
├─ eventi/
│  ├─ index.html                   # Archivio eventi (lista scrollabile)
│  ├─ img/
│  │  └─ 31-08-25-yoga.jpg         # Immagini dei flyer (una per evento)
│  └─ 2025/
│     ├─ 31-08-yoga-flyer/
│     │  └─ index.html             # Pagina flyer: immagine 300×375px
│     └─ 31-08-yoga-info/
│        └─ index.html             # Pagina info: testo scrollabile + link ad artista/evento
│
└─ artisti/
   ├─ index.html                   # Archivio artisti (lista di link scrollabile)
   └─ pino-scoppon/
      └─ index.html                # Scheda artista: testo in cornice + link evento correlato


COME AGGIUNGERE UN NUOVO EVENTO:

1. Aggiungi l’immagine in eventi/img/.
2. Duplica una coppia di cartelle *-flyer e *-info in eventi/AAAA/.
3. Aggiorna i testi, i link e la data/ora.
4. Inserisci il link *-flyer in eventi/index.html e in /index.html.
5. Inserisci il link *-info nella pagina *-flyer
6. Crea pagina artista e collegala in artisti/.
7. Collega evento *-flyer nella pagina artista

COLLEGAMENTI INTERNI TIPICI

Da → A	Percorso relativo
flyer → info	../DD-MM-slug-info/
info → flyer	../DD-MM-slug-flyer/
flyer/info → eventi	../../
info → artista	../../../artisti/nome-artista/
artista → eventi	../../eventi/AAAA/DD-MM-slug-flyer/
artista → archivio artisti	../

LOGICA DEI FILE DINAMICI:

include.js
Inserisce dinamicamente:

-partials/header.html nel <div id="header">

-partials/footer.html nel <div id="footer">

-partials/head.html 

-Riscrive percorsi assets/... per funzionare da sottocartelle

-Evita “saltini” con placeholder e gestisce fix scroll iOS.

