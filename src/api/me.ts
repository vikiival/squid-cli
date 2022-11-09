import { api, ApiError } from './api';

export async function me(): Promise<{ username: string }> {
  const { body } = await api<{ username: string }>({
    method: 'get',
    path: `/client/me`,
  });

  if (!body || !body.username) {
    throw new ApiError(401, { error: 'username is missing' });
  }

  return body;
}
