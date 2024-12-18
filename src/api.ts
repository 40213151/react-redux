export type ColumnID = string & { readonly brand: unique symbol }
export type CardID = string & { readonly brand: unique symbol }

export type ReqAndRes = {
  'GET /columns': {
    req: null
    res: {
      id: ColumnID
      title?: string
    }[]
  }

  'GET /cards': {
    req: null
    res: {
      id: CardID
      text?: string
    }[]
  }

  'POST /cards': {
    req: {
      id: CardID
      text?: string
    }
    res: {
      id: CardID
      text?: string
    }
  }

  'DELETE /cards': {
    req: {
      id: CardID
    }
    res: []
  }

  'GET /cardsOrder': {
    req: null
    res: Record<string, CardID | ColumnID | null>
  }

  'PATCH /cardsOrder': {
    req: Record<string, CardID | ColumnID | null>
    res: Record<string, CardID | ColumnID | null>
  }
}

export const Endpoint = process.env.API_ENDPOINT || 'http://localhost:3000'

export async function api<K extends keyof ReqAndRes>(
  key: K,
  payload: ReqAndRes[K]['req'],
): Promise<ReqAndRes[K]['res']> {
  const [method, path] = key.split(' ')
  if (!method || !path) {
    throw new Error(`Unrecognized api: ${key}`)
  }

  let pathWithID = ''
  const option: RequestInit = { method }
  switch (option.method) {
    case 'GET':
    case 'DELETE':
      if (payload && 'id' in payload) {
        pathWithID = `${path}/${payload.id}`
      }
      break

    case 'POST':
      option.headers = { 'Content-Type': 'application/json' }
      option.body = JSON.stringify(payload)
      break

    case 'PATCH':
      if (payload && 'id' in payload) {
        pathWithID = `${path}/${payload.id}`
      }
      option.headers = { 'Content-Type': 'application/json' }
      option.body = JSON.stringify(payload)
      break
  }

  return fetch(`${Endpoint}${pathWithID || path}`, option).then(res =>
    res.ok
      ? res.json()
      : res.text().then(text => {
          throw new APIError(
            method,
            res.url,
            res.status,
            res.statusText,
            res.ok,
            res.redirected,
            res.type,
            text,
          )
        }),
  )
}

export class APIError extends Error {
  constructor(
    public method: string,
    public url: string,
    public status: number,
    public statusText: string,
    public ok: boolean,
    public redirected: boolean,
    public type: string,
    public text?: string,
  ) {
    super(`${method} ${url} ${status} (${statusText})`)
  }
}
