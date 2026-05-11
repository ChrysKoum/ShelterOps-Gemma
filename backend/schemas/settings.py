from pydantic import BaseModel


class ShelterSettings(BaseModel):
    id: str = "demo-shelter"
    name: str = "Northside School Gym"
    location: str = "1200 Maple Ave"
    contact_name: str = "Maya Chen"
    contact_email: str = "shelter-coordinator@example.org"
    contact_phone: str = ""
    dropoff_instructions: str = "Main entrance, 8 AM - 8 PM"
    public_board_enabled: bool = True


class ModelSettings(BaseModel):
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "gemma4"
    demo_mode: bool = True
