from pydantic import (
    BaseModel,
    EmailStr,
    SecretStr,
    ValidationError,
    field_validator,
)
import bcrypt
import re

VALID_PASSWORD_REGEX = re.compile(r"^(?=.*[a-zA-Z])(?=.*\d).{8,}$")

class UserSchema(BaseModel):
    email: EmailStr
    username: str
    password: SecretStr
    photo_profile: str | None = None  # Make photo_profile optional with None default

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: SecretStr) -> SecretStr:
        # Get the raw string value from SecretStr
        password = v.get_secret_value()
        if not VALID_PASSWORD_REGEX.match(password):
            raise ValueError(
                "Password invalid: must be at least 8 characters long and contain both letters and numbers"
            )
        return v

# Function to hash password
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# Function to validate user input
def validate_user(data):
    try:
        validated_data = UserSchema(**data)
        validated_data.password = hash_password(
            validated_data.password.get_secret_value()
        )  # Hash password before returning
        return validated_data, None  # Valid data, no error
    except ValidationError as e:
        errors = [{"field": err["loc"][0], "message": err["msg"]} for err in e.errors()]
        return None, errors  # Return errors
