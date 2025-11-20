using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeSite.DataAccess.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AnimeSiteDbContext _context;

    public UserRepository(AnimeSiteDbContext context)
    {
        _context = context;
    }

    public async Task Add(User user)
    {
        var userEntity = new UserEntity
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            GoogleId = user.GoogleId
        };
        
        await _context.Users.AddAsync(userEntity);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetByEmail(string email)
    {
        var userEntity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email);
        if (userEntity == null)
        {
            return null;
        }

        return MapToDomain(userEntity);
    }

    private User MapToDomain(UserEntity entity)
    {
        if (!string.IsNullOrEmpty(entity.GoogleId))
        {
            var (user, _) = User.CreateGoogleUser(entity.Id, entity.Email, entity.GoogleId);
            return user;
        }

        var (normalUser, _) = User.Create(entity.Id, entity.Username, entity.Email, entity.PasswordHash);
        return normalUser;
    }
}