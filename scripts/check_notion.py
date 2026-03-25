#!/usr/bin/env python3
# check_notion.py — lightweight Notion board checker for heartbeat
# Reads NOTION_TOKEN from secure path and checks AI Message Board for new items.
import os, sys, requests, json
TOKEN_PATH='/home/moriahkeeper/.openclaw/secrets/NOTION_TOKEN'
OUT_PATH='/home/moriahkeeper/.openclaw/workspace/notion_heartbeat_last.json'
if not os.path.exists(TOKEN_PATH):
    print('NO_NOTION_TOKEN')
    sys.exit(2)
with open(TOKEN_PATH) as f:
    token=f.read().strip()
headers={'Authorization':f'Bearer {token}','Notion-Version':'2022-06-28','Content-Type':'application/json'}
# search for AI Message Board DB (cached id preferred)
search_url='https://api.notion.com/v1/search'
payload={'query':'AI Message Board','filter':{'property':'object','value':'database'}}
try:
    r=requests.post(search_url, headers=headers, json=payload, timeout=15)
    r.raise_for_status()
    data=r.json()
    results=data.get('results',[])
    if not results:
        print('NO_DB_FOUND')
        sys.exit(3)
    db_id=results[0]['id']
    # query the database for recent entries
    q_url=f'https://api.notion.com/v1/databases/{db_id}/query'
    q_payload={'page_size':10,'sort':[{'timestamp':'last_edited_time','direction':'descending'}]}
    qr=requests.post(q_url, headers=headers, json=q_payload, timeout=15)
    qr.raise_for_status()
    qdata=qr.json()
    # save snapshot
    with open(OUT_PATH,'w') as out:
        json.dump({'db_id':db_id,'snapshot':qdata}, out, indent=2)
    print('OK')
    sys.exit(0)
except Exception as e:
    print('ERROR',str(e))
    sys.exit(1)
