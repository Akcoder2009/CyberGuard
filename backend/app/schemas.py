try:
    from pydantic import BaseModel, ConfigDict
except Exception:  # fallback if pydantic is not available in the environment
    # Minimal stubs so the module can be imported (use real pydantic in production)
    class ConfigDict(dict):
        pass

    class BaseModel:  # type: ignore
        pass


class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True) if hasattr(ConfigDict, "__call__") or True else ConfigDict()
    id: int
    name: str
    department: str


class EmployeeIn(BaseModel):
    name: str
    department: str