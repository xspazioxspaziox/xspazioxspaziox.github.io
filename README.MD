STRUTTURA REPOSITORY:  


BRANCH MAIN:
/  
├─ index.html                      # Home minimale (link principali a flyer/info correnti)  
├─ 404.html                        # Pagina di errore "Pagina non trovata"  
├─ CNAME                       # Da non toccare, fa sì che siamo linkati al dominio www.xspazioxspaziox.com
│  
├─ assets/  
│  ├─ css/  
│  │  └─ style.css                 # Stili globali (layout, cornice, link, responsive)  
│  ├─ js/  
│  │  └─ include.js                # Inietta header/footer e riscrive i percorsi assets/  
│  │  └─ hydra.js                # Contiene il codice dei visual, con il solo scopo di essere visualizzato quando in homepage si clicca su "code"  
  
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
  
  BRANCH: PROGRAMMI-PDF
  - file pdf con programma del mese
    
COME AGGIUNGERE UN NUOVO EVENTO:

1. Aggiungi l’immagine in eventi/img/.
2. Duplica una coppia di cartelle *-flyer e *-info in eventi/AAAA/.
3. Aggiorna i testi e la data/ora.
4. Inserisci il link *-flyer in eventi/index.html, in /index.html e nella pagina *-info.
5. Inserisci il link *-info nella pagina *-flyer
6. Crea pagina artista e collegala in artisti/ e nel testo della pagina *.info.
7. Collega evento *-flyer nella pagina artista


COLLEGAMENTI INTERNI TIPICI
  
in info → flyer	../DD-MM-slug-flyer/  
in eventi → flyer   AAAA/DD-MM-slug-flyer/  
in home → flyer   eventi/AAAA/DD-MM-slug-flyer/  
in flyer → info	../DD-MM-slug-info/  
in flyer/info → eventi	../../  
in artisti → artista nome-artista/  
in info → artista	../../../artisti/nome-artista/  
in artista → flyer	../../eventi/AAAA/DD-MM-slug-flyer/  
in artista → artisti	../  

CARICARE PROGRAMMA DEL MESE IN HOME PAGE
  
Caricare pdf del programma nel branch programmi-pdf con nome spazio-x-MESE-ANNO.pdf  
linkare pdf per il download, nell'index della home page al posto di quello vecchio:  
https://raw.githubusercontent.com/xspazioxspaziox/xspazioxspaziox.github.io/545db9824541a67d9cfb6aff027abd2853e1a9cf/spazio-x-MESE-ANNO.pdf

VISUALS HOMEPAGE

Cerca questa riga:

// === codice visuals hydra, se lo cambi aggiorna anche dentro /assets/js/hydra.js ===

modifica il codice presente con codice hydra, e poi aggiorna lo stesso codice hydra dentro /assets/js/hydra.js


LOGICA DEI FILE DINAMICI:

include.js
Inserisce dinamicamente:

-partials/header.html nel <div id="header">

-partials/footer.html nel <div id="footer">

-partials/head.html 

-Riscrive percorsi assets/... per funzionare da sottocartelle

-Evita “saltini” con placeholder e gestisce fix scroll iOS.
