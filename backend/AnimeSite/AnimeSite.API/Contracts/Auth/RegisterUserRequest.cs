namespace AnimeSite.API.Contracts.Auth;

public record RegisterUserRequest(
    string Username,
    string Email,
    string Password);