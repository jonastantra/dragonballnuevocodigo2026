#!/usr/bin/env python3
import json, re, sys
site=sys.argv[1]; rules=json.load(open('vercel.json'))['redirects']; result={}
def add(src,dst):
 if any(c in src+dst for c in ['"','\\','$','\n','\r','\t']): raise ValueError('Caracteres no admitidos en redirección')
 if not src.startswith('/') or not dst.startswith('/'): raise ValueError('Destino no local')
 if src in result and result[src]!=dst: raise ValueError('Conflicto en '+src)
 result[src]=dst
if site=='dragonball':
 for src,dst in json.load(open('data/redirect-map.json')).items(): add(src.rstrip('/')+'/',dst)
 for rule in rules:
  s=rule['source']; d=rule['destination']
  if not (':' in s or '(' in s) and not rule.get('has'): add(s.rstrip('/')+'/',d)
elif site=='simpsons':
 for rule in rules:
  if rule.get('has'): continue
  s=rule['source']; d=rule['destination']; match=re.fullmatch(r'/:legacy\(([^()]*)\)/',s)
  if match: sources=['/'+x+'/' for x in match.group(1).split('|')]
  elif ':' not in s and '(' not in s: sources=[s]
  else: raise ValueError('Regla no admitida: '+s)
  for src in sources:
   add(src,dst=d)
   if src!='/': add(src.rstrip('/'),dst=d)
else: raise ValueError('Sitio desconocido')
with open('redirects.map','w') as f:
 for src,dst in sorted(result.items()): f.write('"'+src+'" "'+dst+'";\n')
print('Redirecciones:',len(result))
