import json 

dict = json.load(open("dataset.json"))
for i,pessoa in enumerate(dict['pessoas']):
    pessoa['id'] = f"p{i}" 

new = json.dumps(dict, indent = 2, ensure_ascii = False)
with open("dataset.json","w",encoding = "utf-8") as file_out:
    file_out.write(new)