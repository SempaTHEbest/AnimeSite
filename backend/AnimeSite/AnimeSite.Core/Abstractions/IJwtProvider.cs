using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IJwtProvider
{
    string GenerateToken(User user);
}