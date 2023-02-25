import json

def ordCidade(cidade):
    return cidade['nome']

def ordLigacoes(ligacao):
    return int(ligacao['distância'])

f = open("mapa.json")
mapa = json.load(f)
cidades = mapa['cidades']
cidades.sort(key=ordCidade)
ligacoes = mapa['ligações']
ligacoes.sort(key=ordLigacoes)

map_aux = {}
aux_map = {}
for c in cidades:
    map_aux[c['id']] = c['nome']
    aux_map[c['nome']] = c['id']



map_ligacoes = {}
for l in ligacoes:
    key = l['origem']
    if key not in map_ligacoes.keys():
        map_ligacoes[key] = {}
    map_ligacoes[key][l['destino']] = l['distância']

distritos = dict()
for c in cidades:
    distrito = c['distrito']
    if distrito not in distritos:
        distritos[distrito] = []
    distritos[distrito].append(c['nome'])

keys = list(distritos.keys())
keys.sort()
sorted_dist = {i: distritos[i] for i in keys}
 
index = open("index.html","w")
iHTML = """<!DOCTYPE html>
<html>
    <head>
        <title>Índice</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <center>
            <h1>Indíce de distritos e suas cidades</h1>
        </center>
        <ol>
"""

for d in sorted_dist.keys():
    iHTML += f"            <h3>{d}</h3>\n"
    iHTML += """            <ul>\n"""
    list = sorted_dist[d]
    for c in list:
        iHTML += f"""                <li><a href='{aux_map.get(c)}'>{c}</a></li>\n"""
    iHTML += """            </ul><br>\n"""
    


iHTML += """         </ol>    
    </body>
</html>
"""

index.write(iHTML)

for c in cidades:
    name = c['nome']
    cf = open(f"cities/{c['id']}.html","w")
    cHTML = """<!DOCTYPE html>\n"""
    cHTML += f"""<html>
    <head>
        <title>{name}</title>'
        <meta charset="utf-8"/>
    </head>
    <body>
        <center>
            <h1>{name}</h1>
        </center>
        <ol>
            <p><b>Distrito: </b>{c['distrito']}<p>
            <p><b>População: </b>{c['população']}<p>
            <p><b>Descrição: </b>{c['descrição']}<p>
    """
    if c['id'] in map_ligacoes.keys():
        dest = map_ligacoes.get(c['id'])

        cHTML += """        <p><b>Ligações: </b></p>
            <ul>"""

        for item in dest.items():
            cHTML+= f"""\n                <li><a href='{item[0]}'>{map_aux.get(item[0])}</a>: {item[1]} km</li>"""
    
    cHTML += """        
            </ul>
            <p><a href='/'><b>Voltar ao índice</b></a><p>
        </ol>
    </body>\n"""
    cHTML += """</html>"""

    cf.write(cHTML) 
