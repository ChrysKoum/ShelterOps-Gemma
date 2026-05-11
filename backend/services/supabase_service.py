from backend.core import get_settings


class SupabaseService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.enabled = bool(
            self.settings.supabase_url
            and (self.settings.supabase_service_role_key or self.settings.supabase_anon_key)
        )

    def status(self) -> str:
        return "connected" if self.enabled else "memory_fallback"
