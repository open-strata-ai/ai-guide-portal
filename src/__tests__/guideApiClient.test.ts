import { describe, it, expect, vi, beforeEach } from 'vitest';

const { post, get } = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));
vi.mock('axios', () => ({
  default: { create: () => ({ post, get }) },
  AxiosInstance: class {},
}));

import { guideApi } from '../infrastructure/guideApiClient';

describe('guideApiClient (locks endpoint contract)', () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
    post.mockResolvedValue({ data: { id: 'p1', status: 'APPLIED' } });
    get.mockResolvedValue({ data: [] });
  });

  it('apply() POSTs to /plans/{id}/apply', async () => {
    await guideApi.apply('plan-9');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post.mock.calls[0][0]).toBe('/plans/plan-9/apply');
  });

  it('preview() POSTs selections+profile to /plans/preview', async () => {
    await guideApi.preview(['a', 'b'], 'standard');
    const [url, body] = post.mock.calls[0];
    expect(url).toBe('/plans/preview');
    expect(body).toEqual({ selections: ['a', 'b'], profile: 'standard' });
  });
});
