export function useUser() {
    return {
      data: {
        id: "12345",
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        subscription_tier: "standard",
        subscription_valid_until: "2025-12-31",
        image: null,
      },
      loading: false,
      refetch: async () => {}, // Mock refetch function
    };
  }