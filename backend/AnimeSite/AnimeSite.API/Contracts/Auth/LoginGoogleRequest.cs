namespace AnimeSite.API.Contracts.Auth;

public record LoginGoogleRequest(
    string Email,
    string GoogleId,
    string Username);