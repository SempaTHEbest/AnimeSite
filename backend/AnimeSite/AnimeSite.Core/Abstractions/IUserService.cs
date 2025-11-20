namespace AnimeSite.Core.Abstractions;

public interface IUserService
{
    Task Register(string username, string email, string password);
    Task<string> Login (string username, string password);
    Task<string> LoginGoogle(string email, string googleId, string username);
}