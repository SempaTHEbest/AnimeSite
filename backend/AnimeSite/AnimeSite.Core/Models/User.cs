namespace AnimeSite.Core.Models;

public class User
{
    private const int MaxUsernameLength = 30;
    public User(Guid id, string username, string email, string passwordHash, string googleId, Role role)
    {
        Id = id;
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        GoogleId = googleId;
        Role = role;
    }
    public Guid Id { get;}
    public string Username { get;}
    public string Email { get;}
    public string PasswordHash { get; } = string.Empty;
    public string GoogleId { get; } = string.Empty;
    public Role Role { get;}
    
    //Fabric static method
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

        // googleId передаємо як null або пустий рядок
        var user = new User(id, username, email, passwordHash, string.Empty, Role.User);
        return (user, error);
    }
    
    //Fabric static method for google
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

        // Замість username беремо частину пошти до @ (наприклад sempa1 з sempa1@gmail.com)
        var username = email.Split('@')[0]; 

        // passwordHash пустий, бо пароля немає
        var user = new User(id, username, email, string.Empty, googleId, Role.User);
        return (user, error);
    }

    public static User Restore(Guid id, string username, string email, string passwordHash, string googleId, Role role)
    {
        return new User(id, username, email, passwordHash, googleId, role);
    }
}