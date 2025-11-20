namespace AnimeSite.API.Contracts.Auth;

public record LoginUserRequest(
    string Email,
    string Password);