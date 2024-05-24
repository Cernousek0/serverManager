import os
import json
import uuid

# print(str(uuid.uuid4())[:8])

with open ("versions.json", "r") as file:
    versions = json.load(file)

for i in versions["versions"]:
    print(i["id"])
    
print()




