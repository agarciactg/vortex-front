export const queryKeys = {
  tickets: {
    all:    ['tickets'] as const,
    list:   (params: Record<string, unknown> = {}) => ['tickets', 'list', params] as const,
    detail: (id: string) => ['tickets', 'detail', id] as const,
  },
} as const
