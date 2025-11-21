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
            GoogleId = user.GoogleId,
            RoleId = (int)user.Role
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

    public async Task<List<User>> GetAll()
    {
        var userEntities = await _context.Users
            .AsNoTracking()
            .ToListAsync();
        return userEntities.Select(u => MapToDomain(u)).ToList();
    }

    public async Task<User?> GetById(Guid id)
    {
        var userEntity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);

        if (userEntity == null)
        {
            return null;
        }
        
        return MapToDomain(userEntity);
    }
    

    private User MapToDomain(UserEntity entity)
    {
        // 1. Якщо це Google користувач
        if (!string.IsNullOrEmpty(entity.GoogleId))
        {
            var (googleUser, googleError) = User.CreateGoogleUser(entity.Id, entity.Email, entity.GoogleId);
            return googleUser;
        }
        
        // 2. Якщо це звичайний користувач
        var (normalUser, error) = User.Create(entity.Id, entity.Username, entity.Email, entity.PasswordHash);
        
        // !!! ОСЬ ТУТ БУЛА ПРОБЛЕМА !!!
        // Раніше ми просто повертали normalUser (який був null), і сервіс думав, що юзера немає.
        // Тепер ми явно кидаємо помилку, щоб побачити її в Swagger.
        if (!string.IsNullOrEmpty(error) || normalUser == null)
        {
            throw new InvalidOperationException($"Data Integrity Error for User {entity.Email}: {error}");
        }

        return User.Restore(
            entity.Id, 
            entity.Username, 
            entity.Email, 
            entity.PasswordHash, 
            entity.GoogleId, 
            (Role)entity.RoleId // Перетворюємо int назад в Enum
        );
    }
}