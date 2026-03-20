import re

photos = [
    "c_Agradecimiento Domino.png",
    "b_Agrardecimiento Rolex.png",
    "Agardecimiento Bicolor.png",
    "a_Agradecimiento Taxco.png"
]

parsed = []
for p in photos:
    # Match optional a_, b_, c_, etc. or no prefix
    # Need to be careful: "Agardecimiento Bicolor.png" has 'A' which might match [a-zA-Z]_? No, there is no underscore.
    # So we match (?:([a-zA-Z])_)?\s*(.*)\.png$
    m = re.match(r'^(?:([a-zA-Z])_)?\s*(.*?)\.png$', p)
    if m:
        prefix = m.group(1) or ""
        title = m.group(2).strip()
        # Clean title typos
        title = title.replace("Agrardecimiento", "Agrad.").replace("Agardecimiento", "Agrad.").replace("Agradecimiento", "Agrad.")
        parsed.append((prefix, p, title))

# Sort alphabetically by prefix ("" sorts before "a")
parsed.sort(key=lambda x: (x[0] if x[0] else "z"))

cards_html = []
for prefix, filename, title in parsed:
    card = f'''                <div class="card with-img placa-item">
                    <div class="card-img-container wide-img">
                        <img src="fotos-graduaciones/{filename}" alt="{title}" class="card-img">
                    </div>
                    <div class="card-content">
                        <h3>{title}</h3>
                        <div class="card-action" style="margin-top: 15px;">
                            <a href="https://wa.me/5217771923760?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20un%20paquete%20de%20graduaci%C3%B3n." target="_blank" class="btn-whatsapp-elegant">
                                <i class="fab fa-whatsapp"></i> Cotizar
                            </a>
                        </div>
                    </div>
                </div>'''
    cards_html.append(card)

cards_block = '\n\n'.join(cards_html)

with open('/home/david/Escritorio/fotoaleman/graduaciones.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace the content of the second grid-cards
pattern = re.compile(r'(<!-- SECTION 2: AGRADECIMIENTOS -->.*?<div class="grid-cards">).*?(</div>\s*</div>\s*</section>\s*<!-- SECTION 3: QR CODE -->)', re.DOTALL)

match = pattern.search(html_content)
if not match:
    print("Could not find the target section for agradecimientos.")
    exit(1)

new_content = html_content[:match.start(1)] + match.group(1) + '\n' + cards_block + '\n            ' + match.group(2) + html_content[match.end(2):]

with open('/home/david/Escritorio/fotoaleman/graduaciones.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Agradecimientos injected successfully.")
