namespace AnimeSite.Core.Models;

public class User
{
    private const int MaxUsernameLength = 30;
    private const int MaxBioLength = 500; // Обмеження для опису

    // 2. Оновлений приватний конструктор приймає нові поля
    private User(Guid id, string username, string email, string passwordHash, string googleId, Role role, string bio, string avatarUrl)
    {
        Id = id;
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        GoogleId = googleId;
        Role = role;
        
        // Нові поля
        Bio = bio;
        AvatarUrl = avatarUrl;
    }

    public Guid Id { get; }
    public string Username { get; }
    public string Email { get; }
    public string PasswordHash { get; } = string.Empty;
    public string GoogleId { get; } = string.Empty;
    public Role Role { get; }

    // 1. Нові властивості (private set для DDD)
    public string Bio { get; private set; } = string.Empty;
    public string AvatarUrl { get; private set; } = string.Empty;

    
    // --- Фабричний метод (Звичайна реєстрація) ---
    public static (User user, string Error) Create(Guid id, string username, string email, string passwordHash)
    {
        var error = string.Empty;

        if (string.IsNullOrWhiteSpace(username) || username.Length > MaxUsernameLength)
        {
            error += $"Username can't be empty or longer than {MaxUsernameLength} symbols. ";
        }

        if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
        {
            error += "Invalid email address. ";
        }

        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            error += "Password hash cannot be empty. ";
        }

        if (!string.IsNullOrEmpty(error))
        {
            return (null, error);
        }

        // При створенні нового юзера Bio та AvatarUrl пусті
        var user = new User(id, username, email, passwordHash, string.Empty, Role.User, string.Empty, string.Empty);
        return (user, error);
    }
    
    // --- Фабричний метод (Google реєстрація) ---
    public static (User user, string Error) CreateGoogleUser(Guid id, string email, string googleId)
    {
        var error = string.Empty;

        if (string.IsNullOrWhiteSpace(email))
        {
            error += "Email cannot be empty. ";
        }
        
        if (string.IsNullOrWhiteSpace(googleId))
        {
            error += "Google ID cannot be empty. ";
        }

        if (!string.IsNullOrEmpty(error))
        {
            return (null, error);
        }

        var username = email.Split('@')[0]; 

        // При створенні через Google Bio та AvatarUrl теж поки що пусті
        var user = new User(id, username, email, string.Empty, googleId, Role.User, string.Empty, string.Empty);
        return (user, error);
    }

    // 3. Оновлений Restore для репозиторія (щоб читати з бази)
    public static User Restore(Guid id, string username, string email, string passwordHash, string googleId, Role role, string bio, string avatarUrl)
    {
        return new User(id, username, email, passwordHash, googleId, role, bio, avatarUrl);
    }

    // 4. !!! НОВИЙ МЕТОД ДЛЯ РЕДАГУВАННЯ ПРОФІЛЮ !!!
    // Сервіс буде викликати саме цей метод
    public void UpdateProfile(string bio, string avatarUrl)
    {
        // Валідація (бізнес-правила)
        if (bio.Length > MaxBioLength)
        {
            throw new ArgumentException($"Bio cannot be longer than {MaxBioLength} characters.");
        }

        // Зміна стану
        Bio = bio;
        AvatarUrl = avatarUrl;
    }
}