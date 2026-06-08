import os
from typing import Optional

import httpx
import asyncio
import random
import time

# Environment configuration
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
GEMINI_API_URL = os.environ.get('GEMINI_API_URL')
AI_PROVIDER = os.environ.get('AI_PROVIDER', 'openai').lower()


async def _call_openai_chat(prompt: str, model: str = 'gpt-4o-mini') -> str:
    if not OPENAI_API_KEY:
        raise RuntimeError('OPENAI_API_KEY not configured')

    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': model,
        'messages': [
            {'role': 'system', 'content': 'You are a helpful medical assistant that provides educational information but not medical advice.'},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.2,
        'max_tokens': 800
    }

    # Retry/backoff parameters
    max_attempts = int(os.environ.get('AI_MAX_RETRIES', '3'))
    base_backoff = float(os.environ.get('AI_BASE_BACKOFF', '0.5'))
    max_backoff = float(os.environ.get('AI_MAX_BACKOFF', '10'))

    for attempt in range(1, max_attempts + 1):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                r = await client.post(url, json=payload, headers=headers)
                r.raise_for_status()
                data = r.json()

            try:
                return data['choices'][0]['message']['content']
            except Exception:
                return str(data)

        except httpx.HTTPStatusError as e:
            status = e.response.status_code if e.response is not None else None
            # Retry on rate limit / server errors
            if status in (429, 502, 503, 504):
                retry_after = None
                try:
                    retry_after = float(e.response.headers.get('Retry-After'))
                except Exception:
                    retry_after = None
                if retry_after:
                    await asyncio.sleep(retry_after)
                else:
                    backoff = min(max_backoff, base_backoff * (2 ** (attempt - 1)) * (1 + random.random()))
                    await asyncio.sleep(backoff)
                if attempt == max_attempts:
                    raise
                continue
            raise
        except (httpx.RequestError, asyncio.TimeoutError):
            if attempt == max_attempts:
                raise
            backoff = min(max_backoff, base_backoff * (2 ** (attempt - 1)) * (1 + random.random()))
            await asyncio.sleep(backoff)
            continue


async def _call_gemini_chat(prompt: str, model: Optional[str] = None) -> str:
    """Generic Gemini/other provider caller.

    This sends a POST to `GEMINI_API_URL` with a JSON body and `Authorization: Bearer <GEMINI_API_KEY>`.
    The exact payload/response depends on the configured service; this function will return raw JSON
    text if a best-effort extraction fails.
    """
    if not GEMINI_API_KEY or not GEMINI_API_URL:
        raise RuntimeError('GEMINI_API_KEY or GEMINI_API_URL not configured')

    headers = {
        'Authorization': f'Bearer {GEMINI_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {'prompt': prompt}
    if model:
        payload['model'] = model

    # Retry/backoff parameters
    max_attempts = int(os.environ.get('AI_MAX_RETRIES', '3'))
    base_backoff = float(os.environ.get('AI_BASE_BACKOFF', '0.5'))
    max_backoff = float(os.environ.get('AI_MAX_BACKOFF', '10'))

    for attempt in range(1, max_attempts + 1):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                r = await client.post(GEMINI_API_URL, json=payload, headers=headers)
                r.raise_for_status()
                try:
                    data = r.json()
                except Exception:
                    return r.text

            # Try common response shapes
            if isinstance(data, dict):
                # vertex/llm style: check for 'candidates' or 'output' fields
                if 'candidates' in data and len(data['candidates']) > 0:
                    c = data['candidates'][0]
                    if isinstance(c, dict) and 'content' in c:
                        return c['content']
                if 'output' in data:
                    return str(data['output'])
                # fallback to returning the JSON string
                return str(data)
            return str(data)

        except httpx.HTTPStatusError as e:
            status = e.response.status_code if e.response is not None else None
            if status in (429, 502, 503, 504):
                retry_after = None
                try:
                    retry_after = float(e.response.headers.get('Retry-After'))
                except Exception:
                    retry_after = None
                if retry_after:
                    await asyncio.sleep(retry_after)
                else:
                    backoff = min(max_backoff, base_backoff * (2 ** (attempt - 1)) * (1 + random.random()))
                    await asyncio.sleep(backoff)
                if attempt == max_attempts:
                    raise
                continue
            raise
        except (httpx.RequestError, asyncio.TimeoutError):
            if attempt == max_attempts:
                raise
            backoff = min(max_backoff, base_backoff * (2 ** (attempt - 1)) * (1 + random.random()))
            await asyncio.sleep(backoff)
            continue

    # Try common response shapes
    if isinstance(data, dict):
        # vertex/llm style: check for 'candidates' or 'output' fields
        if 'candidates' in data and len(data['candidates']) > 0:
            c = data['candidates'][0]
            if isinstance(c, dict) and 'content' in c:
                return c['content']
        if 'output' in data:
            return str(data['output'])
        # fallback to returning the JSON string
        return str(data)
    return str(data)


async def call_ai_chat(prompt: str, provider: Optional[str] = None, model: Optional[str] = None) -> str:
    """Call configured AI provider. `provider` overrides env `AI_PROVIDER`.

    Supported providers: 'openai', 'gemini'.
    """
    use_provider = (provider or AI_PROVIDER).lower()
    if use_provider == 'openai':
        return await _call_openai_chat(prompt, model=model or 'gpt-4o-mini')
    if use_provider == 'gemini':
        return await _call_gemini_chat(prompt, model=model)
    raise RuntimeError(f'Unsupported AI_PROVIDER: {use_provider}')
