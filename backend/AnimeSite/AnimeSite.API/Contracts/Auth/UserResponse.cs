namespace AnimeSite.API.Contracts.Auth;

public record UserResponse(
    Guid Id,
    string Username,
    string Email);