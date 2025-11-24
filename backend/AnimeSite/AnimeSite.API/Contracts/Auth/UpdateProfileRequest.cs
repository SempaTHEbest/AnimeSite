namespace AnimeSite.API.Contracts.Auth;

public record UpdateProfileRequest(
    string Bio,
    string AvatarUrl);