from pydantic import BaseModel, EmailStr, Field, ValidationError
import bcrypt

class UserSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, pattern="^(?:[A-Z]*[a-z]+[A-Z]*[0-9]+|[A-Z]*[0-9]+[A-Z]*[a-z]+|[a-z]*[A-Z]+[a-z]*[0-9]+|[a-z]*[0-9]+[a-z]*[A-Z]+|[0-9]*[A-Z]+[0-9]*[a-z]+|[0-9]*[a-z]+[0-9]*[A-Z]+)[A-Za-z0-9]*$", description="Password must be at least 8 characters long and contain uppercase, lowercase, and numbers")

# Function to hash password
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

# Function to validate user input
def validate_user(data):
    try:
        validated_data = UserSchema(**data)
        validated_data.password = hash_password(validated_data.password)  # Hash password before returning
        return validated_data, None  # Valid data, no error
    except ValidationError as e:
        errors = [{"field": err["loc"][0], "message": err["msg"]} for err in e.errors()]
        return None, errors  # Return errors
