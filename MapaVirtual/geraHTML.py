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
for c in cidades:
    map_aux[c['id']] = c['nome']

map_ligacoes = {}
for l in ligacoes:
    key = l['origem']
    if key not in map_ligacoes.keys():
        map_ligacoes[key] = {}
    map_ligacoes[key][l['destino']] = l['distância']


pagHTML = """
<!DOCTYPE html>
<html>
    <head>
        <title>Mapa Virtual</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <center>
            <h1>Mapa Virtual</h1>
        </center>
        <table>
            <tr>
                <!--Coluna do índice-->
                <td width="30%" valign="top">
                    <a name="indice"/>
                    <h3>Índice</h3>
                    <ol>
"""

for c in cidades:
    pagHTML += f"                       <li><a href='#{c['id']}'>{c['nome']}</a></li>\n"


pagHTML += """                   </ol>
                </td>
                <!--Coluna do conteúdo-->
                <td width="70%">
"""

for c in cidades:
    pagHTML += f"""                <a name="{c['id']}"/>
                    <h3>{c['nome']}</h3>
                    <p><b>Distrito: </b>{c['distrito']}</p>
                    <p><b>População: </b>{c['população']}</p>
                    <p><b>Descrição: </b>{c['descrição']}</p>
                """
    if c['id'] in map_ligacoes.keys():
        dest = map_ligacoes.get(c['id'])
        
        pagHTML += """    <h4>Ligações: </h4>
                        <ul>"""

        for item in dest.items():
            pagHTML+= f"""\n                            <li><a href='#{item[0]}'>{map_aux.get(item[0])}</a>: {item[1]}</li>"""

    pagHTML += f"""
                        </ul>
                    <p></p>            
                    <adress>[<a href="#indice">Voltar ao índice</a>]</address>
                    <center>
                        <hr width="80%"/>
                    </center>
    """



pagHTML += """
                </td>
            </tr>
        </table>
    </body>
</html>
"""

print(pagHTML)
