import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    'Access-Control-Max-Age': '86400',
}


def handler(event: dict, context) -> dict:
    '''Управление каталогом цветов и флорариумов: список, добавление, удаление товаров.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    conn.autocommit = True

    try:
        if method == 'GET':
            cur = conn.cursor()
            cur.execute('SELECT id, name, description, price, category, image FROM products ORDER BY created_at DESC')
            rows = cur.fetchall()
            cur.close()
            items = [
                {'id': r[0], 'name': r[1], 'description': r[2], 'price': r[3], 'category': r[4], 'image': r[5]}
                for r in rows
            ]
            return {
                'statusCode': 200,
                'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                'body': json.dumps({'items': items}),
            }

        admin_token = event.get('headers', {}).get('X-Admin-Token') or event.get('headers', {}).get('x-admin-token')
        expected_token = os.environ.get('ADMIN_TOKEN')
        if not expected_token or not admin_token or admin_token != expected_token:
            return {
                'statusCode': 403,
                'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'forbidden'}),
            }

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            name = (body.get('name') or '').strip()
            description = (body.get('description') or '').strip()
            price = (body.get('price') or '').strip()
            category = (body.get('category') or 'flowers').strip()
            image = body.get('image') or ''

            if not name:
                return {
                    'statusCode': 400,
                    'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'name required'}),
                }

            cur = conn.cursor()
            cur.execute(
                "INSERT INTO products (name, description, price, category, image) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (name, description, price, category, image),
            )
            new_id = cur.fetchone()[0]
            cur.close()
            return {
                'statusCode': 200,
                'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': new_id, 'ok': True}),
            }

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            item_id = params.get('id')
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'id required'}),
                }
            cur = conn.cursor()
            cur.execute('DELETE FROM products WHERE id = %s', (int(item_id),))
            cur.close()
            return {
                'statusCode': 200,
                'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True}),
            }

        return {
            'statusCode': 405,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'method not allowed'}),
        }
    finally:
        conn.close()